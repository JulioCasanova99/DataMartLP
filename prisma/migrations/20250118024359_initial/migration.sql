BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] INT NOT NULL IDENTITY(1,1),
    [username] VARCHAR(50),
    [password] VARCHAR(255),
    [roleId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [User_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [User_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_username_key] UNIQUE NONCLUSTERED ([username])
);

-- CreateTable
CREATE TABLE [dbo].[Role] (
    [id] INT NOT NULL IDENTITY(1,1),
    [type] VARCHAR(50),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Role_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [Role_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Role_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Role_type_key] UNIQUE NONCLUSTERED ([type])
);

-- CreateTable
CREATE TABLE [dbo].[Subject] (
    [id] VARCHAR(20) NOT NULL,
    [name] VARCHAR(100),
    [description] VARCHAR(255),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Subject_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [Subject_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Subject_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Student] (
    [id] INT NOT NULL IDENTITY(1,1),
    [dni] VARCHAR(15),
    [firstName] VARCHAR(50),
    [lastName] VARCHAR(50),
    [gender] NVARCHAR(1000),
    [address] VARCHAR(255),
    [dateOfBirth] DATETIME2,
    [representativeId] INT,
    [courseId] VARCHAR(20),
    [academicYearId] VARCHAR(20),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Student_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [Student_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Student_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Period] (
    [id] INT NOT NULL IDENTITY(1,1),
    [sortOrder] VARCHAR(50),
    [name] VARCHAR(50),
    [label] VARCHAR(50),
    [typePeriodId] VARCHAR(20) NOT NULL,
    [academicYearId] VARCHAR(20),
    [formula] VARCHAR(255),
    [isRelevant] BIT NOT NULL CONSTRAINT [Period_isRelevant_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Period_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [Period_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Period_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[TypePeriod] (
    [id] VARCHAR(20) NOT NULL,
    [type] VARCHAR(100),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [TypePeriod_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [TypePeriod_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [TypePeriod_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [TypePeriod_type_key] UNIQUE NONCLUSTERED ([type])
);

-- CreateTable
CREATE TABLE [dbo].[Representative] (
    [id] INT NOT NULL IDENTITY(1,1),
    [dni] VARCHAR(15),
    [name] VARCHAR(50),
    [lastName] VARCHAR(50),
    [email] VARCHAR(100),
    [workPlace] VARCHAR(200),
    [workstation] VARCHAR(200),
    [phone1] VARCHAR(15),
    [phone2] VARCHAR(15),
    [address] VARCHAR(255),
    [relationship] VARCHAR(100),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Representative_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [Representative_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Representative_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Representative_dni_key] UNIQUE NONCLUSTERED ([dni]),
    CONSTRAINT [Representative_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[Course] (
    [id] VARCHAR(20) NOT NULL,
    [name] VARCHAR(100),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Course_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [Course_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Course_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Teacher] (
    [id] INT NOT NULL IDENTITY(1,1),
    [dni] VARCHAR(15),
    [firstName] VARCHAR(50),
    [lastName] VARCHAR(50),
    [email] VARCHAR(100),
    [phone] VARCHAR(15),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Teacher_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [Teacher_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Teacher_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Teacher_dni_key] UNIQUE NONCLUSTERED ([dni]),
    CONSTRAINT [Teacher_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[CourseTeacher] (
    [teacherId] INT NOT NULL,
    [subjectId] VARCHAR(20) NOT NULL,
    [courseId] VARCHAR(20) NOT NULL,
    [academicYearId] VARCHAR(20) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [CourseTeacher_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [CourseTeacher_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [CourseTeacher_pkey] PRIMARY KEY CLUSTERED ([subjectId],[teacherId],[courseId],[academicYearId])
);

-- CreateTable
CREATE TABLE [dbo].[Grade] (
    [id] INT NOT NULL IDENTITY(1,1),
    [studentId] INT NOT NULL,
    [subjectId] VARCHAR(20),
    [periodId] INT,
    [score] DECIMAL(5,2),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Grade_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [Grade_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Grade_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[DisciplineRecord] (
    [id] INT NOT NULL IDENTITY(1,1),
    [studentId] INT NOT NULL,
    [periodId] INT NOT NULL,
    [observation] VARCHAR(255),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [DisciplineRecord_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [DisciplineRecord_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [DisciplineRecord_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[AcademicYear] (
    [id] VARCHAR(20) NOT NULL,
    [name] VARCHAR(50) NOT NULL,
    [startDate] DATETIME2 NOT NULL,
    [endDate] DATETIME2 NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [AcademicYear_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [AcademicYear_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [AcademicYear_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [AcademicYear_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [User_roleId_idx] ON [dbo].[User]([roleId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Student_representativeId_idx] ON [dbo].[Student]([representativeId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Period_typePeriodId_idx] ON [dbo].[Period]([typePeriodId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Representative_dni_idx] ON [dbo].[Representative]([dni]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Representative_email_idx] ON [dbo].[Representative]([email]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Teacher_email_idx] ON [dbo].[Teacher]([email]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Teacher_dni_idx] ON [dbo].[Teacher]([dni]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Grade_studentId_subjectId_periodId_idx] ON [dbo].[Grade]([studentId], [subjectId], [periodId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [DisciplineRecord_studentId_periodId_idx] ON [dbo].[DisciplineRecord]([studentId], [periodId]);

-- AddForeignKey
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_roleId_fkey] FOREIGN KEY ([roleId]) REFERENCES [dbo].[Role]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Student] ADD CONSTRAINT [Student_representativeId_fkey] FOREIGN KEY ([representativeId]) REFERENCES [dbo].[Representative]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Student] ADD CONSTRAINT [Student_courseId_fkey] FOREIGN KEY ([courseId]) REFERENCES [dbo].[Course]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Student] ADD CONSTRAINT [Student_academicYearId_fkey] FOREIGN KEY ([academicYearId]) REFERENCES [dbo].[AcademicYear]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Period] ADD CONSTRAINT [Period_typePeriodId_fkey] FOREIGN KEY ([typePeriodId]) REFERENCES [dbo].[TypePeriod]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Period] ADD CONSTRAINT [Period_academicYearId_fkey] FOREIGN KEY ([academicYearId]) REFERENCES [dbo].[AcademicYear]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CourseTeacher] ADD CONSTRAINT [CourseTeacher_teacherId_fkey] FOREIGN KEY ([teacherId]) REFERENCES [dbo].[Teacher]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CourseTeacher] ADD CONSTRAINT [CourseTeacher_subjectId_fkey] FOREIGN KEY ([subjectId]) REFERENCES [dbo].[Subject]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CourseTeacher] ADD CONSTRAINT [CourseTeacher_courseId_fkey] FOREIGN KEY ([courseId]) REFERENCES [dbo].[Course]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CourseTeacher] ADD CONSTRAINT [CourseTeacher_academicYearId_fkey] FOREIGN KEY ([academicYearId]) REFERENCES [dbo].[AcademicYear]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Grade] ADD CONSTRAINT [Grade_studentId_fkey] FOREIGN KEY ([studentId]) REFERENCES [dbo].[Student]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Grade] ADD CONSTRAINT [Grade_subjectId_fkey] FOREIGN KEY ([subjectId]) REFERENCES [dbo].[Subject]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Grade] ADD CONSTRAINT [Grade_periodId_fkey] FOREIGN KEY ([periodId]) REFERENCES [dbo].[Period]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DisciplineRecord] ADD CONSTRAINT [DisciplineRecord_studentId_fkey] FOREIGN KEY ([studentId]) REFERENCES [dbo].[Student]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DisciplineRecord] ADD CONSTRAINT [DisciplineRecord_periodId_fkey] FOREIGN KEY ([periodId]) REFERENCES [dbo].[Period]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
