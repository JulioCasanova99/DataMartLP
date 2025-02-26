import { Type } from '@sinclair/typebox'
import { FastifyInstance } from 'fastify'
import path from 'path'
import { DisciplineRecordController } from '../../controller/disciplineRecord'
import { ERRORS_MESSAGE } from '../errors'

const controller = new DisciplineRecordController()
const tags = [path.basename(__dirname)]

const router = async (app: FastifyInstance) => {
  app.route({
    method: 'POST',
    url: '/new-discipline-record',
    preValidation: [app.authenticate],
    schema: {
      tags,
      consumes: ['multipart/form-data'],
      body: Type.Any(),
      response: {
        200: Type.Object({
          message: Type.String(),
        }),
        500: ERRORS_MESSAGE,
        404: ERRORS_MESSAGE,
        400: ERRORS_MESSAGE,
      },
    },
    handler: controller.createDisciplineRecord,
  })
}

export default router
