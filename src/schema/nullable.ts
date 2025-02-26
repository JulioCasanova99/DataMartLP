import { TSchema, Type } from '@sinclair/typebox'

const Nullable = <T extends TSchema>(schema: T) =>
  Type.Union([schema, Type.Null()])

export { Nullable }
