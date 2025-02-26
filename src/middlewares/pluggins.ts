import fastifyAutoload from '@fastify/autoload'
import fastifyCaching from '@fastify/caching'
import fastifyCors from '@fastify/cors'
import fastifyHelmet from '@fastify/helmet'
import fastifyJwt from '@fastify/jwt'
import fastifyMultipart from '@fastify/multipart'
import fastifySensible from '@fastify/sensible'
import fastifyStatic from '@fastify/static'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { Prisma } from '@prisma/client'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { randomBytes } from 'node:crypto'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { swaggerOptions, swaggerUiOptions } from './swaggerOptions'

declare module 'fastify' {
  export interface FastifyInstance {
    authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>
  }
  export interface FastifyRequest {
    authenticatedUser?: Prisma.UserWhereInput
  }
}

export async function registerPlugins(server: FastifyInstance) {
  const privateKey = readFileSync(
    path.join(__dirname, '../certs/private.key'),
    'utf-8'
  )
  const publicKey = readFileSync(
    path.join(__dirname, '../certs/public.key'),
    'utf-8'
  )

  server.register(fastifyMultipart)
  server.register(fastifyCors, { origin: '*' })
  server.register(fastifySensible)
  server.addContentTypeParser(
    '*',
    function (_req: FastifyRequest, _payload: any, done: any) {
      done()
    }
  )

  server.register(fastifyCaching, { privacy: fastifyCaching.privacy.NOCACHE })

  server.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          function (_req, res: any) {
            res.scriptNonce = randomBytes(16).toString('hex')
            return `'nonce-${res.scriptNonce}'`
          },
        ],
        styleSrc: [
          function (_req, res: any) {
            res.styleNonce = randomBytes(16).toString('hex')
            return `'nonce-${res.styleNonce}'`
          },
        ],
        imageSrc: ["'self'"],
        fontSrc: ["'self'"],
        frameAncestors: ["'none'"],
      },
    },
    xPoweredBy: false,
  })

  server.register(fastifySwagger, swaggerOptions)
  server.register(fastifyAutoload, {
    dir: path.join(__dirname, '../routes'),
    routeParams: true,
    options: {
      prefix: '/v1/school/api',
    },
  })
  server.register(fastifySwaggerUi, swaggerUiOptions)

  server.register(fastifyStatic, {
    root: path.join(__dirname, '../upload'),
    prefix: '/upload/',
  })
  server.register(fastifyJwt, {
    secret: {
      private: privateKey,
      public: publicKey,
    },
    sign: { algorithm: 'RS256' },
  })

  server.decorate(
    'authenticate',
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        const decoded: Prisma.UserWhereInput = await request.jwtVerify()

        request.authenticatedUser = decoded
      } catch (err) {
        reply.send(err)
      }
    }
  )
}
