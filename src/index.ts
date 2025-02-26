import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import Fastify from 'fastify'
import { configEnv } from './config'
import prisma from './database/db-client'
import { registerPlugins } from './middlewares/pluggins'
import { configServer } from './middlewares/serverOptions'

const server = Fastify(configServer)
const PORT = Number(configEnv.PORT)

server.withTypeProvider<TypeBoxTypeProvider>()

registerPlugins(server)

server.setErrorHandler((err, request, reply) => {
  request.log.error({ error: err }, 'Uncaught exception')
  reply.code(err.statusCode ?? 500)

  return { error: err.message }
})
server.printRoutes({
  commonPrefix: true,
  includeHooks: true,
  includeMeta: true,
})

const start = async () => {
  try {
    await prisma
      .$connect()
      .then(() => console.log('Database Connected to SQL Server'))
      .catch((e) => console.error(e))

    await server.listen({ port: PORT, host: '0.0.0.0' })
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
