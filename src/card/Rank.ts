import {ObjectUtil} from '../utils/ObjectUtil'

export namespace Rank {
  /**
   * Pip or face denomination. Number cards are usually represented with a
   * quantity of pips equal to the rank's value. For example, a rank of five
   * often has five pip symbols.
   */
  export type Type = typeof Type[keyof typeof Type]
  export const Type = <const>{
    Ace: 'ace',
    Two: 'two',
    Three: 'three',
    Four: 'four',
    Five: 'five',
    Six: 'six',
    Seven: 'seven',
    Eight: 'eight',
    Nine: 'nine',
    Ten: 'ten',
    Jack: 'jack',
    // Knight
    Queen: 'queen',
    King: 'king'
    // Joker
  }

  /**
   * The contiguous relative ordering of each rank. Not to be confused with
   * pointing.
   */
  export const toOrder = Object.values(Type).reduce(
    (order, value, index) => ({...order, [value]: index}),
    <Readonly<Record<Type, number>>>{}
  )

  /**
   * The pip value of a rank used for scoring. Not to be confused with order.
   */
  export const toPoint: Readonly<Record<Type, number>> = {
    [Type.Ace]: 1,
    [Type.Two]: 2,
    [Type.Three]: 3,
    [Type.Four]: 4,
    [Type.Five]: 5,
    [Type.Six]: 6,
    [Type.Seven]: 7,
    [Type.Eight]: 8,
    [Type.Nine]: 9,
    [Type.Ten]: 10,
    [Type.Jack]: 11,
    [Type.Queen]: 13,
    [Type.King]: 14
  }

  /** Point to Rank map. */
  export const fromPoint: Readonly<Record<
    number,
    Type
  >> = ObjectUtil.reverseRecord(toPoint)
}
