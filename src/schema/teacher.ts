import { Type } from '@sinclair/typebox'

export const TeacherSchema = Type.Object({
  dni: Type.Optional(Type.String()),
  firstName: Type.Optional(Type.String()),
  lastName: Type.Optional(Type.String()),
  email: Type.Optional(Type.String({ format: 'email' })),
  phone: Type.Optional(Type.String()),
})

export const TeacherUpdateSchema = Type.Object({
  id: Type.String(),
  ...TeacherSchema.properties,
})
