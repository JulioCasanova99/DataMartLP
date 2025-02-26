import { Type } from '@sinclair/typebox'
import { Nullable } from './nullable'
import { RepresentativeSchema } from './representative'
import { CourseSchema } from './course'

export const StudentSchema = Type.Object({
  dni: Nullable(
    Type.Optional(
      Type.String({
        examples: ['1234567890'],
      })
    )
  ),
  firstName: Nullable(Type.Optional(Type.String())),
  lastName: Nullable(Type.Optional(Type.String())),
  gender: Nullable(
    Type.Optional(Type.Enum({ Male: 'Male', Female: 'Female' }))
  ),
  address: Nullable(Type.Optional(Type.String())),
  dateOfBirth: Nullable(
    Type.Optional(
      Type.String({
        examples: ['2001-01-29T05:00:00.000Z'],
      })
    )
  ),
  representativeId: Nullable(Type.Optional(Type.String())),
  courseId: Nullable(Type.Optional(Type.String())),
})

export const StudentUpdateSchema = Type.Object({
  id: Type.String(),
  ...StudentSchema.properties,
})

export const StudentListSchema = Type.Object({
  ...StudentUpdateSchema.properties,
  representative: Nullable(RepresentativeSchema),
  course: Nullable(CourseSchema),
})
