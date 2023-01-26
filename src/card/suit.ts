import { Immutable, Inverse } from '@/oidlib'
import { Color } from '@/solitaire'

/** Pip category. */
export type Suit = Parameters<typeof Suit.values['has']>[0]

export type SuitASCII = 'C' | 'D' | 'H' | 'S'

export namespace Suit {
  export const values = Immutable(
    new Set(['Clubs', 'Diamonds', 'Hearts', 'Spades'] as const),
  )

  /**
   * The contiguous [relative ordering] of each suit.
   *
   * [relative ordering]: https://en.wikipedia.org/wiki/High_card_by_suit
   */
  export const toOrder = Immutable([...values].reduce(
    (order, value, index) => ({ ...order, [value]: index }),
    <Readonly<Record<Suit, number>>> {},
  ))

  /** Order to Suit map. */
  export const fromOrder: Readonly<Record<number, Suit>> = Immutable(
    Inverse(toOrder),
  )

  /** The color of each suit. */
  export const toColor = Immutable(
    {
      Clubs: 'Black',
      Diamonds: 'Red',
      Hearts: 'Red',
      Spades: 'Black',
    } as const,
  ) satisfies Record<Suit, Color>

  export const toASCII = Immutable(
    { Clubs: 'C', Diamonds: 'D', Hearts: 'H', Spades: 'S' } as const,
  ) satisfies Record<Suit, string>
}
