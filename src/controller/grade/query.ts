import { Prisma } from '@prisma/client'

export const queryGetAverageScoreBySubject = ({
  courseId,
  teacherId,
  academicYearId,
}: Prisma.CourseTeacherWhereInput) => Prisma.sql`
EXEC GetAverageGradesBySubject
    @academicYearId = ${academicYearId},
    @courseId = ${courseId},
    @teacherId = ${teacherId};
`

export const queryGetAverageScoreBySubjectDetails = ({
  courseId,
  teacherId,
  academicYearId,
  subjectId,
}: Prisma.CourseTeacherWhereInput) => Prisma.sql`
EXEC GetAverageGradesBySubjectDetails
    @academicYearId = ${academicYearId},
    @courseId = ${courseId},
    @teacherId = ${teacherId},
    @subjectId = ${subjectId};
`

export const queryGetAverageScoreByYearAndSubject = ({
  courseId,
  teacherId,
}: Prisma.CourseTeacherWhereInput) => Prisma.sql`
EXEC GetAverageGradesByYear
    @courseId = ${courseId},
    @teacherId = ${teacherId}
`

export const queryGetTotalsByYear = ({
  academicYearId,
  courseId,
  teacherId,
}: Prisma.CourseTeacherWhereInput) => Prisma.sql`
EXEC GetTotalsGrades
    @academicYearId = ${academicYearId},
    @courseId = ${courseId},
    @teacherId = ${teacherId}
`

export const queryGetTotalPercentStudentsPerRange = ({
  academicYearId,
  courseId,
  teacherId,
}: Prisma.CourseTeacherWhereInput) => Prisma.sql`
EXEC GetAverageScorePerRange
    @academicYearId = ${academicYearId},
    @courseId = ${courseId},
    @teacherId = ${teacherId}
`

export const queryGetTotalStudentsByRangeOfScore = (
  { academicYearId, courseId, teacherId }: Prisma.CourseTeacherWhereInput,
  rangeGrade: string
) => Prisma.sql`
EXEC GetAverageScorePerRangeDetails
    @academicYearId = ${academicYearId},
    @courseId = ${courseId},
    @teacherId = ${teacherId},
    @rangeGrade = ${rangeGrade}
`

export const queryGetAverageScoreByTeacher = ({
  academicYearId,
  courseId,
  teacherId,
}: Prisma.CourseTeacherWhereInput) => Prisma.sql`
EXEC GetAverageScorePerTeacherAndSubject
    @academicYearId = ${academicYearId},
    @courseId = ${courseId},
    @teacherId = ${teacherId}
`

export const queryGetInformationByTeacherAndSubject = (
  { academicYearId, courseId, teacherId }: Prisma.CourseTeacherWhereInput,
  subjectName: string,
  teacherName: string
) => Prisma.sql`
EXEC GetAverageScorePerTeacherAndSubjectDetails
    @academicYearId = ${academicYearId},
    @courseId = ${courseId},
    @teacherId = ${teacherId},
    @subjectName = ${subjectName},
    @teacherName = ${teacherName}
`

export const queryGetGradesByCourseAndSubject = ({
  academicYearId,
}: Prisma.CourseTeacherWhereInput) => Prisma.sql`
EXEC GetAverageScorePerCourseAndSubject
    @academicYearId = ${academicYearId}
`
