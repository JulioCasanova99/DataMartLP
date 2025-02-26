import { PrismaClient } from '@prisma/client'
import { inspect } from 'node:util'

const prisma = new PrismaClient({
  log: ['error', 'info', 'warn'],
  errorFormat: 'colorless',
  omit: {
    course: { createdAt: true, updatedAt: true },
    subject: { createdAt: true, updatedAt: true },
    teacher: { createdAt: true, updatedAt: true },
    student: { createdAt: true, updatedAt: true },
    period: { createdAt: true, updatedAt: true },
    grade: { createdAt: true, updatedAt: true },
    role: { createdAt: true, updatedAt: true },
    courseTeacher: { createdAt: true, updatedAt: true },
    user: { createdAt: true, updatedAt: true },
    representative: { createdAt: true, updatedAt: true },
    typePeriod: { createdAt: true, updatedAt: true },
    disciplineRecord: { createdAt: true, updatedAt: true },
    academicYear: { createdAt: true, updatedAt: true },
  },
}).$extends({
  result: {
    student: {
      fullName: {
        needs: { firstName: true, lastName: true },
        compute(user) {
          return `${user.firstName} ${user.lastName}`.trim()
        },
      },
    },
    representative: {
      fullName: {
        needs: { name: true, lastName: true },
        compute(user) {
          return `${user.name} ${user.lastName}`.trim()
        },
      },
    },
    teacher: {
      fullName: {
        needs: { firstName: true, lastName: true },
        compute(user) {
          return `${user.firstName} ${user.lastName}`.trim()
        },
      },
    },
  },
  query: {
    async $allOperations({ operation, model, args, query }) {
      const start = performance.now()
      const result = await query(args)
      const end = performance.now()
      const time = end - start
      console.log(
        inspect(
          { model, operation, args, time },
          { showHidden: false, depth: null, colors: true }
        )
      )
      return result
    },
  },
})

export default prisma
