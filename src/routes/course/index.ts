import { Type } from '@sinclair/typebox'
import { FastifyInstance } from 'fastify'
import path from 'path'
import { CourseController } from '../../controller/course'
import { CourseSchema, CourseUpdateSchema } from '../../schema/course'
import { ERRORS_MESSAGE } from '../errors'

const controller = new CourseController()
const tags = [path.basename(__dirname)]

const router = async (app: FastifyInstance) => {
  app.route({
    method: 'POST',
    url: '/create',
    preValidation: [app.authenticate],
    schema: {
      tags,
      body: CourseSchema,
      response: {
        200: Type.Object({
          message: Type.String(),
        }),
        500: ERRORS_MESSAGE,
        404: ERRORS_MESSAGE,
        400: ERRORS_MESSAGE,
      },
    },
    handler: controller.createCourse,
  })
  app.route({
    method: 'PATCH',
    url: '/update',
    preValidation: [app.authenticate],
    schema: {
      tags,
      // body: TeacherUpdateSchema,
      response: {
        200: Type.Object({
          message: Type.String(),
        }),
        500: ERRORS_MESSAGE,
        404: ERRORS_MESSAGE,
        400: ERRORS_MESSAGE,
      },
    },
    handler: controller.updateCourse,
  })
  app.route({
    method: 'DELETE',
    url: '/delete/:id',
    preValidation: [app.authenticate],
    schema: {
      tags,
      params: Type.Pick(CourseUpdateSchema, ['id']),
      response: {
        200: Type.Object({
          message: Type.String(),
        }),
        500: ERRORS_MESSAGE,
        404: ERRORS_MESSAGE,
        400: ERRORS_MESSAGE,
      },
    },
    handler: controller.deleteCourse,
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
    handler: controller.uploadCourse,
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
    handler: controller.getAllCourse,
  })
}

export default router
