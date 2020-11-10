import {Color} from './Color'
import {ObjectUtil} from '../utils/ObjectUtil'

/** Pip category. */
export type Suit = typeof Suit.values[number]

export namespace Suit {
  export const values = <const>['clubs', 'diamonds', 'hearts', 'spades']

  /**
   * The contiguous [relative ordering] of each suit.
   *
   * [relative ordering]: https://en.wikipedia.org/wiki/High_card_by_suit
   */
  export const toOrder = values.reduce(
    (order, value, index) => ({...order, [value]: index}),
    <Readonly<Record<Suit, number>>>{}
  )

  /** Order to Suit map. */
  export const fromOrder: Readonly<Record<
    number,
    Suit
  >> = ObjectUtil.reverseRecord(toOrder)

  /** The color of each suit. */
  export const toColor: Readonly<Record<Suit, Color>> = {
    clubs: 'black',
    diamonds: 'red',
    hearts: 'red',
    spades: 'black'
  }
}
