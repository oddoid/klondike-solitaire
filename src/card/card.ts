import { CardDirection } from './card-direction.ts'
import { CardSucceeds } from './card-succeeds.ts'
import { CardVisibility } from './card-visibility.ts'
import {
  Rank,
  RankASCII,
  rankFromPoint,
  rankToASCII,
  rankToPoint,
} from './rank.ts'
import {
  Suit,
  SuitASCII,
  suitFromOrder,
  suitToASCII,
  suitToOrder,
} from './suit.ts'

/**
 * See
 * [Playing Cards Unicode block](https://en.wikipedia.org/wiki/Playing_cards_in_Unicode).
 * Suits are ordered reverse-alphabetically in Unicode.
 */
const unicode = { rangeStart: 0x1f0a0, rankSize: 16, suitMax: 3 }

/**
 * A playing card.
 *
 * There is no scenario where a Card's rank or suit mutates so they are marked
 * readonly.
 */
export type Card = {
  direction: CardDirection
  readonly rank: Rank
  readonly suit: Suit
}

// to-do: support direction with casing where lowercase are hidden (down) and
// uppercase are visible (up).
/** A two-character, lowercase ASCII representation of a directionless card. */
export type CardASCII = `${SuitASCII}${RankASCII}`

/** Returns a new card. */
export function Card(direction: CardDirection, rank: Rank, suit: Suit): Card {
  return { direction, rank, suit }
}

/** Tests direction of all cards. */
export function cardIsDirected(
  direction: CardDirection,
  ...cards: readonly Readonly<Card>[]
): boolean {
  return cards.every((card) => card.direction === direction)
}

/**
 * Creates zero or more cards from the unicode string oriented by direction.
 */
export function cardFromString(
  str: string,
  direction: CardDirection = 'Up',
): Card[] {
  return [...str].map((code) => cardFromStringCode(code, direction))
}

/** Unicode to Card adapter. Only face-up codes are supported. */
export function cardFromStringCode(
  code: string,
  direction: CardDirection = 'Up',
): Card {
  const point = code.codePointAt(0)
  if (point == null) throw Error(`no code point in ${code}`)
  const index = point - unicode.rangeStart
  const suit =
    suitFromOrder[unicode.suitMax - Math.trunc(index / unicode.rankSize)]
  if (suit == null) throw Error(`no suit at code point ${point}`)
  const rank = rankFromPoint[index % unicode.rankSize]
  if (rank == null) throw Error(`no rank at code point ${point}`)
  return { direction, rank, suit }
}

/** True if pile succeeds. */
export function cardSucceeds(
  succeeds: CardSucceeds,
  ...cards: readonly Readonly<Card>[]
): boolean {
  if (cards.length === 0) return succeeds(undefined, undefined)
  for (let index = 0; index <= (cards.length - 1); index++) {
    if (!succeeds(cards[index], cards[index + 1])) return false
  }
  return true
}

export function cardToASCII(card: Readonly<Card>): CardASCII {
  return `${suitToASCII[card.suit]}${rankToASCII[card.rank]}`
}

/**
 * @return The Unicode character representation for each card concatenated.
 */
export function cardToString(
  visibility: CardVisibility,
  ...cards: readonly Readonly<Card>[]
): string {
  return cards.reduce((str, card) => str + _cardToString(visibility, card), '')
}

function _cardToString(
  visibility: CardVisibility,
  card: Readonly<Card>,
): string {
  if (visibility === 'Directed' && card.direction === 'Down') return '🂠'
  const point = unicode.rangeStart +
    (unicode.suitMax - suitToOrder[card.suit]) * unicode.rankSize +
    rankToPoint[card.rank]
  return String.fromCodePoint(point)
}
