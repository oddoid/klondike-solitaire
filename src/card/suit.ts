import { Inverse } from '@/ooz'
import { SuitColor } from '@/solitaire'

/** Pip category. */
export type Suit = Parameters<typeof SuitSet['has']>[0]

export type SuitASCII = 'C' | 'D' | 'H' | 'S'

export const SuitSet = new Set(
  ['Clubs', 'Diamonds', 'Hearts', 'Spades'] as const,
)

/**
 * The contiguous [relative ordering] of each suit.
 *
 * [relative ordering]: https://en.wikipedia.org/wiki/High_card_by_suit
 */
export const suitToOrder = [...SuitSet].reduce(
  (order, value, index) => ({ ...order, [value]: index }),
  <Readonly<Record<Suit, number>>> {},
)

/** Order to Suit map. */
export const suitFromOrder: Readonly<Record<number, Suit>> = Inverse(
  suitToOrder,
)

/** The color of each suit. */
export const suitToColor = {
  Clubs: 'Black',
  Diamonds: 'Red',
  Hearts: 'Red',
  Spades: 'Black',
} as const satisfies Record<Suit, SuitColor>

export const suitToASCII = {
  Clubs: 'C',
  Diamonds: 'D',
  Hearts: 'H',
  Spades: 'S',
} as const satisfies Record<Suit, string>
