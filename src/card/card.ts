import {
  Direction,
  Rank,
  RankASCII,
  Succeeds,
  Suit,
  SuitASCII,
  Visibility,
} from '@/solitaire'
import { assertNonNull, Immutable, NonNull } from '@/ooz'

/**
 * See
 * [Playing Cards Unicode block](https://en.wikipedia.org/wiki/Playing_cards_in_Unicode).
 * Suits are ordered reverse-alphabetically in Unicode.
 */
const unicode = Immutable(
  { rangeStart: 0x1f0a0, rankSize: 16, suitMax: 3 },
)

/**
 * A playing card.
 *
 * There is no scenario where a Card's rank or suit mutates so they are marked
 * readonly.
 */
export interface Card {
  direction: Direction
  readonly rank: Rank
  readonly suit: Suit
}

// to-do: support direction with casing where lowercase are hidden (down) and
// uppercase are visible (up).
/** A two-character, lowercase ASCII representation of a directionless card. */
export type CardASCII = `${SuitASCII}${RankASCII}`

/** Returns a new card. */
export function Card(direction: Direction, rank: Rank, suit: Suit): Card {
  return { direction, rank, suit }
}

export namespace Card {
  /** Tests direction of all cards. */
  export function isDirected(
    direction: Direction,
    ...cards: readonly Readonly<Card>[]
  ): boolean {
    return cards.every((card) => card.direction == direction)
  }

  /**
   * Creates zero or more cards from the unicode string oriented by direction.
   */
  export function fromString(
    str: string,
    direction: Direction = 'Up',
  ): Card[] {
    return [...str].map((code) => fromStringCode(code, direction))
  }

  /** Unicode to Card adapter. Only face-up codes are supported. */
  export function fromStringCode(
    code: string,
    direction: Direction = 'Up',
  ): Card {
    const point = NonNull(code.codePointAt(0), `No code point in ${code}.`)
    const index = point - unicode.rangeStart
    const suit =
      Suit.fromOrder[unicode.suitMax - Math.trunc(index / unicode.rankSize)]
    assertNonNull(suit, `No suit at code point ${point}.`)
    const rank = Rank.fromPoint[index % unicode.rankSize]
    assertNonNull(rank, `No rank at code point ${point}.`)
    return { direction, rank, suit }
  }

  /** True if pile succeeds. */
  export function succeeds(
    succeeds: Succeeds,
    ...cards: readonly Readonly<Card>[]
  ): boolean {
    if (cards.length == 0) return succeeds(undefined, undefined)
    for (let index = 0; index <= (cards.length - 1); index++) {
      if (!succeeds(cards[index], cards[index + 1])) return false
    }
    return true
  }

  export function toASCII(card: Readonly<Card>): CardASCII {
    return `${Suit.toASCII[card.suit]}${Rank.toASCII[card.rank]}`
  }

  /**
   * @return The Unicode character representation for each card concatenated.
   */
  export function toString(
    visibility: Visibility,
    ...cards: readonly Readonly<Card>[]
  ): string {
    return cards.reduce(
      (str, card) => str + cardToString(visibility, card),
      '',
    )
  }
}

function cardToString(
  visibility: Visibility,
  card: Readonly<Card>,
): string {
  if (visibility == 'Directed' && card.direction == 'Down') return '🂠'
  const point = unicode.rangeStart +
    (unicode.suitMax - Suit.toOrder[card.suit]) * unicode.rankSize +
    Rank.toPoint[card.rank]
  return String.fromCodePoint(point)
}
