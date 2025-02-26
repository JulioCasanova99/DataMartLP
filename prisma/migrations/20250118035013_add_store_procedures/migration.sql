-- Store procedure to get average grades by subject
IF NOT EXISTS (
  SELECT
    *
  FROM
    sys.objects
  WHERE
    type = 'P'
    AND name = 'GetAverageGradesBySubject'
) BEGIN EXEC (
  '
    CREATE PROCEDURE GetAverageGradesBySubject
        @academicYearId VARCHAR(50),
        @courseId VARCHAR(50) = NULL,
        @teacherId INT = NULL
    AS
    BEGIN
        SET NOCOUNT ON;

        SELECT
            CONVERT(REAL, ROUND(AVG(G.score), 2)) AS score,
            S.ID AS subject,
            S.name AS subjectName,
            CT.courseId AS course,
            C.name AS courseName,
            AY.name AS year
        FROM "Grade" G
        INNER JOIN "Student" S2 ON S2.ID = G.studentId
        INNER JOIN "Subject" S ON G.subjectId = S.ID
        INNER JOIN "Period" P ON P.ID = G.periodId
        INNER JOIN "CourseTeacher" CT ON CT.subjectId = S.ID
            AND S2.courseId = CT.courseId
        INNER JOIN "Teacher" T ON CT.teacherId = T.ID
        INNER JOIN "Course" C ON C.ID = CT.courseId
        INNER JOIN "AcademicYear" AY ON AY.ID = P.academicYearId
            AND CT.academicYearId = AY.ID
        WHERE P.isRelevant = 1
            AND P.academicYearId = @academicYearId
            AND (@courseId IS NULL OR CT.courseId = @courseId)
            AND (@teacherId IS NULL OR CT.teacherId = @teacherId)
        GROUP BY S.ID,
            CT.courseId,
            AY.name,
            S.name,
            C.name;
    END;
    '
) END
-- Store procedure to get average grades by subject details
IF NOT EXISTS (
  SELECT
    *
  FROM
    sys.objects
  WHERE
    type = 'P'
    AND name = 'GetAverageGradesBySubjectDetails'
) BEGIN EXEC (
  '
   CREATE PROCEDURE GetAverageGradesBySubjectDetails
        @academicYearId VARCHAR(50),
        @courseId VARCHAR(50) = NULL,
        @teacherId INT = NULL,
        @subjectId VARCHAR(50)
    AS
    BEGIN
        SET NOCOUNT ON;

        SELECT
            S."name" AS "subject",
            C."name" AS "course",
            CONCAT(T."firstName", '' '', T."lastName") AS "teacher",
            CONVERT(REAL, ROUND(AVG(G.score), 2)) AS score
        FROM "Grade" G
        INNER JOIN "Student" S2 ON S2.ID = G."studentId"
        INNER JOIN "Subject" S ON G."subjectId" = S.ID
        INNER JOIN "Period" P ON P.ID = G."periodId"
        INNER JOIN "CourseTeacher" CT ON CT."subjectId" = S.ID
        AND S2."courseId" = CT."courseId"
        INNER JOIN "Teacher" T ON CT."teacherId" = T.ID
        INNER JOIN "Course" C ON C.ID = CT."courseId"
        INNER JOIN "AcademicYear" AY ON AY.ID = P."academicYearId"
        AND CT."academicYearId" = AY.ID
        WHERE P."isRelevant" = 1
        AND P."academicYearId" = @academicYearId
        AND S.ID = @subjectId
        AND (@courseId IS NULL OR CT.courseId = @courseId)
        AND (@teacherId IS NULL OR CT.teacherId = @teacherId)
        GROUP BY S."name",
            C."name",
            CONCAT(T."firstName", '' '', T."lastName")

    END;
  '
) END
-- Store procedure to get average grades by year
IF NOT EXISTS (
  SELECT
    *
  FROM
    sys.objects
  WHERE
    type = 'P'
    AND name = 'GetAverageGradesByYear'
) BEGIN EXEC (
  '
    CREATE PROCEDURE GetAverageGradesByYear
        @courseId VARCHAR(50) = NULL,
        @teacherId INT = NULL
    AS
    BEGIN
        SET NOCOUNT ON;

        SELECT
            CONVERT(REAL, ROUND(AVG(G."score"), 2)) AS "score",
            S."name" AS subject,
            AY."name" AS "year",
            CONVERT(INTEGER, COUNT(DISTINCT G."studentId")) AS "totalStudents"
        FROM "Grade" G
        INNER JOIN "Student" S2 ON S2.ID = G."studentId"
        INNER JOIN "Subject" S ON G."subjectId" = S.ID
        INNER JOIN "Period" P ON P.ID = G."periodId"
        INNER JOIN "CourseTeacher" CT ON CT."subjectId" = S.ID
        AND S2."courseId" = CT."courseId"
        INNER JOIN "AcademicYear" AY ON AY.ID = P."academicYearId"
        AND CT."academicYearId" = AY.ID
        WHERE P."isRelevant" = 1
        AND (@courseId IS NULL OR CT.courseId = @courseId)
        AND (@teacherId IS NULL OR CT.teacherId = @teacherId)
        GROUP BY S."name",
            AY."name";

    END;
  '
) END
-- Store procedure to get average grades TOTALS
IF NOT EXISTS (
  SELECT
    *
  FROM
    sys.objects
  WHERE
    type = 'P'
    AND name = 'GetTotalsGrades'
) BEGIN EXEC (
  '
    CREATE PROCEDURE GetTotalsGrades
        @academicYearId VARCHAR(50),
        @courseId VARCHAR(50) = NULL,
        @teacherId INT = NULL
    AS
    BEGIN
        SET NOCOUNT ON;

        SELECT
            CONVERT(REAL, ROUND(AVG(G."score"), 2)) AS "score",
            CONVERT(INTEGER, COUNT(DISTINCT G."subjectId")) AS "subject",
            CONVERT(INTEGER, COUNT(DISTINCT G."studentId")) AS "student",
            AY."name" AS "year"
        FROM "Grade" G
        INNER JOIN "Student" S2 ON S2.ID = G."studentId"
        INNER JOIN "Period" P ON P.ID = G."periodId"
        INNER JOIN "CourseTeacher" CT ON CT."subjectId" = G."subjectId"
        AND S2."courseId" = CT."courseId"
        INNER JOIN "AcademicYear" AY ON AY.ID = P."academicYearId"
        AND CT."academicYearId" = AY.ID
        WHERE P."isRelevant" = 1
        AND P.academicYearId = @academicYearId
        AND (@courseId IS NULL OR CT.courseId = @courseId)
        AND (@teacherId IS NULL OR CT.teacherId = @teacherId)
        GROUP BY AY."name";

    END;
    '
) END
-- Store procedure to get average grades per range
IF NOT EXISTS (
  SELECT
    *
  FROM
    sys.objects
  WHERE
    type = 'P'
    AND name = 'GetAverageScorePerRange'
) BEGIN EXEC (
  '
    CREATE PROCEDURE GetAverageScorePerRange
        @academicYearId VARCHAR(50),
        @courseId VARCHAR(50) = NULL,
        @teacherId INT = NULL
    AS
    BEGIN
        SET NOCOUNT ON;

        WITH GradesPerStudent AS (
            SELECT
                ST.ID AS "StudentId",
                CONVERT(REAL, ROUND(AVG(G."score"), 2)) AS "AverageScore",
                P."academicYearId" AS "year",
                CT."teacherId" AS "teacherId",
                CT."courseId" AS "courseId"
            FROM "Grade" G
            INNER JOIN "Student" ST ON ST.ID = G."studentId"
            INNER JOIN "Period" P ON P.ID = G."periodId"
            INNER JOIN "CourseTeacher" CT ON CT."subjectId" = G."subjectId"
            AND ST."courseId" = CT."courseId"
            INNER JOIN "Subject" S ON S.ID = CT."subjectId"
            INNER JOIN "AcademicYear" AY ON AY.ID = P."academicYearId"
            AND CT."academicYearId" = AY.ID
            WHERE P."isRelevant" = 1
            GROUP BY ST.ID, P."academicYearId", CT."teacherId", CT."courseId", S.id
        ),
        RangeGrades AS (
            SELECT
                CASE
                    WHEN "AverageScore" >= 9 THEN ''Sobresaliente (9-10)''
                    WHEN "AverageScore" >= 8 AND "AverageScore" < 9 THEN ''Muy Bueno (8-9)''
                    WHEN "AverageScore" >= 7 AND "AverageScore" < 8 THEN ''Bueno (7-8)''
                    WHEN "AverageScore" >= 6 AND "AverageScore" < 7 THEN ''Regular (6-7)''
                    ELSE ''Insuficiente (< 6)''
                END AS "RangeGrades",
                COUNT(DISTINCT "StudentId") AS "TotalStudents",
                "year" AS "academicYearId",
                "teacherId",
                "courseId"
            FROM GradesPerStudent
            GROUP BY
                CASE
                    WHEN "AverageScore" >= 9 THEN ''Sobresaliente (9-10)''
                    WHEN "AverageScore" >= 8 AND "AverageScore" < 9 THEN ''Muy Bueno (8-9)''
                    WHEN "AverageScore" >= 7 AND "AverageScore" < 8 THEN ''Bueno (7-8)''
                    WHEN "AverageScore" >= 6 AND "AverageScore" < 7 THEN ''Regular (6-7)''
                    ELSE ''Insuficiente (< 6)''
                END,
                "year",
                "teacherId",
                "courseId"
        )
        SELECT
            RG."RangeGrades" AS "status",
            CONVERT(INTEGER, SUM(RG."TotalStudents")) AS "totalStudents",
            ROUND(
                SUM(RG."TotalStudents") / CONVERT(REAL, SUM(SUM(RG."TotalStudents")) OVER()) * 100.0 ,
                2
            ) AS "percentStudents"
        FROM RangeGrades RG
        WHERE "academicYearId" = @academicYearId
        AND (@courseId IS NULL OR "courseId" = @courseId)
        AND (@teacherId IS NULL OR "teacherId" = @teacherId)
        GROUP BY RG."RangeGrades"
        ORDER BY
            CASE "RangeGrades"
                WHEN ''Sobresaliente (9-10)'' THEN 1
                WHEN ''Muy Bueno (8-9)'' THEN 2
                WHEN ''Bueno (7-8)'' THEN 3
                WHEN ''Regular (6-7)'' THEN 4
                ELSE 5
            END;

    END;
    '
) END
-- Store procedure to get average grades per range details
IF NOT EXISTS (
  SELECT
    *
  FROM
    sys.objects
  WHERE
    type = 'P'
    AND name = 'GetAverageScorePerRangeDetails'
) BEGIN EXEC (
  '
    CREATE PROCEDURE GetAverageScorePerRangeDetails
        @academicYearId VARCHAR(50),
        @courseId VARCHAR(50) = NULL,
        @teacherId INT = NULL,
        @rangeGrade VARCHAR(50)
    AS
    BEGIN
        SET NOCOUNT ON;

        WITH GradesPerStudent AS (
            SELECT
                ST.ID AS "studentId",
                CONVERT(REAL, ROUND(AVG(G."score"), 2)) AS "AverageScore",
                P."academicYearId" AS "year",
                CT."teacherId" AS "teacherId",
                CT."courseId" AS "courseId",
                ST."firstName" + '' '' + ST."lastName" AS "fullName",
                C.name AS "course",
                S.name AS "subject"
            FROM "Grade" G
            INNER JOIN "Student" ST ON ST.ID = G."studentId"
            INNER JOIN "Period" P ON P.ID = G."periodId"
            INNER JOIN "CourseTeacher" CT ON CT."subjectId" = G."subjectId"
            AND ST."courseId" = CT."courseId"
            INNER JOIN "Course" C ON C.ID = ST."courseId"
            INNER JOIN "Subject" S ON S.ID = CT."subjectId"
            INNER JOIN "AcademicYear" AY ON AY.ID = P."academicYearId"
            AND CT."academicYearId" = AY.ID
            WHERE P."isRelevant" = 1
            GROUP BY ST.ID,
                P."academicYearId",
                CT."teacherId",
                CT."courseId",
                ST."firstName" + '' '' + ST."lastName",
                C.name,
                S.name
        ),
        RangeGrades AS (
            SELECT
                CASE
                    WHEN "AverageScore" >= 9 THEN ''Sobresaliente (9-10)''
                    WHEN "AverageScore" >= 8 AND "AverageScore" < 9 THEN ''Muy Bueno (8-9)''
                    WHEN "AverageScore" >= 7 AND "AverageScore" < 8 THEN ''Bueno (7-8)''
                    WHEN "AverageScore" >= 6 AND "AverageScore" < 7 THEN ''Regular (6-7)''
                    ELSE ''Insuficiente (< 6)''
                END AS "RangeGrades",
                COUNT(DISTINCT "StudentId") AS "TotalStudents",
                "year" AS "academicYearId",
                "teacherId",
                "courseId",
                "fullName",
                "AverageScore",
                "course",
                subject
            FROM GradesPerStudent
            GROUP BY
                CASE
                    WHEN "AverageScore" >= 9 THEN ''Sobresaliente (9-10)''
                    WHEN "AverageScore" >= 8 AND "AverageScore" < 9 THEN ''Muy Bueno (8-9)''
                    WHEN "AverageScore" >= 7 AND "AverageScore" < 8 THEN ''Bueno (7-8)''
                    WHEN "AverageScore" >= 6 AND "AverageScore" < 7 THEN ''Regular (6-7)''
                    ELSE ''Insuficiente (< 6)''
                END,
                "year",
                "teacherId",
                "courseId",
                "fullName",
                "AverageScore",
                "course",
                subject
        )
        SELECT
            RG."RangeGrades" AS "status",
            "fullName" AS "student",
            "course",
            "subject",
            "AverageScore" AS "score"
        FROM RangeGrades RG
        WHERE "academicYearId" = @academicYearId
        AND RG."RangeGrades" = @rangeGrade
        AND (@courseId IS NULL OR "courseId" = @courseId)
        AND (@teacherId IS NULL OR "teacherId" = @teacherId)
        ORDER BY
            CASE "RangeGrades"
                WHEN ''Sobresaliente (9-10)'' THEN 1
                WHEN ''Muy Bueno (8-9)'' THEN 2
                WHEN ''Bueno (7-8)'' THEN 3
                WHEN ''Regular (6-7)'' THEN 4
                ELSE 5
            END;

    END;
    '
) END
-- Store procedure to get average grades per teacher and subject
IF NOT EXISTS (
  SELECT
    *
  FROM
    sys.objects
  WHERE
    type = 'P'
    AND name = 'GetAverageScorePerTeacherAndSubject'
) BEGIN EXEC (
  '
    CREATE PROCEDURE GetAverageScorePerTeacherAndSubject
        @academicYearId VARCHAR(50),
        @courseId VARCHAR(50) = NULL,
        @teacherId INT = NULL
    AS
    BEGIN
        SET NOCOUNT ON;

        WITH StudentScore AS(
            SELECT
                T."firstName" + '' '' + T."lastName" AS teacher,
                S.name AS "subject",
                G."studentId",
                AVG(G.score) AS score
            FROM
                "CourseTeacher" CT
            INNER JOIN "Teacher" T ON CT."teacherId" = T.id
            INNER JOIN "Subject" S ON CT."subjectId" = S.id
            INNER JOIN "Grade" G ON G."subjectId" = S.id
            INNER JOIN "Student" S2 ON S2.ID = G."studentId"
            AND S2."courseId" = CT."courseId"
            INNER JOIN "Period" P ON G."periodId" = P.id
            INNER JOIN "AcademicYear" AY ON AY.ID = P."academicYearId"
            AND CT."academicYearId" = AY.ID
            WHERE
                P."isRelevant" = 1
                AND P.academicYearId = @academicYearId
                AND (@courseId IS NULL OR CT.courseId = @courseId)
                AND (@teacherId IS NULL OR CT.teacherId = @teacherId)
            GROUP BY
                T.id,
                T."firstName",
                T."lastName",
                S."name",
                G."studentId"
        )
        SELECT
            teacher,
            "subject",
            CONVERT(INTEGER, COUNT(*)) AS "totalStudents",
            CONVERT(REAL, SUM(CASE WHEN score >= 7 THEN 1 ELSE 0 END)) AS "approvedStudents",
            CONVERT(REAL, ROUND(
                SUM(CASE WHEN score >= 7 THEN 1 ELSE 0 END) * 100.0 / COUNT(*),
                2
            )) AS "percentApproved"
        FROM StudentScore
        GROUP BY teacher,
            "subject";

    END;
    '
) END
-- Store procedure to get average grades per teacher and subject details
IF NOT EXISTS (
  SELECT
    *
  FROM
    sys.objects
  WHERE
    type = 'P'
    AND name = 'GetAverageScorePerTeacherAndSubjectDetails'
) BEGIN EXEC (
  '
    CREATE PROCEDURE GetAverageScorePerTeacherAndSubjectDetails
        @academicYearId VARCHAR(50),
        @courseId VARCHAR(50) = NULL,
        @teacherId INT = NULL,
        @teacherName VARCHAR(255),
        @subjectName VARCHAR(255)
    AS
    BEGIN
        SET NOCOUNT ON;

        WITH StudentScore AS(
            SELECT
                T."firstName" + '' '' + T."lastName" AS teacher,
                S.name AS "subject",
                G."studentId",
                AVG(G.score) AS score,
                C."name" AS "course",
                ST."firstName" + '' '' + ST."lastName" AS "student"
            FROM
                "CourseTeacher" CT
            INNER JOIN "Teacher" T ON CT."teacherId" = T.id
            INNER JOIN "Subject" S ON CT."subjectId" = S.id
            INNER JOIN "Grade" G ON G."subjectId" = S.id
            INNER JOIN "Period" P ON G."periodId" = P.id
            INNER JOIN "Course" C ON C.ID = CT."courseId"
            INNER JOIN "Student" ST ON ST.ID = G."studentId"
            AND ST."courseId" = CT."courseId"
            INNER JOIN "AcademicYear" AY ON AY.ID = P."academicYearId"
            AND CT."academicYearId" = AY.ID
            WHERE
                P."isRelevant" = 1
                AND P.academicYearId = @academicYearId
                AND (@courseId IS NULL OR CT.courseId = @courseId)
                AND (@teacherId IS NULL OR CT.teacherId = @teacherId)
                AND T."firstName" + '' '' + T."lastName" = @teacherName
                AND S.name = @subjectName
            GROUP BY
                T.id,
                T."firstName",
                T."lastName",
                S."name",
                G."studentId",
                C."name",
                ST."firstName" + '' '' + ST."lastName"
        )
        SELECT
            teacher,
            subject,
            student,
            course,
            CONVERT(REAL, ROUND(score, 2)) as "score",
            CASE
                WHEN score >= 7
                THEN ''Aprobado''
                ELSE ''Reprobado''
            END AS status
        FROM StudentScore
        ORDER BY status, student;

    END;
    '
) END
-- Store procedure to get average grades per course and subject
IF NOT EXISTS (
  SELECT
    *
  FROM
    sys.objects
  WHERE
    type = 'P'
    AND name = 'GetAverageScorePerCourseAndSubject'
) BEGIN EXEC (
  '
   CREATE PROCEDURE GetAverageScorePerCourseAndSubject
        @academicYearId VARCHAR(50)
    AS
    BEGIN
        SET NOCOUNT ON;

        SELECT DISTINCT
            G."subjectId",
            S."name" AS "subject",
            ST."courseId",
            C."name" AS "course",
            AY."name" AS "year",
            AY."id" AS "academicYearId"
        FROM "Grade" G
        INNER JOIN "Period" P ON P.id = G."periodId"
        INNER JOIN "Subject" S ON S.id = G."subjectId"
        INNER JOIN "Student" ST ON ST."id" = G."studentId"
        INNER JOIN "Course" C ON C."id" = ST."courseId"
        INNER JOIN "AcademicYear" AY ON AY."id" = P."academicYearId"
        WHERE P."academicYearId" = @academicYearId
        ORDER BY G."subjectId", ST."courseId";

    END;
  '
) END
-- Store procedure to get subject with average score
IF NOT EXISTS (
  SELECT
    *
  FROM
    sys.objects
  WHERE
    type = 'P'
    AND name = 'GetSubjectWithAverageScore'
) BEGIN EXEC (
  '
    CREATE PROCEDURE GetSubjectWithAverageScore
        @academicYearId VARCHAR(50),
        @courseId VARCHAR(50) = NULL,
        @teacherId INT = NULL,
        @subjectId VARCHAR(20)
    AS
    BEGIN
        SET NOCOUNT ON;

        SELECT
            S.id,
            S."name",
            CONVERT(REAL, ROUND(AVG(G.SCORE), 2)) AS score
        FROM "Subject" S
        INNER JOIN "CourseTeacher" CT ON CT."subjectId" = S.ID
        INNER JOIN "Course" C ON C.ID = CT."courseId"
        INNER JOIN "Grade" G ON G."subjectId" = S.ID
        INNER JOIN "Student" S2 ON S2.ID = G."studentId"
        AND CT."courseId" = S2."courseId"
        INNER JOIN "Period" P ON P.ID = G."periodId"
        AND P."isRelevant" = 1
        INNER JOIN "Teacher" T ON T.ID = CT."teacherId"
        INNER JOIN "AcademicYear" AY ON AY.ID = P."academicYearId"
        AND CT."academicYearId" = AY.ID
        WHERE AY.ID = @academicYearId
            AND (@courseId IS NULL OR CT.courseId = @courseId)
            AND (@teacherId IS NULL OR CT.teacherId = @teacherId)
            AND S.ID = @subjectId
        GROUP BY S.ID,
            S."name"
        ORDER BY S.ID;

    END;
    '
) END
-- Store procedure to get grades by subject
IF NOT EXISTS (
  SELECT
    *
  FROM
    sys.objects
  WHERE
    type = 'P'
    AND name = 'GetGradesBySubject'
) BEGIN EXEC (
  '
    CREATE PROCEDURE GetGradesBySubject
        @academicYearId VARCHAR(50),
        @courseId VARCHAR(50) = NULL,
        @teacherId INT = NULL,
        @subjectId VARCHAR(20)
    AS
    BEGIN
        SET NOCOUNT ON;

        SELECT
            S.id,
            S.NAME AS "subject",
            C.NAME AS "course",
            T."firstName" AS "teacher",
            S2."firstName" + '' '' + S2."lastName" AS "student",
            G.score,
            P.LABEL AS "period",
            AY."name" AS "academicYear"
        FROM "Subject" S
        INNER JOIN "CourseTeacher" CT ON CT."subjectId" = S.ID
        INNER JOIN "Course" C ON C.ID = CT."courseId"
        INNER JOIN "Grade" G ON G."subjectId" = S.ID
        INNER JOIN "Student" S2 ON S2.ID = G."studentId"
        AND C."id" = S2."courseId"
        INNER JOIN "Period" P ON P.ID = G."periodId"
        INNER JOIN "Teacher" T ON T.ID = CT."teacherId"
        INNER JOIN "AcademicYear" AY ON AY.ID = P."academicYearId"
        AND CT."academicYearId" = AY.ID
        WHERE P.academicYearId = @academicYearId
            AND (@courseId IS NULL OR CT.courseId = @courseId)
            AND (@teacherId IS NULL OR CT.teacherId = @teacherId)
            AND S."id" = @subjectId
        ORDER BY CONVERT(INTEGER, P."sortOrder");

    END;
    '
) END
-- Store procedure to get periods by academic year
IF NOT EXISTS (
  SELECT
    *
  FROM
    sys.objects
  WHERE
    type = 'P'
    AND name = 'GetPeriodsByYear'
) BEGIN EXEC (
  '
    CREATE PROCEDURE GetPeriodsByYear
        @academicYearId VARCHAR(50)
    AS
    BEGIN
        SET NOCOUNT ON;

        SELECT DISTINCT
            P.id,
            P.label,
            P.formula,
            CONVERT(INTEGER, P."sortOrder") AS "sortOrder"
        FROM "Period" P
        LEFT JOIN "Grade" G ON G."periodId" = P.ID
        WHERE P."academicYearId" = @academicYearId
        ORDER BY CONVERT(INTEGER, P."sortOrder");

    END;
    '
) END