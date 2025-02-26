import { Prisma } from '@prisma/client'
import { Workbook } from 'exceljs'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { TABLE_NAME, WORKSHEET_NAME } from '../../constants'
import prisma from '../../database/db-client'
import { validatedHeaders } from '../../utils/validateHeaders'
import {
  queryGetGradesBySubjectCourseAndTeacher,
  queryGetSubjectWithAverageGrade,
} from './query'

export class SubjectController {
  public async createSubject(
    this: FastifyInstance,
    request: FastifyRequest<{ Body: Prisma.SubjectCreateInput }>,
    reply: FastifyReply
  ) {
    try {
      const { ...body } = request.body

      await prisma.subject.create({
        data: {
          ...body,
        },
      })

      reply.code(201).send({ message: 'Subject created successfully' })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }

  public async uploadSubject(
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

      const sheet = workbook.getWorksheet(WORKSHEET_NAME.SUBJECTS)

      if (!sheet) {
        return reply.status(400).send({
          error: `Invalid Excel file format. Change the name of the sheet to "${WORKSHEET_NAME.SUBJECTS}"`,
        })
      }

      const headers = sheet.getRow(1).values as string[]

      const validHeaders = await validatedHeaders(headers, TABLE_NAME.SUBJECT)

      if (validHeaders.length === 0) {
        return reply.status(400).send({
          error: 'No valid headers found in the Excel file.',
        })
      }

      const createData: Prisma.SubjectCreateInput[] = []

      sheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return
        const data: Record<string, string | null> = {}

        headers.forEach((header, index) => {
          const value = row.getCell(index).value

          data[header] = value?.toString()?.trim() ?? null
        })

        createData.push(data as unknown as Prisma.SubjectCreateInput)
      })

      const errors: string[] = []

      for (const data of createData) {
        try {
          if (!data.id) {
            errors.push('ID is required')
            continue
          }

          const existingSubject = await prisma.subject.findUnique({
            where: { id: data.id },
          })

          if (existingSubject) {
            errors.push(`Subject with ID "${data.id}" already exists`)
            continue
          }

          await prisma.subject.create({ data })
        } catch (error: any) {
          errors.push(`Error processing ID "${data.id}": ${error.message}`)
        }
      }

      if (errors.length > 0) {
        return reply.status(400).send({ error: errors })
      }

      reply.code(201).send({ message: 'Subject upload successfully' })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }

  public async getAllSubjects(
    this: FastifyInstance,
    _request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const result = await prisma.subject.findMany()

      reply.code(200).send({ response: result })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }

  public async getSubjectsWithAverageGrade(
    this: FastifyInstance,
    request: FastifyRequest<{
      Querystring: {
        year: string
        courseId: string | null
        teacherId: string | null
      }
    }>,
    reply: FastifyReply
  ) {
    try {
      const { year, courseId, teacherId } = request.query

      const subjects = await prisma.subject.findMany()

      const mappedSubjects = await Promise.all(
        subjects.map(async (subject) => {
          const score: any[] = await prisma.$queryRaw(
            queryGetSubjectWithAverageGrade({
              academicYearId: year,
              subjectId: subject.id,
              courseId: courseId ?? undefined,
              teacherId: teacherId ? Number(teacherId) : undefined,
            })
          )

          return {
            ...subject,
            score: score[0]?.score ?? 0,
          }
        })
      )

      reply.code(200).send({ response: mappedSubjects })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }

  public async getGradesBySubjectCourseAndTeacher(
    this: FastifyInstance,
    request: FastifyRequest<{
      Querystring: {
        year: string
        courseId: string | null
        teacherId: string | null
        subjectId: string
      }
    }>,
    reply: FastifyReply
  ) {
    const { year, courseId, teacherId, subjectId } = request.query

    try {
      const results = await prisma.$queryRaw(
        queryGetGradesBySubjectCourseAndTeacher({
          academicYearId: year,
          courseId: courseId ?? undefined,
          teacherId: teacherId ? Number(teacherId) : undefined,
          subjectId,
        })
      )

      reply.code(200).send({ response: results })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }

  public async updateSubject(
    this: FastifyInstance,
    request: FastifyRequest<{ Body: Prisma.SubjectUpdateInput }>,
    reply: FastifyReply
  ) {
    try {
      const { id, ...body } = request.body

      await prisma.subject.update({
        where: { id: String(id) },
        data: {
          ...body,
        },
      })

      reply.code(200).send({ message: 'Subject updated successfully' })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }

  public async deleteSubject(
    this: FastifyInstance,
    request: FastifyRequest<{ Params: Prisma.SubjectWhereUniqueInput }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params

      await prisma.subject.delete({
        where: { id: String(id) },
      })

      reply.code(200).send({ message: 'Subject deleted successfully' })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }
}
