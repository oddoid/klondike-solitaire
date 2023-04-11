import { XY } from '@/ooz'
import {
  Card,
  CardsSelected,
  CardSucceeds,
  cardSucceeds,
  CardVisibility,
  pileToString,
  rankToOrder,
  Suit,
} from '@/solitaire'

/**
 * One foundation pillar per suit. The number of pillars are fixed and distinct.
 * Each pillar is initially empty and building them is the objective.
 * Consecutive ranks are built in ascending order from ace to king within a
 * suit, squared, and face-up. The top of a pillar is the last index.
 */
// export type Foundation = Readonly<Record<Suit, Card[]>>;
export type Foundation = readonly [
  Clubs: Card[],
  Diamonds: Card[],
  Hearts: Card[],
  Spades: Card[],
]

/** Create a set of ordered foundation piles. */
export function Foundation(): Foundation {
  return [[], [], [], []]
}

/**
 * Tests whether right directly succeeds left. True when cards are face up
 * and:
 * - Only one card (left).
 * - No preceding card (left) and right is an ace.
 * - Suits match and the rank is the next greater adjacent.
 */
const succeeds: CardSucceeds = (lhs, rhs) => {
  if (lhs?.direction === 'Down' || rhs?.direction === 'Down') return false
  if (rhs == null) return lhs != null
  if (lhs == null) return rhs.rank === 'Ace'
  if (lhs.suit !== rhs.suit) return false
  return (rankToOrder[lhs.rank] + 1) === rankToOrder[rhs.rank]
}

const suitToIndex = {
  Clubs: 0,
  Diamonds: 1,
  Hearts: 2,
  Spades: 3,
} as const satisfies Record<Suit, number>

/**
 * Add a card to a foundation pillar. Invoke `isBuildable()` first to verify
 * the card is buildable.
 */
export function foundationBuild(self: Foundation, cards: Card[]): void {
  const card = cards[0]
  if (card == null || !foundationIsBuildable(self, cards)) return
  foundationGetPillar(self, card.suit).push(...cards.splice(0))
}

export function foundationGetPillar(self: Foundation, suit: Suit): Card[] {
  return self[suitToIndex[suit]]
}

/** Test whether a pile's top card can be built on foundation pillar. */
export function foundationIsBuildable(
  self: Foundation,
  cards: readonly Readonly<Card>[],
): boolean {
  const card = cards[0]
  if (card == null || !cardSucceeds(succeeds, ...cards)) return false
  return succeeds(foundationGetPillar(self, card.suit).at(-1), card)
}

export function foundationSelect(
  self: Readonly<Foundation>,
  card: Readonly<Card>,
): CardsSelected | undefined {
  for (const [index, foundation] of self.entries()) {
    const y = foundation.indexOf(card)
    if (y === -1) continue
    return {
      cards: foundation.splice(y),
      pile: 'Foundation',
      xy: new XY(index, y),
    }
  }
}

/** Test whether the foundation is complete. */
export function foundationIsBuilt(self: Readonly<Foundation>): boolean {
  return foundationIsPillarBuilt(...Object.values(self))
}

/** Test whether one or more pillars are complete. */
export function foundationIsPillarBuilt(
  ...pillars: readonly (readonly Readonly<Card>[])[]
): boolean {
  return pillars.every((pillar) => pillar.at(-1)?.rank === 'King')
}

export function foundationToString(
  self: Readonly<Foundation>,
  visibility: CardVisibility = 'Directed',
): string {
  return pileToString(Object.values(self), visibility)
}
