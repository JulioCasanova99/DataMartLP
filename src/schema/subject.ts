import { Type } from '@sinclair/typebox'

export const SubjectSchema = Type.Object({
  name: Type.String({
    examples: ['Algebra'],
  }),
  description: Type.Optional(Type.String()),
})
