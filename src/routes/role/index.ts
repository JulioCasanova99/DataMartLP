import { FastifyInstance } from 'fastify'
import path from 'path'
import { RoleController } from '../../controller/role'
import { ERRORS_MESSAGE } from '../errors'

const controller = new RoleController()
const tags = [path.basename(__dirname)]

const router = async (app: FastifyInstance) => {
  app.route({
    method: 'GET',
    url: '/list',
    schema: {
      tags,
      response: {
        500: ERRORS_MESSAGE,
        404: ERRORS_MESSAGE,
        400: ERRORS_MESSAGE,
      },
    },
    handler: controller.getRoles,
  })
}

export default router
