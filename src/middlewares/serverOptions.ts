import { FastifyRequest, FastifyServerOptions } from 'fastify'
import { PinoLoggerOptions } from 'fastify/types/logger'
import { configEnv } from '../config'

const environment = configEnv.NODE_ENV

const envToLogger: Record<string, PinoLoggerOptions> = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid',
        colorize: true,
      },
    },
    serializers: {
      res(reply: any) {
        return {
          statusCode: reply.statusCode,
        }
      },
      req(request: FastifyRequest) {
        return {
          method: request.method,
          url: request.url,
          path: request.routeOptions.url,
          parameters: request.params,
          hostname: request.hostname,
          remoteAddress: request.ip,
          remotePort: request.socket.remotePort,
          ip: request.ip,
        }
      },
    },
  },
  production: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid',
        colorize: true,
      },
    },
  },
}

const configServer: FastifyServerOptions = {
  logger: envToLogger[environment] ?? true,
  ajv: {
    customOptions: {
      allErrors: true,
      removeAdditional: true,
      validateFormats: true,
      coerceTypes: true,
      useDefaults: true,
    },
  },
  caseSensitive: true,
  clientErrorHandler(error, socket) {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
    socket.end(error.message)
    socket.destroy()
  },
}

export { configServer }
