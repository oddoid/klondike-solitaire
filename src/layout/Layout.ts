import {ArrayUtil} from '../utils/ArrayUtil'
import {Card} from '../card/Card'
import {Deck} from './Deck'
import {Foundation} from './Foundation'
import {Tableau} from './Tableau'

export type Layout = {
  /** Squared deck. end is top. */
  readonly stock: Card[]
  /**
   * Cards are discarded to the waste squared, face-up. Only the top card is
   * playable. By convention, the end is the top.
   */
  readonly waste: Card[]
  /**
   * The number of cards drawn from the stock into the hand at a time.  By
   * convention, the end is the top.
   */
  readonly drawSize: number
  /**
   * The number of times the stock has been dealt from one to `dealLimit`. The
   * initial deal is included.
   */
  deals: number
  /** The maximum number of times the stock can be been dealt. */
  readonly dealLimit: number
  readonly foundation: Foundation
  readonly tableau: Tableau
}

export namespace Layout {
  export function make(random: () => number): Layout {
    const stock = Deck.make()
    ArrayUtil.shuffle(stock, random)
    const drawSize = 3
    return {
      stock,
      waste: [],
      drawSize,
      deals: 1,
      dealLimit: drawSize,
      foundation: Foundation.make(),
      tableau: Tableau.make(stock)
    }
  }

  /**
   * Draw cards from the stock, flip them, and place them in the discard pile.
   */
  export function draw(layout: Layout): void {
    const hand = layout.stock.splice(0, layout.drawSize)
    for (const card of hand) card.direction = 'up'
    layout.waste.push(...hand)
  }

  export function deal(layout: Layout): void {
    if (layout.deals >= layout.dealLimit) return
    layout.deals++
    const waste = layout.waste.splice(0).reverse()
    for (const card of waste) card.direction = 'down'
    layout.stock.push(...waste)
  }

  export function isWon(layout: Layout): boolean {
    return Foundation.isBuilt(layout.foundation)
  }
}
