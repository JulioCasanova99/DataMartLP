import { Type } from '@sinclair/typebox'
import { FastifyInstance } from 'fastify'
import path from 'path'
import { UserController } from '../../controller/user'
import { UserSchema } from '../../schema/user'
import { ERRORS_MESSAGE } from '../errors'

const controller = new UserController()
const tags = [path.basename(__dirname)]

const router = async (app: FastifyInstance) => {
  app.route({
    method: 'POST',
    url: '/auth/register',
    preValidation: [app.authenticate],
    schema: {
      tags,
      body: UserSchema,
      response: {
        200: Type.Object({
          message: Type.String(),
        }),
        500: ERRORS_MESSAGE,
        404: ERRORS_MESSAGE,
        400: ERRORS_MESSAGE,
      },
    },
    handler: controller.createUser,
  })
  app.route({
    method: 'POST',
    url: '/auth/login',
    schema: {
      tags,
      body: Type.Pick(UserSchema, ['username', 'password']),
      response: {
        200: Type.Partial(
          Type.Object({
            message: Type.String(),
            accessToken: Type.String(),
          })
        ),
        500: ERRORS_MESSAGE,
        404: ERRORS_MESSAGE,
        400: ERRORS_MESSAGE,
      },
    },
    handler: controller.loginUser,
  })
  app.route({
    method: 'GET',
    url: '/auth/list',
    preValidation: [app.authenticate],
    schema: {
      tags,
      response: {
        500: ERRORS_MESSAGE,
        404: ERRORS_MESSAGE,
        400: ERRORS_MESSAGE,
      },
    },
    handler: controller.getUser,
  })
  app.route({
    method: 'GET',
    url: '/list/users',
    preValidation: [app.authenticate],
    schema: {
      tags,
      response: {
        500: ERRORS_MESSAGE,
        404: ERRORS_MESSAGE,
        400: ERRORS_MESSAGE,
      },
    },
    handler: controller.getAllUsers,
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
    handler: controller.deleteUser,
  })
  app.route({
    method: 'POST',
    url: '/auth/reset-password',
    schema: {
      tags,
      body: Type.Object({
        newPassword: Type.String(),
        token: Type.String(),
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
    handler: controller.resetPassword,
  })
}

export default router
