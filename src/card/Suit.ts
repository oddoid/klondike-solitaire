import {ObjectUtil} from '../utils/ObjectUtil'

export namespace Suit {
  /** Pip category. */
  export type Type = typeof Type[keyof typeof Type]
  export const Type = <const>{
    Clubs: 'clubs',
    Diamonds: 'diamonds',
    Hearts: 'hearts',
    Spades: 'spades'
  }

  /** Suit color. */
  export type Color = typeof Color[keyof typeof Color]
  export const Color = <const>{
    Black: 'black',
    Red: 'red'
  }

  /**
   * The contiguous [relative ordering] of each suit.
   *
   * [relative ordering]: https://en.wikipedia.org/wiki/High_card_by_suit
   */
  export const toOrder = Object.values(Type).reduce(
    (order, value, index) => ({...order, [value]: index}),
    <Readonly<Record<Type, number>>>{}
  )

  /** Order to Suit map. */
  export const fromOrder: Readonly<Record<
    number,
    Type
  >> = ObjectUtil.reverseRecord(toOrder)

  /** The color of each suit. */
  export const toColor: Readonly<Record<Type, Color>> = {
    [Type.Clubs]: Color.Black,
    [Type.Diamonds]: Color.Red,
    [Type.Hearts]: Color.Red,
    [Type.Spades]: Color.Black
  }
}
