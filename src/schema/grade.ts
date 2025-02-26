import { Type } from '@sinclair/typebox'

export const GradeSchema = Type.Object({
  score: Type.Number(),
  studentId: Type.String(),
  periodId: Type.String(),
  subjectId: Type.String(),
})
