import { Type } from '@sinclair/typebox'
import { FastifyInstance } from 'fastify'
import path from 'path'
import { AcademicYear } from '../../controller/academicYear'
import { ERRORS_MESSAGE } from '../errors'

const controller = new AcademicYear()
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
    handler: controller.getYears,
  })
  app.route({
    method: 'POST',
    url: '/create',
    preValidation: [app.authenticate],
    schema: {
      tags,
      response: {
        500: ERRORS_MESSAGE,
        404: ERRORS_MESSAGE,
        400: ERRORS_MESSAGE,
      },
    },
    handler: controller.createYear,
  })
  app.route({
    method: 'PATCH',
    url: '/update',
    preValidation: [app.authenticate],
    schema: {
      tags,
      response: {
        500: ERRORS_MESSAGE,
        404: ERRORS_MESSAGE,
        400: ERRORS_MESSAGE,
      },
    },
    handler: controller.updateYear,
  })
  app.route({
    method: 'DELETE',
    url: '/delete/:id',
    preValidation: [app.authenticate],
    schema: {
      tags,
      params: Type.Object({
        id: Type.String(),
      }),
      response: {
        500: ERRORS_MESSAGE,
        404: ERRORS_MESSAGE,
        400: ERRORS_MESSAGE,
      },
    },
    handler: controller.deleteYear,
  })
}

export default router
