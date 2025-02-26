import { Type } from '@sinclair/typebox'

export const CourseTeacherSchema = Type.Object({
  courseId: Type.String(),
  teacherId: Type.String(),
  classId: Type.String(),
})
