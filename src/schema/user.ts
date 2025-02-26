import { Type } from '@sinclair/typebox'

export const UserSchema = Type.Object({
  username: Type.String(),
  password: Type.String(),
  roleId: Type.Number(),
})
