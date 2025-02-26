import { Prisma } from '@prisma/client'
import { Workbook } from 'exceljs'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { TABLE_NAME, WORKSHEET_NAME } from '../constants'
import prisma from '../database/db-client'
import { validatedHeaders } from '../utils/validateHeaders'

export class TeacherController {
  public async createTeacher(
    this: FastifyInstance,
    request: FastifyRequest<{ Body: Prisma.TeacherCreateInput }>,
    reply: FastifyReply
  ) {
    try {
      const { ...body } = request.body

      await prisma.teacher.create({
        data: {
          ...body,
        },
      })

      reply.code(201).send({ message: 'Teacher created successfully' })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }

  public async updateTeacher(
    this: FastifyInstance,
    request: FastifyRequest<{ Body: Prisma.TeacherUncheckedUpdateInput }>,
    reply: FastifyReply
  ) {
    try {
      const { id, ...body } = request.body

      await prisma.teacher.update({
        where: { id: Number(id) },
        data: {
          ...body,
        },
      })

      reply.code(200).send({ message: 'Teacher updated successfully' })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }

  public async deleteTeacher(
    this: FastifyInstance,
    request: FastifyRequest<{ Params: Prisma.TeacherWhereUniqueInput }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params

      await prisma.teacher.delete({
        where: { id: Number(id) },
      })

      reply.code(200).send({ message: 'Teacher deleted successfully' })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }

  public async getAllTeacher(
    this: FastifyInstance,
    _request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const result = await prisma.teacher.findMany({
        include: {
          courseTeachers: {
            select: {
              course: { select: { name: true } },
              subject: { select: { name: true } },
              courseId: true,
              subjectId: true,
            },
          },
        },
      })

      reply.code(200).send({ response: result })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }

  public async uploadTeacher(
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

      const sheet = workbook.getWorksheet(WORKSHEET_NAME.TEACHERS)

      if (!sheet) {
        return reply.status(400).send({
          error: `Invalid Excel file format. Change the name of the sheet to "${WORKSHEET_NAME.TEACHERS}"`,
        })
      }

      const headers = sheet.getRow(1).values as string[]

      const validHeaders = await validatedHeaders(headers, TABLE_NAME.TEACHER)

      if (validHeaders.length === 0) {
        return reply.status(400).send({
          error: 'No valid headers found in the Excel file.',
        })
      }

      const createData: Prisma.TeacherCreateInput[] = []

      sheet.eachRow(async (row, rowNumber) => {
        if (rowNumber === 1) return

        const data: Record<string, string | null> = {}

        headers.forEach((header, index) => {
          let value = row.getCell(index).value

          if (value && typeof value === 'object' && 'hyperlink' in value) {
            value = value.hyperlink
          }
          if (value && typeof value === 'object' && 'text' in value) {
            value = value.text as string
          }

          if (typeof value === 'string' && value.startsWith('mailto:')) {
            value = value.replace('mailto:', '').trim()
          }

          data[header] = value?.toString()?.trim() ?? null
        })

        createData.push(data)
      })

      const errors: string[] = []

      for (const data of createData) {
        try {
          if (!data.dni) {
            errors.push('DNI is required.')
            continue
          }

          if (isNaN(Number(data.dni))) {
            errors.push(`DNI "${data.dni}" must be a number.`)
            continue
          }

          const existingTeacher = await prisma.teacher.findFirst({
            where: {
              OR: [{ dni: data.dni }, { email: data.email }],
            },
          })

          if (existingTeacher) {
            errors.push(
              `Teacher with DNI "${data.dni}" or email "${data.email}" already exists.`
            )
            continue
          }

          await prisma.teacher.create({ data })
        } catch (error: any) {
          errors.push(`Error processing DNI "${data.dni}": ${error.message}`)
        }
      }

      if (errors.length > 0) {
        return reply.status(400).send({ error: errors })
      }

      reply.code(201).send({ message: 'Teacher upload successfully' })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }
}
