import { Prisma } from '@prisma/client'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import prisma from '../database/db-client'

export class CourseTeacherController {
  public async createCourseTeacher(
    this: FastifyInstance,
    request: FastifyRequest<{ Body: Prisma.CourseTeacherCreateManyInput[] }>,
    reply: FastifyReply
  ) {
    try {
      const body = request.body

      if (body.length === 0) {
        reply.code(400).send({ error: 'No data provided' })
        return
      }

      for (const item of body) {
        const existingData = await prisma.courseTeacher.findUnique({
          where: {
            subjectId_teacherId_courseId_academicYearId: {
              subjectId: item.subjectId,
              teacherId: Number(item.teacherId),
              courseId: item.courseId,
              academicYearId: item.academicYearId,
            },
          },
        })

        if (existingData) {
          reply.code(400).send({ error: 'Relation already exists' })
          return
        }
      }

      await prisma.courseTeacher.createMany({
        data: body,
      })

      reply.code(201).send({ message: 'Course Teacher created successfully' })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }

  public async getAllCourseTeacher(
    this: FastifyInstance,
    request: FastifyRequest<{ Querystring: { year: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { year } = request.query
      const result = await prisma.courseTeacher.findMany({
        where: { academicYearId: year || undefined },
        include: {
          course: true,
          teacher: true,
          subject: true,
          academicYear: true,
        },
      })

      reply.code(200).send({ response: result })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }

  public async deleteCourseTeacher(
    this: FastifyInstance,
    request: FastifyRequest<{ Body: Prisma.CourseTeacherWhereUniqueInput }>,
    reply: FastifyReply
  ) {
    try {
      const { courseId, teacherId, subjectId, academicYearId } = request.body

      await prisma.courseTeacher.delete({
        where: {
          subjectId_teacherId_courseId_academicYearId: {
            subjectId: String(subjectId),
            teacherId: Number(teacherId),
            courseId: String(courseId),
            academicYearId: String(academicYearId),
          },
        },
      })

      reply.code(200).send({ message: 'Course Teacher deleted successfully' })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }
}
