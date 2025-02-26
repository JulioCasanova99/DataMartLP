import { Type } from '@sinclair/typebox'
import { Nullable } from './nullable'

export const RepresentativeSchema = Type.Object({
  name: Type.Optional(Type.String()),
  dni: Type.Optional(Type.String()),
  lastName: Type.Optional(Type.String()),
  email: Type.Optional(Type.String({ format: 'email' })),
  workPlace: Type.Optional(Type.String()),
  workstation: Type.Optional(Type.String()),
  phone1: Type.Optional(Type.String()),
  phone2: Type.Optional(Type.String()),
  address: Type.Optional(Type.String()),
  relationship: Nullable(
    Type.Optional(
      Type.Enum({
        Father: 'Father',
        Mother: 'Mother',
        Guardian: 'Guardian',
      })
    )
  ),
})

export const RepresentativeUpdateSchema = Type.Object({
  id: Type.Number(),
  ...RepresentativeSchema.properties,
})
