import { Type } from '@sinclair/typebox'
import { FastifyInstance } from 'fastify'
import path from 'path'
import { PeriodController } from '../../controller/period'
import { PeriodUpdateSchema } from '../../schema/period'
import { ERRORS_MESSAGE } from '../errors'

const controller = new PeriodController()
const tags = [path.basename(__dirname)]

const router = async (app: FastifyInstance) => {
  app.route({
    method: 'POST',
    url: '/create',
    preValidation: [app.authenticate],
    schema: {
      tags,
      response: {
        200: Type.Object({
          message: Type.String(),
        }),
        500: ERRORS_MESSAGE,
        404: ERRORS_MESSAGE,
        400: ERRORS_MESSAGE,
      },
    },
    handler: controller.createPeriod,
  })
  app.route({
    method: 'PATCH',
    url: '/update',
    preValidation: [app.authenticate],
    schema: {
      tags,
      response: {
        200: Type.Object({
          message: Type.String(),
        }),
        500: ERRORS_MESSAGE,
        404: ERRORS_MESSAGE,
        400: ERRORS_MESSAGE,
      },
    },
    handler: controller.updatePeriod,
  })
  app.route({
    method: 'DELETE',
    url: '/delete/:id',
    preValidation: [app.authenticate],
    schema: {
      tags,
      params: Type.Pick(PeriodUpdateSchema, ['id']),
      response: {
        200: Type.Object({
          message: Type.String(),
        }),
        500: ERRORS_MESSAGE,
        404: ERRORS_MESSAGE,
        400: ERRORS_MESSAGE,
      },
    },
    handler: controller.deletePeriod,
  })
  app.route({
    method: 'GET',
    url: '/list',
    preValidation: [app.authenticate],
    schema: {
      tags,
      querystring: Type.Object({
        year: Type.Optional(Type.String()),
      }),
      response: {
        500: ERRORS_MESSAGE,
        404: ERRORS_MESSAGE,
        400: ERRORS_MESSAGE,
      },
    },
    handler: controller.getAllPeriod,
  })
  app.route({
    method: 'POST',
    url: '/upload',
    preValidation: [app.authenticate],
    schema: {
      tags,
      body: Type.Any(),
      consumes: ['multipart/form-data'],
      response: {
        200: Type.Object({
          message: Type.String(),
        }),
        500: ERRORS_MESSAGE,
        404: ERRORS_MESSAGE,
        400: ERRORS_MESSAGE,
      },
    },
    handler: controller.uploadPeriod,
  })
}

export default router
