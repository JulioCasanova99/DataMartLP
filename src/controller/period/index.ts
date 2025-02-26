import { Prisma } from '@prisma/client'
import { Workbook } from 'exceljs'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { TABLE_NAME, WORKSHEET_NAME } from '../../constants'
import prisma from '../../database/db-client'
import { validatedHeaders } from '../../utils/validateHeaders'

export class PeriodController {
  public async createPeriod(
    this: FastifyInstance,
    request: FastifyRequest<{
      Body: Prisma.PeriodUncheckedCreateInput[]
    }>,
    reply: FastifyReply
  ) {
    const body = request.body
    try {
      await Promise.all([
        body.forEach(async (data) => {
          const { academicYearId, typePeriodId } = data

          const existingPeriods = await prisma.period.findFirst({
            where: {
              typePeriodId: typePeriodId,
              academicYearId: academicYearId,
              label: data.label,
            },
          })
          if (existingPeriods) {
            return reply
              .code(400)
              .send({ error: 'Periods for this type and year already exist' })
          }

          const typePeriod = await prisma.typePeriod.findUnique({
            where: { id: typePeriodId },
            select: { type: true },
          })

          if (!typePeriod) {
            return reply.code(404).send({
              error: 'TypePeriod not found',
            })
          }

          await prisma.period.create({
            data: {
              ...data,
              formula: data.formula ? data.formula : null,
            },
          })
        }),
      ])

      reply.code(201).send({ message: 'Period created successfully' })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }

  public async updatePeriod(
    this: FastifyInstance,
    request: FastifyRequest<{ Body: Prisma.PeriodUncheckedUpdateInput }>,
    reply: FastifyReply
  ) {
    try {
      const { id, ...body } = request.body

      if (!id || isNaN(Number(id))) {
        reply.code(400).send({ error: 'Invalid or missing "id" field' })
        return
      }

      if (body.academicYearId && isNaN(Number(body.academicYearId))) {
        reply.code(400).send({ error: 'Invalid "academicYearId" field' })
        return
      }

      if (body.formula && typeof body.formula !== 'string') {
        reply.code(400).send({ error: 'Invalid "formula" field' })
        return
      }

      const existingPeriod = await prisma.period.findUnique({
        where: { id: Number(id) },
      })

      if (!existingPeriod) {
        reply.code(404).send({ error: 'Period not found' })
        return
      }

      const existingTypePeriod = await prisma.typePeriod.findUnique({
        where: { id: String(body.typePeriodId) },
      })

      if (!existingTypePeriod) {
        reply.code(404).send({ error: 'TypePeriod not found' })
        return
      }

      const existingAcademicYear = await prisma.academicYear.findUnique({
        where: { id: String(body.academicYearId) },
      })

      if (!existingAcademicYear) {
        reply.code(404).send({ error: 'AcademicYear not found' })
        return
      }

      await prisma.period.update({
        where: { id: Number(id) },
        data: {
          ...body,
          formula: body.formula ? body.formula : null,
        },
      })

      reply.code(200).send({ message: 'Period updated successfully' })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }

  public async deletePeriod(
    this: FastifyInstance,
    request: FastifyRequest<{ Params: Prisma.PeriodWhereUniqueInput }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params

      await prisma.period.delete({
        where: { id: Number(id) },
      })

      reply.code(200).send({ message: 'Period deleted successfully' })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }

  public async getAllPeriod(
    this: FastifyInstance,
    request: FastifyRequest<{ Querystring: { year: string | undefined } }>,
    reply: FastifyReply
  ) {
    try {
      const { year } = request.query
      const result = await prisma.period.findMany({
        where: { academicYearId: year ?? undefined },
        include: { typePeriod: true, academicYear: true },
        orderBy: { id: 'asc' },
      })

      reply.code(200).send({ response: result })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }

  public async uploadPeriod(
    this: FastifyInstance,
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const file = await request.file()

      if (!file) {
        return reply.status(400).send({ error: 'No file uploaded.' })
      }

      const workbook = new Workbook()
      await workbook.xlsx.load((await file.toBuffer()) as any)

      const sheet = workbook.getWorksheet(WORKSHEET_NAME.PERIODS)

      if (!sheet) {
        return reply.status(400).send({
          error: `Invalid Excel file format. Change the name of the sheet to "${WORKSHEET_NAME.PERIODS}"`,
        })
      }

      const headers = sheet.getRow(1).values as string[]

      const validHeaders = await validatedHeaders(headers, TABLE_NAME.PERIOD)

      if (validHeaders.length === 0) {
        return reply.status(400).send({
          error: 'No valid headers found in the Excel file.',
        })
      }

      const createData: Prisma.PeriodUncheckedCreateInput[] = []

      sheet.eachRow(async (row, rowNumber) => {
        if (rowNumber === 1) return

        const data: Record<string, string | number | boolean | null> = {}

        headers.forEach((header, index) => {
          const value = row.getCell(index).value

          data[header] = value?.toString()?.trim() ?? null
          if (header === 'isRelevant') data[header] = Boolean(value)
        })

        createData.push(data as unknown as Prisma.PeriodUncheckedCreateInput)
      })

      const errors: string[] = []

      for (const data of createData) {
        try {
          if (!data.label || !data.academicYearId || !data.typePeriodId) {
            errors.push(
              `Error processing ID "${data.label} - ${data.academicYearId} - ${data.typePeriodId}": Missing required fields`
            )
            continue
          }

          const existingPeriod = await prisma.period.findFirst({
            where: {
              label: data.label,
              academicYearId: data.academicYearId,
            },
          })

          const existingTypePeriod = await prisma.typePeriod.findUnique({
            where: { id: data.typePeriodId },
          })

          if (!existingTypePeriod) {
            errors.push(
              `Error processing ID "${data.typePeriodId}": Type period not found`
            )
            continue
          }

          if (existingPeriod) {
            errors.push(
              `Error processing ID "${data.label} - ${data.academicYearId}": Period in this year already exists`
            )
            continue
          }

          await prisma.period.create({ data })
        } catch (error: any) {
          errors.push(`Error processing ID "${data.label}": ${error.message}`)
        }
      }

      if (errors.length > 0) {
        return reply.status(400).send({ error: errors })
      }

      reply.code(201).send({ message: 'Period upload successfully' })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }
}
