import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import prisma from '../database/db-client'

export class RoleController {
  public async getRoles(
    this: FastifyInstance,
    _request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const roles = await prisma.role.findMany({
        select: {
          id: true,
          type: true,
        },
      })

      reply.code(201).send({ response: roles })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }
}
