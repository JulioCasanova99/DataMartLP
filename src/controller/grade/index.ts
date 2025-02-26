import { Prisma } from '@prisma/client'
import { Workbook } from 'exceljs'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { WORKSHEET_NAME } from '../../constants'
import prisma from '../../database/db-client'
import { queryGetPeriodByParams } from '../period/query'
import {
  queryGetAverageScoreBySubject,
  queryGetAverageScoreBySubjectDetails,
  queryGetAverageScoreByTeacher,
  queryGetAverageScoreByYearAndSubject,
  queryGetGradesByCourseAndSubject,
  queryGetInformationByTeacherAndSubject,
  queryGetTotalPercentStudentsPerRange,
  queryGetTotalsByYear,
  queryGetTotalStudentsByRangeOfScore,
} from './query'

export class GradeController {
  public async uploadGrades(
    this: FastifyInstance,
    request: FastifyRequest<{
      Body: Prisma.StudentCreateInput
      Querystring: { year: string }
    }>,
    reply: FastifyReply
  ) {
    try {
      const { year } = request.query
      const file = await request.file()

      if (!file) {
        return reply.status(400).send({ error: 'No file uploaded.' })
      }

      const workbook = new Workbook()
      await workbook.xlsx.load((await file.toBuffer()) as any)

      const sheet = workbook.getWorksheet(WORKSHEET_NAME.GRADES)
      if (!sheet) {
        return reply.status(400).send({
          error: `Invalid Excel file format. Change the name of the sheet to "${WORKSHEET_NAME.GRADES}"`,
        })
      }

      const headers: string[] = []
      const dataToInsert: Prisma.GradeUncheckedCreateInput[] = []
      const initialRow = 2

      sheet.getRow(1).eachCell((cell, colNumber) => {
        if (colNumber > initialRow) {
          headers.push(cell.value as string)
        }
      })

      const rows = sheet.getRows(2, sheet.rowCount - 1)
      if (!rows) {
        return reply
          .status(400)
          .send({ error: 'Invalid Excel file format. No data found.' })
      }

      const errors: string[] = []

      const dniStudents = rows.map((row) => String(row.getCell(1).value))
      const students = await prisma.student.findMany({
        where: {
          dni: { in: dniStudents },
        },
      })

      const studentsMap = new Map(
        students.map((student) => [student.dni, student])
      )

      const periods = await prisma.period.findMany({
        where: {
          academicYearId: year,
          label: { in: headers },
        },
      })

      const periodsMap = new Map(
        periods.map((period) => [period.label, period])
      )

      for (const row of rows) {
        const dniStudent = String(row.getCell(1).value)
        const subjectId = String(row.getCell(2).value)

        const student = studentsMap.get(dniStudent)
        if (!student) {
          errors.push(`Student with DNI ${dniStudent} not found.`)
          continue
        }

        for (const [index, period] of headers.entries()) {
          const periodRecord = periodsMap.get(period)

          if (!periodRecord) {
            errors.push(`Period with label "${period}" not found.`)
            continue
          }

          const score = Number(row.getCell(index + initialRow + 1).value) || 0
          dataToInsert.push({
            studentId: student.id,
            periodId: periodRecord.id,
            subjectId,
            score,
          })
        }
      }

      if (errors.length > 0) {
        return reply.status(400).send({ error: errors })
      }

      await prisma.grade.createMany({
        data: dataToInsert,
      })

      reply.code(200).send({ message: 'Grades upload successfully' })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }

  public async createGrade(
    this: FastifyInstance,
    request: FastifyRequest<{ Body: Prisma.GradeUncheckedCreateInput[] }>,
    reply: FastifyReply
  ) {
    try {
      const body = request.body

      await Promise.all(
        body.map(async (grade) => {
          await prisma.grade.create({
            data: {
              ...grade,
              studentId: Number(grade.studentId),
              periodId: Number(grade.periodId),
            },
          })
        })
      )

      reply.code(201).send({ message: 'Grade created successfully' })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }

  public async updateGrades(
    this: FastifyInstance,
    request: FastifyRequest<{
      Body: Prisma.GradeUncheckedUpdateManyInput[]
      Querystring: { courseId: string; year: string }
    }>,
    reply: FastifyReply
  ) {
    try {
      const { courseId, year } = request.query
      const body = request.body

      const existingItems = await prisma.grade.findMany({
        where: {
          subjectId: { in: body.map((grade) => String(grade.subjectId)) },
          student: { courseId },
          period: { academicYearId: year },
        },
      })

      const receivedIds = body.map((grade) => Number(grade.id))
      const itemsToDelete = existingItems.filter(
        (item) => !receivedIds.includes(item.id)
      )

      await prisma.grade.deleteMany({
        where: {
          id: { in: itemsToDelete.map((item) => item.id) },
        },
      })

      await Promise.all([
        body.forEach(async (grade) => {
          const { id, ...rest } = grade
          const existingGrade = await prisma.grade.findUnique({
            where: { id: Number(id) },
          })

          if (!existingGrade) {
            await prisma.grade.create({
              data: {
                score: rest.score ? Number(rest.score) : 0,
                studentId: Number(rest.studentId),
                periodId: Number(rest.periodId),
                subjectId: String(rest.subjectId),
              },
            })
            return
          }

          await prisma.grade.update({
            where: {
              id: Number(grade.id),
            },
            data: {
              score: grade.score,
            },
          })
        }),
      ])

      reply.code(201).send({
        message: 'Grade created successfully',
      })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }

  public async getGradesByYear(
    this: FastifyInstance,
    request: FastifyRequest<{ Querystring: { year: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { year } = request.query

      const results = await prisma.$queryRaw(
        queryGetGradesByCourseAndSubject({
          academicYearId: year,
        })
      )

      reply.code(200).send({ response: results })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }

  public async getGradesByParams(
    this: FastifyInstance,
    request: FastifyRequest<{
      Querystring: { year: string; subjectId: string; courseId: string }
    }>,
    reply: FastifyReply
  ) {
    try {
      const { year, subjectId, courseId } = request.query

      const results = await prisma.grade.findMany({
        where: {
          subjectId: subjectId,
          student: {
            courseId: courseId,
          },
          period: {
            academicYearId: year,
          },
        },
        include: { period: { select: { label: true } } },
        orderBy: { student: { lastName: 'asc' } },
      })

      const periods: any[] = await prisma.$queryRaw(
        queryGetPeriodByParams({
          academicYearId: year,
        })
      )

      reply.code(200).send({
        response: {
          results: results.map((result) => {
            return {
              ...result,
              score: Number(result.score),
            }
          }),
          periods,
        },
      })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }

  public async getAverageScoreBySubject(
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
    const { year, courseId, teacherId } = request.query

    try {
      const averageScore = await prisma.$queryRaw(
        queryGetAverageScoreBySubject({
          academicYearId: year,
          courseId: courseId ?? undefined,
          teacherId: teacherId ? Number(teacherId) : undefined,
        })
      )

      reply.code(200).send({ response: averageScore })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }

  public async getAverageScoreBySubjectDetails(
    this: FastifyInstance,
    request: FastifyRequest<{
      Querystring: {
        year: string
        courseId: string | null
        teacherId: string | null
        subject: string
      }
    }>,
    reply: FastifyReply
  ) {
    const { year, courseId, teacherId, subject } = request.query

    try {
      const averageScore = await prisma.$queryRaw(
        queryGetAverageScoreBySubjectDetails({
          academicYearId: year,
          courseId: courseId ?? undefined,
          teacherId: teacherId ? Number(teacherId) : undefined,
          subjectId: subject,
        })
      )

      reply.code(200).send({ response: averageScore })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }

  public async getAverageScoreByYearAndSubject(
    this: FastifyInstance,
    request: FastifyRequest<{
      Querystring: {
        courseId: string | null
        teacherId: string | null
      }
    }>,
    reply: FastifyReply
  ) {
    const { courseId, teacherId } = request.query

    try {
      const averageScore = await prisma.$queryRaw(
        queryGetAverageScoreByYearAndSubject({
          courseId: courseId ?? undefined,
          teacherId: teacherId ? Number(teacherId) : undefined,
        })
      )

      reply.code(200).send({ response: averageScore })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }

  public async getTotalsByYear(
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
    const { year, courseId, teacherId } = request.query

    try {
      const averageScore: any[] = await prisma.$queryRaw(
        queryGetTotalsByYear({
          academicYearId: year,
          courseId: courseId ?? undefined,
          teacherId: teacherId ? Number(teacherId) : undefined,
        })
      )

      reply.code(200).send({ response: averageScore[0] })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }

  public async getTotalPercentStudentsPerRange(
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
    const { year, courseId, teacherId } = request.query

    try {
      const averageScore = await prisma.$queryRaw(
        queryGetTotalPercentStudentsPerRange({
          academicYearId: year,
          courseId: courseId ?? undefined,
          teacherId: teacherId ? Number(teacherId) : undefined,
        })
      )

      reply.code(200).send({ response: averageScore })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }

  public async getTotalStudentsByRange(
    this: FastifyInstance,
    request: FastifyRequest<{
      Querystring: {
        year: string
        courseId: string | null
        teacherId: string | null
        range: string
      }
    }>,
    reply: FastifyReply
  ) {
    const { year, courseId, teacherId, range } = request.query

    try {
      const averageScore = await prisma.$queryRaw(
        queryGetTotalStudentsByRangeOfScore(
          {
            academicYearId: year,
            courseId: courseId ?? undefined,
            teacherId: teacherId ? Number(teacherId) : undefined,
          },
          range
        )
      )

      reply.code(200).send({ response: averageScore })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }

  public async getAverageScoreByTeacher(
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
    const { year, courseId, teacherId } = request.query

    try {
      const averageScore = await prisma.$queryRaw(
        queryGetAverageScoreByTeacher({
          academicYearId: year,
          courseId: courseId ?? undefined,
          teacherId: teacherId ? Number(teacherId) : undefined,
        })
      )

      reply.code(200).send({ response: averageScore })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }

  public async getInformationByTeacherAndSubject(
    this: FastifyInstance,
    request: FastifyRequest<{
      Querystring: {
        year: string
        courseId: string | null
        teacherId: string | null
        subject: string
        teacher: string
      }
    }>,
    reply: FastifyReply
  ) {
    const { year, courseId, teacherId, teacher, subject } = request.query

    try {
      const averageScore = await prisma.$queryRaw(
        queryGetInformationByTeacherAndSubject(
          {
            academicYearId: year,
            courseId: courseId ?? undefined,
            teacherId: teacherId ? Number(teacherId) : undefined,
          },
          subject,
          teacher
        )
      )

      reply.code(200).send({ response: averageScore })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }
}
