import { Type } from '@sinclair/typebox'
import { FastifyInstance } from 'fastify'
import path from 'path'
import { StudentController } from '../../controller/student'
import { StudentUpdateSchema } from '../../schema/student'
import { ERRORS_MESSAGE } from '../errors'

const controller = new StudentController()
const tags = [path.basename(__dirname)]

const router = async (app: FastifyInstance) => {
  app.route({
    method: 'POST',
    url: '/create',
    preValidation: [app.authenticate],
    schema: {
      tags,
      // body: StudentSchema,
      response: {
        200: Type.Object({
          message: Type.String(),
        }),
        500: ERRORS_MESSAGE,
        404: ERRORS_MESSAGE,
        400: ERRORS_MESSAGE,
      },
    },
    handler: controller.createStudent,
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
    handler: controller.uploadStudents,
  })
  app.route({
    method: 'PATCH',
    url: '/update',
    preValidation: [app.authenticate],
    schema: {
      tags,
      // body: StudentUpdateSchema,
      response: {
        200: Type.Object({
          message: Type.String(),
        }),
        500: ERRORS_MESSAGE,
        404: ERRORS_MESSAGE,
        400: ERRORS_MESSAGE,
      },
    },
    handler: controller.updateStudent,
  })
  app.route({
    method: 'DELETE',
    url: '/delete/:id',
    preValidation: [app.authenticate],
    schema: {
      tags,
      params: Type.Pick(StudentUpdateSchema, ['id']),
      response: {
        200: Type.Object({
          message: Type.String(),
        }),
        500: ERRORS_MESSAGE,
        404: ERRORS_MESSAGE,
        400: ERRORS_MESSAGE,
      },
    },
    handler: controller.deleteStudent,
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
    handler: controller.getAllStudent,
  })
  app.route({
    method: 'GET',
    url: '/list-with-grades',
    preValidation: [app.authenticate],
    schema: {
      tags,
      querystring: Type.Object({
        courseId: Type.String(),
      }),
      response: {
        500: ERRORS_MESSAGE,
        404: ERRORS_MESSAGE,
        400: ERRORS_MESSAGE,
      },
    },
    handler: controller.getStudentsByParams,
  })
}

export default router
