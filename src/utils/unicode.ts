import { assert, Int } from '@/ooz'

export namespace Unicode {
  export const ideographicSpace = '　'

  export function fractionOfInts(numerator: Int, denominator: Int): string {
    const numeratorStr = intToSuperscript(numerator)
    const denominatorStr = intToSubscript(denominator)
    return `${numeratorStr}⁄${denominatorStr}`
  }

  function intToSubscript(val: Int): string {
    const subscriptsStart = '₀'.codePointAt(0)
    assert(subscriptsStart != null)
    let str = ''
    for (const digit of genIntDigits(val)) {
      str = `${String.fromCodePoint(subscriptsStart + digit)}${str}`
    }
    return str
  }

  function intToSuperscript(val: Int): string {
    // https://en.wikipedia.org/wiki/List_of_Unicode_characters#Superscripts_and_Subscripts
    // https://en.wikipedia.org/wiki/Latin-1_Supplement
    const superscripts = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹']
    let str = ''
    for (const digit of genIntDigits(val)) str = `${superscripts[digit]}${str}`
    return str
  }

  /**
   * Yields each base-10 digit (0-9) in val from least significant (rightmost)
   * to most.
   */
  function* genIntDigits(val: Int): Generator<Int> {
    if (val == 0) return yield Int(0)
    for (; val > 0; val = Int.trunc(val / 10)) yield Int(val % 10)
  }
}
