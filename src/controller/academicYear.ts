import { Prisma } from '@prisma/client'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import prisma from '../database/db-client'

export class AcademicYear {
  public async getYears(
    this: FastifyInstance,
    _request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const years = await prisma.academicYear.findMany({
        orderBy: { id: 'asc' },
      })

      reply.code(200).send({ response: years })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }

  public async createYear(
    this: FastifyInstance,
    request: FastifyRequest<{ Body: Prisma.AcademicYearCreateInput }>,
    reply: FastifyReply
  ) {
    try {
      const { ...data } = request.body

      if (!data.name) {
        reply.code(400).send({ error: 'Missing "name" field' })
        return
      }

      const existingYear = await prisma.academicYear.findUnique({
        where: { name: data.name },
      })

      if (existingYear) {
        reply.code(400).send({ error: 'Academic year already exists' })
        return
      }

      await prisma.academicYear.create({
        data: data,
      })

      reply.code(200).send({ message: 'Academic year created successfully' })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }

  public async deleteYear(
    this: FastifyInstance,
    request: FastifyRequest<{ Params: Prisma.AcademicYearWhereUniqueInput }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params

      const existingYear = await prisma.academicYear.findUnique({
        where: { id },
      })

      if (!existingYear) {
        reply.code(400).send({ error: 'Academic year not found' })
        return
      }

      await prisma.academicYear.delete({
        where: { id },
      })

      reply.code(200).send({ message: 'Academic year deleted successfully' })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }

  public async updateYear(
    this: FastifyInstance,
    request: FastifyRequest<{
      Body: Prisma.AcademicYearUncheckedUpdateInput
    }>,
    reply: FastifyReply
  ) {
    try {
      const { ...data } = request.body

      const existingYear = await prisma.academicYear.findUnique({
        where: { id: String(data.id) },
      })

      if (!existingYear) {
        reply.code(400).send({ error: 'Academic year not found' })
        return
      }

      await prisma.academicYear.update({
        where: { id: String(data.id) },
        data: data,
      })

      reply.code(200).send({ message: 'Academic year updated successfully' })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }
}
