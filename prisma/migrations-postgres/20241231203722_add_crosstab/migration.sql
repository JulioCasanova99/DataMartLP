-- Install extension if not already installed
CREATE EXTENSION IF NOT EXISTS tablefunc;
DROP FUNCTION IF EXISTS "getGradesBySubjects";
-- Create the crossTab to get grades by periods function
DROP FUNCTION IF EXISTS "getGradesByPeriod";
CREATE OR REPLACE FUNCTION "getGradesByPeriod"(
    year_param  VARCHAR,
    subjectId VARCHAR,
    courseId VARCHAR
)
RETURNS varchar
LANGUAGE plpgsql
 AS $$
DECLARE
    col_types TEXT;
    dynamic_query TEXT;
BEGIN
    col_types := (
        SELECT STRING_AGG(format('"%s" REAL', p.LABEL), ', ')
        FROM "Period" p
        WHERE EXISTS (
            SELECT 1
            FROM "Grade" G
            INNER JOIN "Student" ST ON ST.id = G."studentId"
            WHERE G."periodId" = P.ID
            AND p."year" = year_param
            AND G."subjectId" = subjectId
            AND ST."courseId" = courseId
        )
    );

    dynamic_query := format('
        SELECT
            *
        FROM crosstab(
            $q$
                SELECT
                    g."studentId",
                    p.label::VARCHAR,
                    ROUND(G.score, 2)::REAL value
                FROM "Grade" G
                INNER JOIN "Period" P ON P.ID = G."periodId"
                INNER JOIN "Subject" S ON S.ID = G."subjectId"
                INNER JOIN "Student" ST ON ST."id" = G."studentId"
                WHERE P."year" = %L
                AND G."subjectId" = %L
                AND ST."courseId" = %L
                ORDER BY G."studentId", G."periodId"
            $q$,
            $q$
                SELECT LABEL FROM "Period" P
                WHERE EXISTS (
                    SELECT 1
                    FROM "Grade" G
                    INNER JOIN "Student" ST ON ST.id = G."studentId"
                    WHERE G."periodId" = P.ID
                    AND P."year" = %L
                    AND G."subjectId" =%L
                    AND ST."courseId" = %L
                )
                AND P."year" = %L
            $q$
        ) AS crosstab_result("studentId" VARCHAR, %s)
     ', year_param, subjectId, courseId,
        year_param, subjectId, courseId,
        year_param, col_types
    );

    RETURN dynamic_query;
END;
$$;

-- Create the crossTab to get grades by subjects function
CREATE OR REPLACE FUNCTION "getGradesBySubjects"(year_param character varying, course_id_param character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE
    col_types TEXT;
    dynamic_query TEXT;
    subjects TEXT;
BEGIN
    col_types := (
        SELECT STRING_AGG(format('"%s" REAL', s."name"), ', ')
        FROM "Subject" s
        WHERE EXISTS (
        	SELECT 1
        	FROM "Grade" G
        	INNER JOIN "Student" ST ON ST.id = G."studentId"
        	INNER JOIN "Period" p ON p.id = g."periodId"
        	WHERE G."subjectId"= s.ID
        	AND p."year" = year_param
        	AND (course_id_param IS NULL OR ST."courseId" = course_id_param)
        )

    );

    SELECT STRING_AGG(format('COALESCE("%s", 0)', name), ' + ')
    INTO subjects
    FROM "Subject" s
    WHERE EXISTS (
        SELECT 1
        FROM "Grade" G
        INNER JOIN "Student" ST ON ST.id = G."studentId"
        INNER JOIN "Period" p ON p.id = g."periodId"
        WHERE G."subjectId"= s.ID
        AND p."year" = year_param
        AND (course_id_param IS NULL OR ST."courseId" = course_id_param)
    );

    dynamic_query := format($sql$
        SELECT
            *,
            ROUND((%s)::NUMERIC / %s, 2)::REAL AS score
        FROM crosstab(
            $q$
                SELECT
                    CONCAT(s."firstName",' ', s."lastName") AS "fullName",
                    c."name" AS course,
                    s2."name" AS subject,
                    coalesce(avg(g.SCORE), 0)::REAL
                FROM "Student" s
                INNER JOIN "Grade" g ON g."studentId" = s.ID
                INNER JOIN "Period" p ON p.ID = g."periodId"
                AND p."isRelevant" = true
                INNER JOIN "Subject" s2 ON s2.ID = g."subjectId"
                INNER JOIN "Course" c ON c.ID = s."courseId"
                WHERE p."year" = %L
                AND (%L IS NULL OR S."courseId" = %L)
                GROUP BY CONCAT(s."firstName",' ', s."lastName"),
                    c."name",
                    s2."name",
                    c.id
                ORDER BY "course", "fullName", "subject"
            $q$,
            $q$
                SELECT s.name
                FROM "Subject" s
                WHERE EXISTS (
                    SELECT 1
                    FROM "Grade" G
                    INNER JOIN "Student" ST ON ST.id = G."studentId"
                    INNER JOIN "Period" p ON p.id = g."periodId"
                    WHERE G."subjectId"= s.ID
                    AND p."year" = %L
                    AND (%L IS NULL OR ST."courseId" = %L)
                )
            $q$
        ) AS crosstab_result("fullName" VARCHAR, course VARCHAR, %s)
     $sql$,
        subjects,
        (SELECT COUNT(*) FROM "Subject" s
         WHERE EXISTS (
             SELECT 1
             FROM "Grade" G
             INNER JOIN "Student" ST ON ST.id = G."studentId"
             INNER JOIN "Period" p ON p.id = g."periodId"
             WHERE G."subjectId" = s.ID
             AND p."year" = year_param
             AND (course_id_param IS NULL OR ST."courseId" = course_id_param)
         )),
        year_param, course_id_param, course_id_param,
        year_param, course_id_param, course_id_param,
        col_types
    );

    RETURN dynamic_query;
END;
$function$
;
