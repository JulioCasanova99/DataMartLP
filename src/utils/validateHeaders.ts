import prisma from '../database/db-client'

export const validatedHeaders = async (
  sheetHeaders: string[],
  nameTable: string
) => {
  const result = await prisma.$queryRaw<
    { column_name: string }[]
  >`SELECT column_name FROM information_schema.columns WHERE table_name = ${nameTable}`

  const validFields = result.map((row) => row.column_name)

  const invalidHeaders = sheetHeaders.filter(
    (header) => !validFields.includes(header)
  )

  if (invalidHeaders.length > 0) {
    throw new Error(`Invalid columns detected: ${invalidHeaders.join(', ')}`)
  }

  return validFields
}
