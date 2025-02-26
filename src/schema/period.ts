import { Type } from '@sinclair/typebox'

export const PeriodSchema = Type.Object({
  name: Type.Optional(Type.String()),
  label: Type.Optional(Type.String()),
  typePeriodId: Type.Optional(Type.String()),
  year: Type.String(),
  isRelevant: Type.Boolean(),
})

export const PeriodUpdateSchema = Type.Object({
  id: Type.String(),
  ...PeriodSchema.properties,
})
