import { SwaggerOptions } from '@fastify/swagger'
import { FastifySwaggerUiOptions } from '@fastify/swagger-ui'
import { configEnv } from '../config'

const swaggerOptions: SwaggerOptions = {
  swagger: {
    info: {
      title: 'App School',
      description: 'Backend Service',
      version: '1.0.0',
    },
    host: `localhost:${configEnv.PORT}`,
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    securityDefinitions: {
      BearerAuth: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
        description:
          'Autenticación JWT usando el esquema Bearer. Ejemplo: "Bearer <token>"',
      },
    },
    security: [{ BearerAuth: [] }],
  },
}

const swaggerUiOptions: FastifySwaggerUiOptions = {
  routePrefix: '/docs',
  staticCSP: true,
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false,
    persistAuthorization: true,
  },
}

export { swaggerOptions, swaggerUiOptions }
