import { Immutable, UintXY } from '@/ooz'
import {
  Card,
  Pile,
  Rank,
  Selected,
  Succeeds,
  Suit,
  Visibility,
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
const succeeds: Succeeds = (lhs, rhs) => {
  if (lhs?.direction == 'Down' || rhs?.direction == 'Down') return false
  if (rhs == null) return lhs != null
  if (lhs == null) return rhs.rank == 'Ace'
  if (lhs.suit != rhs.suit) return false
  return (Rank.toOrder[lhs.rank] + 1) == Rank.toOrder[rhs.rank]
}

const suitToIndex = Immutable(
  { Clubs: 0, Diamonds: 1, Hearts: 2, Spades: 3 } as const,
) satisfies Record<Suit, number>

export namespace Foundation {
  /**
   * Add a card to a foundation pillar. Invoke `isBuildable()` first to verify
   * the card is buildable.
   */
  export function build(self: Foundation, cards: Card[]): void {
    const card = cards[0]
    if (card == null || !isBuildable(self, cards)) return
    getPillar(self, card.suit).push(...cards.splice(0))
  }

  export function getPillar(self: Foundation, suit: Suit): Card[] {
    return self[suitToIndex[suit]]
  }

  /** Test whether a pile's top card can be built on foundation pillar. */
  export function isBuildable(
    self: Foundation,
    cards: readonly Readonly<Card>[],
  ): boolean {
    const card = cards[0]
    if (card == null || !Card.succeeds(succeeds, ...cards)) return false
    return succeeds(getPillar(self, card.suit).at(-1), card)
  }

  export function select(
    self: Readonly<Foundation>,
    card: Readonly<Card>,
  ): Selected | undefined {
    for (const [index, foundation] of self.entries()) {
      const y = foundation.indexOf(card)
      if (y == -1) continue
      return {
        cards: foundation.splice(y),
        pile: 'Foundation',
        xy: new UintXY(index, y),
      }
    }
  }

  /** Test whether the foundation is complete. */
  export function isBuilt(self: Readonly<Foundation>): boolean {
    return isPillarBuilt(...Object.values(self))
  }

  /** Test whether one or more pillars are complete. */
  export function isPillarBuilt(
    ...pillars: readonly (readonly Readonly<Card>[])[]
  ): boolean {
    return pillars.every((pillar) => pillar.at(-1)?.rank == 'King')
  }

  export function toString(
    self: Readonly<Foundation>,
    visibility: Visibility = 'Directed',
  ): string {
    return Pile.toString(Object.values(self), visibility)
  }
}
