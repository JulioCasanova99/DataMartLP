import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import prisma from '../database/db-client'

export class TypePeriodController {
  public async getAllTypePeriod(
    this: FastifyInstance,
    _request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const result = await prisma.typePeriod.findMany({
        select: { id: true, type: true },
      })

      reply.code(200).send({ response: result })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }
}
