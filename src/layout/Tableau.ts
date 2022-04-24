import {Card} from '../card/Card.js'
import {Rank} from '../card/Rank.js'
import {Suit} from '../card/Suit.js'

/**
 * The playing field consists of a tableau of piles that can be maneuvered to
 * expose cards for building out the foundations. The first pile has one card
 * and each subsequent pile has one card more than one prior. The top card of
 * each pile can be revealed and cascade downwards in descending order from king
 * to ace using cards from the hand or other piles. Sequences can be moved other
 * piles or foundations. When all revealed cards are removed, the topmost card
 * be revealed.
 */
export interface Tableau extends ReadonlyArray<Card[]> {}

export namespace Tableau {
  /**
   * Draw cards from the stock and create the specified number of piles. Each
   * pile has one more card than the previous with the first pile having one one
   * card. If insufficient stock, the later piles my be incomplete. The number
   * of cards used is the lesser of `piles * (piles + 1) / 2` and
   * `stock.length`.
   */
  export function make(stock: Card[]): Tableau {
    const tableau = []
    for (let i = 1; i <= 7; i++) {
      const pile = stock.splice(-i)
      for (const card of pile) card.direction = 'down'
      tableau.push(pile)
    }
    return tableau
  }

  /** Exposes the identity of the pile's top card. */
  export function revealTop(pile: readonly Card[]): void {
    const top = pile[pile.length - 1]
    if (top) top.direction = 'up'
  }

  // [todo] who coordinates the foundation and the pile? to make sure it can be accepted.
  export function play(pile: Readonly<Card>[]): Card | undefined {
    if (pile[pile.length - 1]?.direction === 'up') return pile.pop()
  }

  /**
   * One of two operations:
   * - Play: move a card from one tableau pile to another. Repeat operation for
   *   sequences.
   * - Worry back: move a foundation card back to a tableau pile.
   *
   * Invoke `isBuildable()` first to verify the card is buildable.
   *
   * An error is thrown if the card cannot be worried to force the client to
   * handle when a card cannot be built. If the unbuildable scenario were
   * unhandled, the card might be dropped.
   */
  export function tryBuild(pile: Readonly<Card>[], card: Card): void {
    if (!isBuildable(pile, card))
      throw new Error(`${Card.toString(true, card)} cannot be built on pile.`)
    pile.push(card)
  }

  /** Test whether a card can be built on tableau pile. */
  export function isBuildable(
    pile: readonly Readonly<Card>[],
    card: Readonly<Card>
  ): boolean {
    const top = pile[pile.length - 1]
    if (top?.direction === 'down' || card.direction === 'down') return false

    // Empty lanes accept only kings.
    if (!top && card.rank === 'king') return true

    return !!top && succeeds(card, top)
  }

  /**
   * Tests whether left directly succeeds right. True when colors alternate and
   * the rank is the next lesser adjacent.
   */
  function succeeds(left: Readonly<Card>, right: Readonly<Card>): boolean {
    return (
      Suit.toColor[left.suit] !== Suit.toColor[right.suit] &&
      Rank.toOrder[left.rank] + 1 === Rank.toOrder[right.rank]
    )
  }
}
