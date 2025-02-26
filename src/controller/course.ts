import { Prisma } from '@prisma/client'
import { Workbook } from 'exceljs'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { TABLE_NAME, WORKSHEET_NAME } from '../constants'
import prisma from '../database/db-client'
import { validatedHeaders } from '../utils/validateHeaders'

export class CourseController {
  public async createCourse(
    this: FastifyInstance,
    request: FastifyRequest<{ Body: Prisma.CourseCreateInput }>,
    reply: FastifyReply
  ) {
    try {
      const { ...body } = request.body

      await prisma.course.create({
        data: {
          ...body,
        },
      })

      reply.code(201).send({ message: 'Course created successfully' })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }

  public async updateCourse(
    this: FastifyInstance,
    request: FastifyRequest<{ Body: Prisma.CourseUncheckedUpdateInput }>,
    reply: FastifyReply
  ) {
    try {
      const { id, ...body } = request.body

      await prisma.course.update({
        where: { id: String(id) },
        data: {
          ...body,
        },
      })

      reply.code(200).send({ message: 'Course updated successfully' })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }

  public async deleteCourse(
    this: FastifyInstance,
    request: FastifyRequest<{ Params: Prisma.CourseWhereUniqueInput }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params

      await prisma.course.delete({
        where: { id: String(id) },
      })

      reply.code(200).send({ message: 'Course deleted successfully' })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }

  public async uploadCourse(
    this: FastifyInstance,
    request: FastifyRequest<{ Body: Prisma.CourseCreateInput }>,
    reply: FastifyReply
  ) {
    try {
      const file = await request.file()

      if (!file) {
        return reply.status(400).send({ error: 'No file uploaded.' })
      }

      const workbook = new Workbook()
      await workbook.xlsx.load((await file.toBuffer()) as any)

      const sheet = workbook.getWorksheet(WORKSHEET_NAME.COURSES)

      if (!sheet) {
        return reply.status(400).send({
          error: `Invalid Excel file format. Change the name of the sheet to "${WORKSHEET_NAME.COURSES}"`,
        })
      }

      const headers = sheet.getRow(1).values as string[]

      const validHeaders = await validatedHeaders(headers, TABLE_NAME.COURSE)

      if (validHeaders.length === 0) {
        return reply.status(400).send({
          error: 'No valid headers found in the Excel file.',
        })
      }

      const createData: Prisma.CourseCreateInput[] = []

      sheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return
        const data: Record<string, string | null> = {}

        headers.forEach((header, index) => {
          const value = row.getCell(index).value

          data[header] = value?.toString()?.trim() ?? null
        })

        createData.push(data as unknown as Prisma.CourseCreateInput)
      })

      const errors: string[] = []

      for (const data of createData) {
        try {
          if (!data.id) {
            errors.push('ID is required')
            continue
          }

          const existingCourse = await prisma.course.findUnique({
            where: { id: data.id },
          })

          if (existingCourse) {
            errors.push(`Course with ID "${data.id}" already exists`)
            continue
          }

          await prisma.course.create({ data })
        } catch (error: any) {
          errors.push(`Error processing ID "${data.id}": ${error.message}`)
        }
      }

      if (errors.length > 0) {
        return reply.status(400).send({ error: errors })
      }

      reply.code(201).send({ message: 'Course upload successfully' })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }

  public async getAllCourse(
    this: FastifyInstance,
    _request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const result = await prisma.course.findMany({})

      reply.code(200).send({ response: result })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }
}
