import { Type } from '@sinclair/typebox'
import { FastifyInstance } from 'fastify'
import path from 'path'
import { GradeController } from '../../controller/grade'
import { ERRORS_MESSAGE } from '../errors'
import { Filters, FiltersParams } from '../filters'

const controller = new GradeController()
const tags = [path.basename(__dirname)]

const router = async (app: FastifyInstance) => {
  app.route({
    method: 'POST',
    url: '/upload',
    preValidation: [app.authenticate],
    schema: {
      tags,
      body: Type.Any(),
      querystring: Type.Object({
        year: Type.String(),
      }),
      response: {
        200: Type.Object({
          message: Type.String(),
        }),
        500: ERRORS_MESSAGE,
        404: ERRORS_MESSAGE,
        400: ERRORS_MESSAGE,
      },
    },
    handler: controller.uploadGrades,
  })
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
    handler: controller.createGrade,
  })
  app.route({
    method: 'GET',
    url: '/list-grades',
    preValidation: [app.authenticate],
    schema: {
      tags,
      querystring: Filters,
      response: {
        500: ERRORS_MESSAGE,
        404: ERRORS_MESSAGE,
        400: ERRORS_MESSAGE,
      },
    },
    handler: controller.getGradesByYear,
  })
  app.route({
    method: 'GET',
    url: '/grades-with-periods',
    preValidation: [app.authenticate],
    schema: {
      tags,
      querystring: Type.Object({
        subjectId: Type.String(),
        ...Filters.properties,
      }),
      response: {
        500: ERRORS_MESSAGE,
        404: ERRORS_MESSAGE,
        400: ERRORS_MESSAGE,
      },
    },
    handler: controller.getGradesByParams,
  })
  app.route({
    method: 'GET',
    url: '/average-grades-subject',
    preValidation: [app.authenticate],
    schema: {
      tags,
      querystring: Filters,
      response: {
        500: ERRORS_MESSAGE,
        404: ERRORS_MESSAGE,
        400: ERRORS_MESSAGE,
      },
    },
    handler: controller.getAverageScoreBySubject,
  })
  app.route({
    method: 'GET',
    url: '/information-by-subject',
    preValidation: [app.authenticate],
    schema: {
      tags,
      querystring: Type.Object({
        ...Filters.properties,
        subject: Type.String(),
      }),
      response: {
        500: ERRORS_MESSAGE,
        404: ERRORS_MESSAGE,
        400: ERRORS_MESSAGE,
      },
    },
    handler: controller.getAverageScoreBySubjectDetails,
  })
  app.route({
    method: 'GET',
    url: '/average-grades-year-and-subject',
    preValidation: [app.authenticate],
    schema: {
      tags,
      querystring: Type.Omit(Filters, ['year']),
      response: {
        500: ERRORS_MESSAGE,
        404: ERRORS_MESSAGE,
        400: ERRORS_MESSAGE,
      },
    },
    handler: controller.getAverageScoreByYearAndSubject,
  })
  app.route({
    method: 'GET',
    url: '/totals-by-year',
    preValidation: [app.authenticate],
    schema: {
      tags,
      querystring: Filters,
      response: {
        500: ERRORS_MESSAGE,
        404: ERRORS_MESSAGE,
        400: ERRORS_MESSAGE,
      },
    },
    handler: controller.getTotalsByYear,
  })
  app.route({
    method: 'GET',
    url: '/totals-percent-students-range',
    preValidation: [app.authenticate],
    schema: {
      tags,
      querystring: Filters,
      response: {
        500: ERRORS_MESSAGE,
        404: ERRORS_MESSAGE,
        400: ERRORS_MESSAGE,
      },
    },
    handler: controller.getTotalPercentStudentsPerRange,
  })
  app.route({
    method: 'GET',
    url: '/totals-students-per-range',
    preValidation: [app.authenticate],
    schema: {
      tags,
      querystring: FiltersParams,
      response: {
        500: ERRORS_MESSAGE,
        404: ERRORS_MESSAGE,
        400: ERRORS_MESSAGE,
      },
    },
    handler: controller.getTotalStudentsByRange,
  })
  app.route({
    method: 'GET',
    url: '/average-grades-by-teacher',
    preValidation: [app.authenticate],
    schema: {
      tags,
      querystring: Filters,
      response: {
        500: ERRORS_MESSAGE,
        404: ERRORS_MESSAGE,
        400: ERRORS_MESSAGE,
      },
    },
    handler: controller.getAverageScoreByTeacher,
  })
  app.route({
    method: 'GET',
    url: '/information-by-teacher-subject',
    preValidation: [app.authenticate],
    schema: {
      tags,
      querystring: Type.Object({
        ...Filters.properties,
        teacher: Type.String(),
        subject: Type.String(),
      }),
      response: {
        500: ERRORS_MESSAGE,
        404: ERRORS_MESSAGE,
        400: ERRORS_MESSAGE,
      },
    },
    handler: controller.getInformationByTeacherAndSubject,
  })
  app.route({
    method: 'PATCH',
    url: '/update',
    preValidation: [app.authenticate],
    schema: {
      tags,
      querystring: Filters,
      response: {
        500: ERRORS_MESSAGE,
        404: ERRORS_MESSAGE,
        400: ERRORS_MESSAGE,
      },
    },
    handler: controller.updateGrades,
  })
}

export default router
