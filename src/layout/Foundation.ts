import {Card} from '../card/Card'
import {Rank} from '../card/Rank'
import {Suit} from '../card/Suit'

/**
 * One pile per suit. The number of piles are fixed and distinct. Each pile is
 * initially empty and building them is the objective. Consecutive ranks are
 * built in ascending order from ace to king within a suit, squared, and
 * face-up. By convention, the top of a pile is the last index.
 *
 * This data can also be modeled as a `readonly Card[][]` but doing so would
 * allow the suit pile positions to change within the array.
 */
export type Foundation = Readonly<Record<Suit, Card[]>>

export namespace Foundation {
  /** Create a set of foundation piles. */
  export function make(): Foundation {
    return Suit.values.reduce(
      (foundation, suit) => ({...foundation, [suit]: []}),
      <Foundation>{}
    )
  }

  /**
   * Add a card to a foundation pile. Invoke `isBuildable()` first to verify
   * the card is buildable.
   *
   * An error is thrown if the card cannot be built to force the client to
   * handle when a card cannot be built. If the unbuildable scenario were
   * unhandled, the card might be dropped.
   */
  // expose pile, not foundation, for collided thingy
  export function tryBuild(foundation: Foundation, card: Readonly<Card>): void {
    if (!isBuildable(foundation, card))
      throw new Error(
        `${Card.toString(true, card)} cannot be built on foundation.`
      )
    foundation[card.suit].push(card)
  }

  /** Test whether a pile's top card can be built on foundation pile. */
  export function isBuildable(
    foundation: Foundation,
    card: Readonly<Card>
  ): boolean {
    if (card.direction === 'down') return false

    // Only aces are permitted as the base card.
    if (!foundation[card.suit].length && card.rank === 'ace') return true

    const pile = foundation[card.suit]
    const top = pile[pile.length - 1]
    return !!top && succeeds(card, top)
  }

  /** Test whether the foundation is complete. */
  export function isBuilt(foundation: Foundation): boolean {
    return isPileBuilt(...Object.values(foundation))
  }

  /** Test whether one or more piles are complete. */
  export function isPileBuilt(
    ...piles: readonly (readonly Readonly<Card>[])[]
  ): boolean {
    return piles.every(pile => pile[pile.length - 1]?.rank === 'king')
  }

  /**
   * Remove the top card for insertion back into a tableau. If the card is not
   * worried, it should be rebuilt.
   */
  export function worry(pile: Readonly<Card>[]): Card | undefined {
    return pile.pop()
  }

  /**
   * Tests whether left directly succeeds right. True when colors match and the
   * rank is the next greater adjacent.
   */
  function succeeds(left: Readonly<Card>, right: Readonly<Card>): boolean {
    return (
      Suit.toColor[left.suit] === Suit.toColor[right.suit] &&
      Rank.toOrder[left.rank] === Rank.toOrder[right.rank] + 1
    )
  }
}
