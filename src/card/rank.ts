import { Inverse } from '../utils/inverse.ts'

/**
 * Pip or face denomination. Number cards are usually represented with a
 * quantity of pips equal to the rank's value. For example, a rank of five
 * often has five pip symbols.
 */
export type Rank = Parameters<typeof RankSet['has']>[0]
export const RankSet = new Set(
  [
    'Ace',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Jack',
    'Queen',
    'King',
  ] as const,
)

// deno-fmt-ignore
export type RankASCII = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

/**
 * The contiguous relative ordering of each rank. Not to be confused with
 * pointing.
 */
export const rankToOrder = [...RankSet].reduce(
  (order, value, index) => ({ ...order, [value]: index }),
  <Readonly<Record<Rank, number>>> {},
)

/**
 * The pip value of a rank used for scoring. Not to be confused with order.
 */
export const rankToPoint = {
  Ace: 1,
  Two: 2,
  Three: 3,
  Four: 4,
  Five: 5,
  Six: 6,
  Seven: 7,
  Eight: 8,
  Nine: 9,
  Ten: 10,
  Jack: 11,
  Queen: 13,
  King: 14,
} as const satisfies Record<Rank, number>

/** Point to Rank map. */
export const rankFromPoint: Readonly<Record<number, Rank>> = Inverse(
  rankToPoint,
)

export const rankToASCII = {
  Ace: 'A',
  Two: '2',
  Three: '3',
  Four: '4',
  Five: '5',
  Six: '6',
  Seven: '7',
  Eight: '8',
  Nine: '9',
  Ten: '10',
  Jack: 'J',
  Queen: 'Q',
  King: 'K',
} as const satisfies Record<Rank, string>
