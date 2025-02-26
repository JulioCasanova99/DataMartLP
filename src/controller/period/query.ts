import { Prisma } from '@prisma/client'

export const queryGetPeriodByParams = ({
  academicYearId,
}: Prisma.CourseTeacherWhereInput) => Prisma.sql`
    EXEC GetPeriodsByYear
        @academicYearId = ${academicYearId}
    `
