import { all, create } from 'mathjs'

const math = create(all, {
  precision: 2,
})

export class FormulaService {
  static evaluateFormula(
    formula: string,
    variables: Record<string, number>
  ): number {
    const parsedFormula = formula.replace(/{([^{}]+)}/g, (_, key) => {
      if (key in variables) {
        return variables[key].toString()
      }
      throw new Error(`Variable ${key} no definida`)
    })

    return math.evaluate(parsedFormula)
  }
}
