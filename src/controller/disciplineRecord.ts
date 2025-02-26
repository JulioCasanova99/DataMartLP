import { Prisma } from '@prisma/client'
import { Workbook } from 'exceljs'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { WORKSHEET_NAME } from '../constants'
import prisma from '../database/db-client'

export class DisciplineRecordController {
  public async createDisciplineRecord(
    this: FastifyInstance,
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const file = await request.file()

      if (!file) {
        return reply.status(400).send({ error: 'No file uploaded.' })
      }

      const workbook = new Workbook()
      await workbook.xlsx.load((await file.toBuffer()) as any)

      const sheet = workbook.getWorksheet(WORKSHEET_NAME.DISCIPLINE)
      const headers: any[] = []
      const dataToInsert: Prisma.DisciplineRecordCreateManyInput[] = []

      if (!sheet) {
        return reply.status(400).send({
          error: `Invalid Excel file format. Change the name of the sheet to "${WORKSHEET_NAME.DISCIPLINE}"`,
        })
      }

      sheet.getRow(1).eachCell((cell, colNumber) => {
        if (colNumber > 1) {
          headers.push(cell.value)
        }
      })

      sheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return

        const dniStudent = row.getCell(1).value

        headers.forEach((period, index) => {
          const observation = row.getCell(index + 2).value

          dataToInsert.push({
            studentId: Number(dniStudent),
            periodId: Number(period),
            observation: String(observation),
          })
        })
      })

      const result = await Promise.all(
        dataToInsert.map(async (data) => {
          const period = await prisma.period.findFirst({
            where: { label: String(data.periodId) },
          })
          const student = await prisma.student.findFirst({
            where: { dni: String(data.studentId) },
          })

          if (!period || !student) {
            throw new Error(
              `Invalid period or student for record: Period ${data.periodId}, Student ${data.studentId}`
            )
          }

          return {
            ...data,
            periodId: period.id,
            studentId: student.id,
          }
        })
      )

      await prisma.disciplineRecord.createMany({
        data: result,
      })

      reply
        .code(201)
        .send({ message: 'Discipline Record created successfully' })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }
}
