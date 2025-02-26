import { Type } from '@sinclair/typebox'
import { FastifyInstance } from 'fastify'
import path from 'path'
import { CourseTeacherController } from '../../controller/courseTeacher'
import { ERRORS_MESSAGE } from '../errors'

const controller = new CourseTeacherController()
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
    handler: controller.createCourseTeacher,
  })
  app.route({
    method: 'GET',
    url: '/list',
    preValidation: [app.authenticate],
    schema: {
      tags,
      querystring: Type.Object({
        year: Type.String(),
      }),
      response: {
        500: ERRORS_MESSAGE,
        404: ERRORS_MESSAGE,
        400: ERRORS_MESSAGE,
      },
    },
    handler: controller.getAllCourseTeacher,
  })
  app.route({
    method: 'POST',
    url: '/delete',
    preValidation: [app.authenticate],
    schema: {
      tags,
      response: {
        500: ERRORS_MESSAGE,
        404: ERRORS_MESSAGE,
        400: ERRORS_MESSAGE,
      },
    },
    handler: controller.deleteCourseTeacher,
  })
}

export default router
