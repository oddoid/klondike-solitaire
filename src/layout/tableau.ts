import { assert, XY } from '@/ooz'
import {
  Card,
  CardsSelected,
  CardSucceeds,
  cardSucceeds,
  CardVisibility,
  pileToString,
  rankToOrder,
  suitToColor,
} from '@/solitaire'

/**
 * The playing field consists of a tableau of lanes that can be maneuvered to
 * expose cards for building out the foundations. The first lane has one card
 * and each subsequent lane has one card more than one prior. The top card of
 * each lane can be revealed and cascade downwards in descending order from king
 * to ace using cards from the reserve, waste, or other lanes. Sequences can be
 * moved other lanes or foundations. When all revealed cards are removed, the
 * topmost card can be revealed.
 *
 * The top of each lane is the last index.
 */
export type Tableau = readonly Card[][]

/**
 * Draw cards from the stock and create the specified number of lanes. Each lane
 * has one more card than the previous with the first lane having one card. If
 * insufficient stock, the later lanes my be incomplete. The number of cards
 * used is the lesser of `lanes * (lanes + 1) / 2` and `stock.length`.
 */
export function Tableau(lanes: number): Tableau {
  assert(lanes > 0, `Tableau size must be greater than zero but was ${lanes}.`)
  const tableau = []
  for (let i = 0; i < lanes; i++) tableau.push([])
  return tableau
}

/**
 * Tests whether right directly succeeds left. True when cards are face up
 * and:
 * - Only one card (left).
 * - No preceding card (left) and right is a king.
 * - Colors alternate and the rank is the next lesser adjacent.
 */
const succeeds: CardSucceeds = (lhs, rhs) => {
  if (lhs?.direction === 'Down' || rhs?.direction === 'Down') return false
  if (rhs == null) return lhs != null
  if (lhs == null) return rhs.rank === 'King'
  return (
    suitToColor[lhs.suit] !== suitToColor[rhs.suit] &&
    rankToOrder[lhs.rank] === rankToOrder[rhs.rank] + 1
  )
}

export function tableauDeal(self: Tableau, stock: Card[]): void {
  for (const [index, lane] of self.entries()) {
    assert(lane.length === 0, 'Tableau must be reset before dealt.')
    const cards = stock.splice(-index - 1)
    for (const card of cards) card.direction = 'Down'
    lane.push(...cards)
  }
}

/**
 * Use:
 * - Move cards from one tableau lane to another.
 * - Move cards from the reserve or wastepile to a tableau lane.
 * - Worry back a foundation card back to a tableau lane.
 *
 * Invoke `isBuildable()` first to verify the card is buildable. The cards
 * array is emptied if built.
 */
export function tableauBuild(
  lane: Readonly<Card>[],
  cards: Readonly<Card>[],
): void {
  if (!tableauIsBuildable(lane, cards)) return
  lane.push(...cards.splice(0))
}

export function tableauSelect(
  self: Readonly<Tableau>,
  card: Readonly<Card>,
): CardsSelected | undefined {
  for (const [x, lane] of self.entries()) {
    const y = lane.indexOf(card)
    if (y === -1) continue
    return { cards: lane.splice(y), pile: 'Tableau', xy: new XY(x, y) }
  }
}

/** Test whether a card can be built on tableau lane. */
export function tableauIsBuildable(
  lane: readonly Readonly<Card>[],
  cards: readonly Readonly<Card>[],
): boolean {
  if (!cardSucceeds(succeeds, ...cards)) return false
  return succeeds(lane.at(-1), cards[0])
}

export function tableauToString(
  self: Readonly<Tableau>,
  visibility: CardVisibility = 'Directed',
): string {
  return pileToString(self, visibility)
}
