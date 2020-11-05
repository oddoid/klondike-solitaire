import {Card} from '../card/Card'
import {Rank} from '../card/Rank'
import {Suit} from '../card/Suit'

/**
 * One pillar pile per suit. The number of piles are fixed and distinct.
 * The pillars are initially empty and building them is the objective.
 * Consecutive ranks are built in ascending order from ace to king within a
 * suit, squared and face-up. By convention, the top of a pile is the last
 * index.
 *
 * This data can also be modeled as a `readonly Card[][]` but doing so would
 * allow the suit pillar position to change within the array.
 */
export type Foundation = Readonly<Record<Suit.Type, Card[]>>

export namespace Foundation {
  /** Create a set of foundation pillars. */
  export function make(): Foundation {
    return Object.values(Suit.Type).reduce(
      (foundation, suit) => ({...foundation, [suit]: []}),
      <Foundation>{}
    )
  }

  // [todo] what about when re-building a worry card? This would not be in a
  // pile so the client might drop it mistakenly on a failed build. Use errors
  // again?
  export function build(foundation: Foundation, pile: Readonly<Card>[]): void {
    const top = pile[pile.length - 1]
    if (!top || !isBuildable(foundation, pile)) return
    pile.length--
    foundation[top.suit].push(top) // not encapsualted!
  }

  /** Test whether a pile's top card can be built on foundation pile. */
  export function isBuildable(
    foundation: Foundation,
    pile: readonly Readonly<Card>[]
  ): boolean {
    const top = pile[pile.length - 1]
    if (!top || top.direction === 'down') return false

    // Only aces are permitted as the base card.
    if (!foundation[top.suit].length && top.rank === 'ace') return true

    const base = foundation[top.suit][foundation[top.suit].length - 1]
    return !!base && succeeds(top, base)
  }

  /** Test whether the foundation is complete. */
  export function isBuilt(
    ...foundations: readonly (readonly Readonly<Card>[])[]
  ): boolean {
    return foundations.every(foundation => isPillarBuilt(foundation))
  }

  /**
   * Remove the top card for insertion back into a tableau. If the card is not
   * worried, it should be rebuilt.
   */
  export function worry(pillar: Readonly<Card>[]): Card | undefined {
    return pillar.pop()
  }

  /**
   * Tests whether left directly succeeds right. True when colors match and the
   * rank is the next lesser adjacent.
   */
  function succeeds(left: Readonly<Card>, right: Readonly<Card>): boolean {
    return (
      Suit.toColor[left.suit] === Suit.toColor[right.suit] &&
      Rank.toOrder[left.rank] === Rank.toOrder[right.rank] + 1
    )
  }

  function isPillarBuilt(foundation: readonly Readonly<Card>[]): boolean {
    return foundation[foundation.length - 1]?.rank === 'king'
  }
}
