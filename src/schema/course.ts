import { Type } from '@sinclair/typebox'

export const CourseSchema = Type.Object({
  name: Type.String(),
})

export const CourseUpdateSchema = Type.Object({
  id: Type.String(),
  ...CourseSchema.properties,
})
