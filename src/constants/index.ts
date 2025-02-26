export const WORKSHEET_NAME = {
  GRADES: 'NOTAS',
  STUDENTS: 'ALUMNOS',
  REPRESENTATIVES: 'REPRESENTANTES',
  TEACHERS: 'PROFESORES',
  SUBJECTS: 'ASIGNATURAS',
  COURSES: 'CURSOS',
  PERIODS: 'PERIODOS',
  DISCIPLINE: 'DISCIPLINA',
} as const

export const TABLE_NAME = {
  GRADE: 'Grade',
  STUDENT: 'Student',
  REPRESENTATIVE: 'Representative',
  TEACHER: 'Teacher',
  SUBJECT: 'Subject',
  COURSE: 'Course',
  PERIOD: 'Period',
  DISCIPLINE: 'DisciplineRecord',
} as const

export const RELATION_SHIP_PERMITTED = ['Mother', 'Father', 'Guardian']
export const GENDER_PERMITTED = ['Male', 'Female', 'Other']
