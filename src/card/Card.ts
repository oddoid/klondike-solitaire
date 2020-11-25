import {Direction} from './Direction'
import {Rank} from './Rank'
import {Suit} from './Suit'

/**
 * A playing card.
 *
 * There is no scenario where a Card's rank or suit mutates so they are marked
 * readonly. Direction does change throughout gameplay.
 */
export interface Card {
  readonly suit: Suit
  readonly rank: Rank
  direction: Direction
}

export namespace Card {
  /**
   * [Playing Cards Unicode range](https://en.wikipedia.org/wiki/Playing_cards_in_Unicode).
   */
  const unicode = <const>{rangeStart: 0x1f0a0, rankSize: 16, suitMax: 3}

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
   * @return The Unicode character representation for each card.
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
