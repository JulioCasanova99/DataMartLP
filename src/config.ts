import { Ajv } from 'ajv'
import envSchema from 'env-schema'

type TConfig = typeof config

type TConfigKey = {
  [key in keyof TConfig]: TConfig[key]['default']
}

// Create a new instance of Ajv
const ajv = new Ajv({
  allErrors: true,
  removeAdditional: true,
  validateFormats: true,
  coerceTypes: true,
  useDefaults: true,
})

const config = {
  PORT: {
    type: 'number',
    default: 4000,
    description: 'Port to listen on',
  },
  SERVER_NODE: {
    type: 'string',
    default: 'localhost',
    description: 'Server Node',
  },
  UID: {
    type: 'string',
    default: 'SYSTEM',
    description: 'User ID',
  },
  PASSWORD: {
    type: 'string',
    default: '1234',
    description: 'Password',
  },
  NAME_DATABASE: {
    type: 'string',
    default: 'PROD',
    description: 'Name Database',
  },
  NODE_ENV: {
    type: 'string',
    default: 'development',
    description: 'Environment',
  },
  POSTGRESQL_URL: {
    type: 'string',
    default: 'postgres://user:password@host:port/db',
    description: 'PostgreSQL Host',
  },
}

const schema = {
  type: 'object',
  properties: config,
  required: Object.keys(config),
}

export const configEnv = envSchema<TConfigKey>({
  schema,
  dotenv: true,
  ajv,
})
