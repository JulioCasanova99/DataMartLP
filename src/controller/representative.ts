import { Prisma } from '@prisma/client'
import { Workbook } from 'exceljs'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import {
  RELATION_SHIP_PERMITTED,
  TABLE_NAME,
  WORKSHEET_NAME,
} from '../constants'
import prisma from '../database/db-client'
import { validatedHeaders } from '../utils/validateHeaders'

export class RepresentativeController {
  public async createRepresentative(
    this: FastifyInstance,
    request: FastifyRequest<{ Body: Prisma.RepresentativeCreateInput }>,
    reply: FastifyReply
  ) {
    try {
      const { ...body } = request.body

      await prisma.representative.create({
        data: body,
      })

      reply.code(201).send({ message: 'Representative created successfully' })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }

  public async updateRepresentative(
    this: FastifyInstance,
    request: FastifyRequest<{
      Body: Prisma.RepresentativeUncheckedUpdateInput
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id, ...body } = request.body

      await prisma.representative.update({
        where: { id: Number(id) },
        data: body,
      })

      reply.code(200).send({ message: 'Representative updated successfully' })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }

  public async deleteRepresentative(
    this: FastifyInstance,
    request: FastifyRequest<{ Params: Prisma.RepresentativeWhereUniqueInput }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params

      await prisma.representative.delete({
        where: { id: Number(id) },
      })

      reply.code(200).send({ message: 'Representative deleted successfully' })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }

  public async getAllRepresentative(
    this: FastifyInstance,
    _request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const result = await prisma.representative.findMany({})

      reply.code(200).send({ response: result })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }
  public async uploadRepresentative(
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

      const sheet = workbook.getWorksheet(WORKSHEET_NAME.REPRESENTATIVES)

      if (!sheet) {
        return reply.status(400).send({
          error: `Invalid Excel file format. Change the name of the sheet to "${WORKSHEET_NAME.REPRESENTATIVES}"`,
        })
      }

      const headers = sheet.getRow(1).values as string[]

      const validHeaders = await validatedHeaders(
        headers,
        TABLE_NAME.REPRESENTATIVE
      )

      if (validHeaders.length === 0) {
        return reply.status(400).send({
          error: 'No valid headers found in the Excel file.',
        })
      }

      const createData: Prisma.RepresentativeCreateInput[] = []

      sheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return
        const data: Record<string, string | null> = {}

        headers.forEach((header, index) => {
          let value = row.getCell(index).value

          if (value && typeof value === 'object' && 'hyperlink' in value) {
            value = value.hyperlink
          }
          if (value && typeof value === 'object' && 'text' in value) {
            value = value.text as string
          }

          if (typeof value === 'string' && value.startsWith('mailto:')) {
            value = value.replace('mailto:', '').trim()
          }

          data[header] = value?.toString()?.trim() ?? null
        })

        createData.push(data as Prisma.RepresentativeCreateInput)
      })

      const errors: string[] = []

      for (const data of createData) {
        try {
          if (isNaN(Number(data.dni))) {
            errors.push(`DNI "${data.dni}" must be a number.`)
            continue
          }

          const existingRepresentative = await prisma.representative.findFirst({
            where: {
              OR: [{ dni: data.dni }, { email: data.email }],
            },
          })

          if (existingRepresentative) {
            errors.push(
              `Representative with DNI "${data.dni}" already exists. Or email "${data.email}" already exists.`
            )
            continue
          }

          if (
            data.relationship &&
            RELATION_SHIP_PERMITTED.indexOf(data.relationship) === -1
          ) {
            errors.push(
              `Invalid relationship "${
                data.relationship
              }" found. Please use the following options: ${RELATION_SHIP_PERMITTED.join(
                ', '
              )}`
            )
            continue
          }

          await prisma.representative.create({ data })
        } catch (err: any) {
          errors.push(`Error processing DNI "${data.dni}": ${err.message}`)
        }
      }

      if (errors.length > 0) {
        return reply.status(400).send({ error: errors })
      }

      reply.code(201).send({
        message: 'Processing complete.',
      })
    } catch (error) {
      this.log.error(error)
      throw error
    }
  }
}
