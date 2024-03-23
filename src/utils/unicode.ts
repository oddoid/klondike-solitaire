export const ideographicSpace = '　'

export function fractionOfIntsChar(
  numerator: number,
  denominator: number
): string {
  const numeratorStr = intToSuperscript(numerator)
  const denominatorStr = intToSubscript(denominator)
  return `${numeratorStr}⁄${denominatorStr}`
}

function intToSubscript(val: number): string {
  const subscriptsStart = '₀'.codePointAt(0)
  let str = ''
  for (const digit of genIntDigits(val)) {
    str = `${String.fromCodePoint(subscriptsStart! + digit)}${str}`
  }
  return str
}

function intToSuperscript(val: number): string {
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
function* genIntDigits(val: number): Generator<number> {
  if (val === 0) return yield 0
  for (; val > 0; val = Math.trunc(val / 10)) yield val % 10
}
