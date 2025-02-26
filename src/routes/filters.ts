import { Type } from '@sinclair/typebox'

export const Filters = Type.Object({
  year: Type.String(),
  courseId: Type.Optional(Type.String()),
  teacherId: Type.Optional(Type.String()),
})

export const FiltersParams = Type.Object({
  range: Type.String(),
  ...Filters.properties,
})
