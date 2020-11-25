import {ObjectUtil} from '../utils/ObjectUtil'

/**
 * Pip or face denomination. Number cards are usually represented with a
 * quantity of pips equal to the rank's value. For example, a rank of five
 * often has five pip symbols.
 */
export type Rank = typeof Rank.values[number]

export namespace Rank {
  export const values = <const>[
    'ace',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'ten',
    'jack',
    // knight
    'queen',
    'king'
    // joker
  ]

  /**
   * The contiguous relative ordering of each rank. Not to be confused with
   * pointing.
   */
  export const toOrder = values.reduce(
    (order, value, index) => ({...order, [value]: index}),
    <Readonly<Record<Rank, number>>>{}
  )

  /**
   * The pip value of a rank used for scoring. Not to be confused with order.
   */
  export const toPoint: Readonly<Record<Rank, number>> = {
    ace: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
    jack: 11,
    queen: 13,
    king: 14
  }

  /** Point to Rank map. */
  export const fromPoint: Readonly<
    Record<number, Rank>
  > = ObjectUtil.reverseRecord(toPoint)
}
