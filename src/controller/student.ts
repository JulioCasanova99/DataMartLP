import { Prisma } from '@prisma/client'
import { Workbook } from 'exceljs'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { GENDER_PERMITTED, TABLE_NAME, WORKSHEET_NAME } from '../constants'
import prisma from '../database/db-client'
import { validatedHeaders } from '../utils/validateHeaders'

export class StudentController {
  public async createStudent(
    this: FastifyInstance,
    request: FastifyRequest<{ Body: Prisma.StudentUncheckedCreateInput }>,
    reply: FastifyReply
  ) {
    try {
      const { ...body } = request.body

      const student = await prisma.student.findFirst({
        where: {
          dni: body.dni,
        },
      })

      if (student) {
        return reply.code(404).send({ error: 'Find Student in database' })
      }

      await prisma.student.create({
        data: {
          ...body,
          representativeId: Number(body.representativeId) || null,
          academicYearId: body.academicYearId ?? null,
        },
      })

      reply.code(201).send({ message: 'Student created successfully' })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }

  public async uploadStudents(
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

      const sheet = workbook.getWorksheet(WORKSHEET_NAME.STUDENTS)

      if (!sheet) {
        return reply.status(400).send({
          error: `Invalid Excel file format. Change the name of the sheet to "${WORKSHEET_NAME.STUDENTS}"`,
        })
      }

      const headers = sheet.getRow(1).values as string[]

      const validHeaders = await validatedHeaders(headers, TABLE_NAME.STUDENT)

      if (validHeaders.length === 0) {
        return reply.status(400).send({
          error: 'No valid headers found in the Excel file.',
        })
      }

      const createData: Prisma.StudentUncheckedCreateInput[] = []

      sheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return
        const data: Record<string, string | number | null> = {}

        headers.forEach((header, index) => {
          const value = row.getCell(index).value

          data[header] = value?.toString()?.trim() ?? null
          if (header === 'dateOfBirth') data[header] = (value as string) ?? null
          if (header === 'representativeId')
            data[header] = Number(value) || null
        })

        createData.push(data)
      })

      const errors: string[] = []

      await Promise.all(
        createData.map(async (data) => {
          try {
            if (!data.dni) {
              errors.push('DNI is required.')
              return
            }

            if (!data.academicYearId) {
              errors.push('Academic year ID is required.')
              return
            }

            if (isNaN(Number(data.dni))) {
              errors.push(`DNI "${data.dni}" must be a number.`)
              return
            }

            const existingCourse = await prisma.course.findFirst({
              where: {
                id: data.courseId as string,
              },
            })

            if (!existingCourse) {
              errors.push(
                `Course with ID "${data.courseId}" does not exist in the database.`
              )
              return
            }

            const existingAcademicYear = await prisma.academicYear.findFirst({
              where: {
                id: data.academicYearId,
              },
            })

            if (!existingAcademicYear) {
              errors.push(
                `Academic year with ID "${data.academicYearId}" does not exist in the database.`
              )
              return
            }

            const existingStudent = await prisma.student.findFirst({
              where: {
                dni: data.dni,
              },
            })

            if (existingStudent) {
              errors.push(
                `Student with DNI "${data.dni}" already exists in the database.`
              )
              return
            }

            if (
              data.gender &&
              Object.values(GENDER_PERMITTED).indexOf(data.gender) === -1
            ) {
              errors.push(
                `Invalid gender "${
                  data.gender
                }" found. Please use the following options: ${GENDER_PERMITTED.join(
                  ', '
                )}`
              )
              return
            }

            await prisma.student.create({ data })
          } catch (error: any) {
            errors.push(`Error processing DNI "${data.dni}": ${error.message}`)
          }
        })
      )

      if (errors.length > 0) {
        return reply.status(400).send({ error: errors })
      }

      reply.code(201).send({ message: 'Student upload successfully' })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }

  public async updateStudent(
    this: FastifyInstance,
    request: FastifyRequest<{ Body: Prisma.StudentUncheckedUpdateInput }>,
    reply: FastifyReply
  ) {
    try {
      const { id, ...body } = request.body

      await prisma.student.update({
        where: { id: Number(id) },
        data: {
          ...body,
          representativeId: Number(body.representativeId) || null,
          academicYearId: body.academicYearId || null,
        },
      })

      reply.code(200).send({ message: 'Student updated successfully' })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }

  public async deleteStudent(
    this: FastifyInstance,
    request: FastifyRequest<{ Params: Prisma.StudentWhereUniqueInput }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params

      await prisma.student.delete({
        where: { id: Number(id) },
      })

      reply.code(200).send({ message: 'Student deleted successfully' })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }

  public async getAllStudent(
    this: FastifyInstance,
    request: FastifyRequest<{ Querystring: { year: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { year } = request.query
      const result = await prisma.student.findMany({
        where: {
          academicYearId: year || undefined,
        },
        include: {
          representative: {
            select: {
              fullName: true,
            },
          },
          course: {
            select: {
              name: true,
            },
          },
          academicYear: {
            select: {
              name: true,
            },
          },
        },
        orderBy: [{ courseId: 'asc' }, { lastName: 'asc' }],
      })

      reply.code(200).send({ response: result })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }

  public async getStudentsByParams(
    this: FastifyInstance,
    request: FastifyRequest<{
      Querystring: { courseId: string }
    }>,
    reply: FastifyReply
  ) {
    try {
      const { courseId } = request.query
      const students = await prisma.student.findMany({
        where: {
          courseId: courseId,
        },
        select: {
          fullName: true,
          id: true,
        },
      })

      reply.code(200).send({ response: students })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }
}
