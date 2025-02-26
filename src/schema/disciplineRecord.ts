import { Type } from '@sinclair/typebox'

export const DisciplineRecordSchema = Type.Object({
  studentId: Type.String(),
  periodId: Type.String(),
  observation: Type.Optional(Type.String()),
})
