import { Type } from '@sinclair/typebox'
import { FastifyInstance } from 'fastify'
import path from 'path'
import { RepresentativeController } from '../../controller/representative'
import { RepresentativeUpdateSchema } from '../../schema/representative'
import { ERRORS_MESSAGE } from '../errors'

const controller = new RepresentativeController()
const tags = [path.basename(__dirname)]

const router = async (app: FastifyInstance) => {
  app.route({
    method: 'POST',
    url: '/create',
    preValidation: [app.authenticate],
    schema: {
      tags,
      // body: RepresentativeSchema,
      response: {
        200: Type.Object({
          message: Type.String(),
        }),
        500: ERRORS_MESSAGE,
        404: ERRORS_MESSAGE,
        400: ERRORS_MESSAGE,
      },
    },
    handler: controller.createRepresentative,
  })
  app.route({
    method: 'PATCH',
    url: '/update',
    preValidation: [app.authenticate],
    schema: {
      tags,
      // body: RepresentativeUpdateSchema,
      response: {
        200: Type.Object({
          message: Type.String(),
        }),
        500: ERRORS_MESSAGE,
        404: ERRORS_MESSAGE,
        400: ERRORS_MESSAGE,
      },
    },
    handler: controller.updateRepresentative,
  })
  app.route({
    method: 'DELETE',
    url: '/delete/:id',
    preValidation: [app.authenticate],
    schema: {
      tags,
      params: Type.Pick(RepresentativeUpdateSchema, ['id']),
      response: {
        200: Type.Object({
          message: Type.String(),
        }),
        500: ERRORS_MESSAGE,
        404: ERRORS_MESSAGE,
        400: ERRORS_MESSAGE,
      },
    },
    handler: controller.deleteRepresentative,
  })
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
    handler: controller.getAllRepresentative,
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
    handler: controller.uploadRepresentative,
  })
}

export default router
