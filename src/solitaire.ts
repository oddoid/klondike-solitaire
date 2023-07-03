import { CardVisibility } from './card/card-visibility.ts'
import { Card, cardToString } from './card/card.ts'
import { CardsSelected } from './layout/cards-selected.ts'
import {
  Foundation,
  foundationBuild,
  foundationIsBuildable,
  foundationIsBuilt,
  foundationSelect,
  foundationToString,
} from './layout/foundation.ts'
import {
  Tableau,
  tableauBuild,
  tableauDeal,
  tableauIsBuildable,
  tableauSelect,
  tableauToString,
} from './layout/tableau.ts'
import { newDeck } from './utils/card-pile.ts'

export type Solitaire = {
  /**
   * The integral number of cards drawn from the stock into the waste at a
   * time. Equivalent to the reserve.
   */
  readonly drawSize: number
  readonly foundation: Foundation
  /** Squared face-down deck. The top is the last index. */
  readonly stock: Card[]
  selected?: CardsSelected
  readonly tableau: Tableau
  /**
   * Cards are discarded to the waste squared, face-up. Only the top card, if
   * present, is playable but up to draw size (reserve) are visible. The top is
   * the last index.
   */
  readonly waste: Card[]
  /**
   * Random number generator used for shuffling. Eg, Math.random(). Values
   * generated should have a normal distribution in the domain [0, 1).
   */
  random(): number
  /** The number of lanes in the tableau. */
  tableauSize: number
  wins: number
}

export function Solitaire(
  random?: () => number,
  wins?: number,
  drawSize?: number,
  tableauSize?: number,
): Solitaire {
  drawSize ??= 3
  random ??= Math.random
  tableauSize ??= 7
  const stock = newDeck()
  shuffle(stock, random)
  const self = {
    drawSize,
    foundation: Foundation(),
    stock,
    tableau: Tableau(tableauSize),
    waste: [],
    random,
    tableauSize,
    wins: wins ?? 0,
  }
  tableauDeal(self.tableau, stock)
  return self
}

/** Set game to initial state except wins. */
export function solitaireReset(self: Solitaire): void {
  if (solitaireIsWon(self)) self.wins++
  for (const pillar of self.foundation) self.stock.push(...pillar.splice(0))
  for (const lane of self.tableau) self.stock.push(...lane.splice(0))
  self.stock.push(...self.waste.splice(0))
  for (const card of self.stock) card.direction = 'Down'
  shuffle(self.stock, self.random)
  tableauDeal(self.tableau, self.stock)
}

/**
 * Performs a logical operation on the card at:
 * - Stock: if the top of the pile, draw a new hand to the reserve.
 * - Foundation and tableau: if the top card is pointed at and face-down, flip
 *   it. Otherwise, select all cards from card to the top.
 */
export function solitairePoint(
  self: Solitaire,
  card: Card,
): CardsSelected | undefined {
  solitaireDeselect(self)

  const stockY = self.stock.indexOf(card)
  if (stockY !== -1) {
    if (stockY !== self.stock.length - 1) return
    const y = Math.max(0, stockY - (self.drawSize - 1))
    const cards = self.stock.splice(y).reverse()
    for (const card of cards) card.direction = 'Up'
    self.waste.push(...cards)
    return
  }

  const wasteY = self.waste.indexOf(card)
  if (wasteY !== -1) {
    self.selected = {
      cards: self.waste.splice(wasteY),
      pile: 'Waste',
      xy: { x: 0, y: wasteY },
    }
    return self.selected
  }

  const selected = foundationSelect(self.foundation, card) ??
    tableauSelect(self.tableau, card)
  if (selected == null) {
    throw Error(`missing card ${cardToString('Undirected', card)}`)
  }
  self.selected = selected
  // Assign to selected as the above operation is a mutation that must be
  // completed or deselected.
  const { cards } = self.selected
  if (cards.length === 1 && cards[0]?.direction === 'Down') {
    cards[0].direction = 'Up'
    solitaireDeselect(self)
    // self.selected is now cleared.
  }
  // Facedown cards cannot be moved.
  // if (cards[0]?.direction === 'Down') deselect(self);
  return self.selected
}

/** Return the waste to the stock. Resets the reserve size. */
export function solitaireDeal(self: Solitaire): void {
  solitaireDeselect(self)
  if (self.stock.length > 0) return
  const waste = self.waste.splice(0).reverse()
  for (const card of waste) card.direction = 'Down'
  self.stock.push(...waste)
}

export function solitaireIsBuildable(
  self: Readonly<Solitaire>,
  at: { type: 'Foundation' } | { type: 'Tableau'; x: number },
): boolean {
  if (self.selected == null) return false
  if (at.type === 'Foundation') {
    return foundationIsBuildable(
      self.foundation,
      self.selected.cards,
    )
  }
  const lane = self.tableau[at.x]
  if (lane == null) throw Error(`missing lane at index ${at.x}`)
  return tableauIsBuildable(lane, self.selected.cards)
}

export function solitaireIsWon(self: Readonly<Solitaire>): boolean {
  return foundationIsBuilt(self.foundation)
}

export function solitaireToString(
  self: Readonly<Solitaire>,
  visibility: CardVisibility = 'Directed',
): string {
  const foundations = foundationToString(self.foundation, visibility)
  const tableau = tableauToString(self.tableau, visibility)
  const stock = cardToString(visibility, ...self.stock)
  const reserve = padCharEnd(
    cardToString('Directed', ...self.waste.slice(-self.drawSize)),
    1,
    '🃟',
  )
  const unreservedWaste = self.waste.slice(0, -self.drawSize)
  const waste = padCharEnd(
    visibility === 'Directed'
      ? '🂠'.repeat(unreservedWaste.length)
      : cardToString(visibility, ...unreservedWaste),
    1,
    '🃟',
  )
  const selected = self.selected == null
    ? ''
    : (cardToString(visibility, ...self.selected.cards) +
      ` from ${self.selected.pile} (${self.selected.xy.x}, ${self.selected.xy.y})`)
  return `
${foundations}
${tableau}
${stock} ${reserve} ${waste}
${selected}
    `.trim()
}

export function solitaireBuild(
  self: Solitaire,
  at: { type: 'Foundation' } | { type: 'Tableau'; x: number },
): void {
  if (self.selected == null) return
  if (at.type === 'Foundation') {
    foundationBuild(self.foundation, self.selected.cards)
  } else {
    const lane = self.tableau[at.x]
    if (lane == null) throw Error(`missing lane at index ${at.x}`)
    tableauBuild(lane, self.selected.cards)
  }
  if (self.selected.cards.length !== 0) return
  delete self.selected
}

export function solitaireDeselect(self: Solitaire): void {
  if (self.selected == null) return
  const pile = self.selected.pile === 'Waste'
    ? self.waste
    : self[uncapitalize(self.selected.pile)][self.selected.xy.x]!
  pile.push(...self.selected.cards)
  delete self.selected
}

function padCharEnd(str: string, width: number, char: string): string {
  return str + char.repeat(Math.max(0, width - str.length))
}

/**
 * Shuffle items in place.
 * https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
 * https://blog.codinghorror.com/the-danger-of-naivete/
 * @internal
 */
export function shuffle(self: unknown[], random: () => number): void {
  for (let i = self.length - 1; i >= 0; i--) {
    swapIndices(self, i, Math.trunc(random() * (i + 1)))
  }
}

/**
 * Swap left and right values in place.
 * @internal
 */
export function swapIndices(
  self: unknown[],
  left: number,
  right: number,
): void {
  // deno-fmt-ignore
  [self[left], self[right]] = [self[right], self[left]]
}

/** @internal */
export function uncapitalize<const T extends string>(str: T): Uncapitalize<T> {
  if (str[0] == null) return str as Uncapitalize<T>
  return `${str[0].toLocaleLowerCase()}${str.slice(1)}` as Uncapitalize<T>
}
