import { Type } from '@sinclair/typebox'

const ERRORS_MESSAGE = Type.Partial(
  Type.Object({
    error: Type.String(),
  })
)

export { ERRORS_MESSAGE }
