import {Rank} from './Rank'
import {Suit} from './Suit'

/** A playing card. */
export type Card = {suit: Suit.Type; rank: Rank.Type; direction: Card.Direction}

export namespace Card {
  /** See https://en.wikipedia.org/wiki/Standard_52-card_deck#Unicode. */
  const unicode = {rangeStart: 0x1f0a0, rankSize: 16, suitMax: 3}

  /**
   * The physical orientation of the card. All card backs are identical and
   * occlude the fronts. The front, or face, shows the card suit and rank.
   */
  export type Direction = typeof Direction[keyof typeof Direction]
  export const Direction = <const>{
    /** Card face hidden. Identity unknown. */
    Down: 'down',
    /** Card face visible. Identity known. */
    Up: 'up'
  }

  /** Unicode to Card adapter. Only face-up codes are supported. */
  export function fromString(code: string, direction: Direction = 'up'): Card {
    const point = (code.codePointAt(0) ?? 0) - unicode.rangeStart
    const suit = Suit.fromOrder[unicode.suitMax - ~~(point / unicode.rankSize)]
    const rank = Rank.fromPoint[point % unicode.rankSize]
    if (suit === undefined || rank === undefined)
      throw new Error(`Unknown point for "${code}".`)
    return {suit, rank, direction}
  }

  /**
   * @arg directed When true, respect card direction. That is, face down cards
   *  are represented as card backs. When false, all card identities are
   *  visible regardless of card directions. For example, a face down ace of
   *  spades is `'🂠'` when `directed` is true and `'🂡'` when false.
   * @ret The Unicode character representation for each card.
   */
  export function toString(
    directed: boolean,
    ...cards: readonly Readonly<Card>[]
  ): string {
    return cards.reduce((str, card) => str + cardToString(directed, card), '')
  }

  function cardToString(directed: boolean, card: Readonly<Card>): string {
    if (directed && card.direction === 'down') return '🂠'
    const point =
      unicode.rangeStart +
      (unicode.suitMax - Suit.toOrder[card.suit]) * unicode.rankSize +
      Rank.toPoint[card.rank]
    return String.fromCodePoint(point)
  }
}
