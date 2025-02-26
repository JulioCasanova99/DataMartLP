import { FastifyInstance } from 'fastify'
import path from 'path'
import { TypePeriodController } from '../../controller/typePeriod'
import { ERRORS_MESSAGE } from '../errors'

const controller = new TypePeriodController()
const tags = [path.basename(__dirname)]

const router = async (app: FastifyInstance) => {
  app.route({
    method: 'GET',
    url: '/list',
    preValidation: [app.authenticate],
    schema: {
      tags,
      response: {
        500: ERRORS_MESSAGE,
        404: ERRORS_MESSAGE,
        400: ERRORS_MESSAGE,
      },
    },
    handler: controller.getAllTypePeriod,
  })
}

export default router
