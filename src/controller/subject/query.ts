import { Prisma } from '@prisma/client'

export const queryGetGradesBySubjectCourseAndTeacher = ({
  academicYearId,
  courseId,
  teacherId,
  subjectId,
}: Prisma.CourseTeacherWhereInput) => Prisma.sql`
    EXEC GetGradesBySubject
        @academicYearId = ${academicYearId},
        @courseId = ${courseId},
        @teacherId = ${teacherId},
        @subjectId = ${subjectId}
    `

export const queryGetSubjectWithAverageGrade = ({
  academicYearId,
  courseId,
  teacherId,
  subjectId,
}: Prisma.CourseTeacherWhereInput) => Prisma.sql`
  EXEC GetSubjectWithAverageScore
      @academicYearId = ${academicYearId},
      @courseId = ${courseId},
      @teacherId = ${teacherId},
      @subjectId = ${subjectId}
  `
