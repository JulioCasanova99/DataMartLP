export const extractParameters = (formula: string): string[] => {
  const matches = formula.match(/{([\w%()]+)}/g)

  if (!matches) return []

  return matches.map((param) => param.replace(/[{}]/g, ''))
}
