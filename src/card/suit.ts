import {Inverse} from '../utils/inverse.js'
import type {SuitColor} from './suit-color.js'

/** Pip category. */
export type Suit = Parameters<(typeof SuitSet)['has']>[0]

export type SuitASCII = 'C' | 'D' | 'H' | 'S'

export const SuitSet = new Set(<const>['Clubs', 'Diamonds', 'Hearts', 'Spades'])

/**
 * The contiguous [relative ordering] of each suit.
 *
 * [relative ordering]: https://en.wikipedia.org/wiki/High_card_by_suit
 */
export const suitToOrder = [...SuitSet].reduce(
  (order, value, index) => ({...order, [value]: index}),
  <{readonly [suit in Suit]: number}>{}
)

/** Order to Suit map. */
export const suitFromOrder: {readonly [point: number]: Suit} =
  Inverse(suitToOrder)

/** The color of each suit. */
export const suitToColor = (<const>{
  Clubs: 'Black',
  Diamonds: 'Red',
  Hearts: 'Red',
  Spades: 'Black'
}) satisfies {[suit in Suit]: SuitColor}

export const suitToASCII = (<const>{
  Clubs: 'C',
  Diamonds: 'D',
  Hearts: 'H',
  Spades: 'S'
}) satisfies {[suit in Suit]: string}
