import { ArrayUtil, I32, NonNull, Random, Str, Uint, UintXY } from '@/oidlib';
import {
  Card,
  Foundation,
  Pile,
  Selection,
  Tableau,
  Visibility,
} from '@/solitaire';

export interface Solitaire {
  /**
   * The integral number of cards drawn from the stock into the waste at a
   * time. Equivalent to the reserve.
   */
  readonly drawSize: Uint;
  readonly foundation: Foundation;
  /** Squared face-down deck. The top is the last index. */
  readonly stock: Card[];
  selected?: Selection;
  readonly tableau: Tableau;
  /**
   * Cards are discarded to the waste squared, face-up. Only the top card, if
   * present, is playable but up to draw size (reserve) are visible. The top is
   * the last index.
   */
  readonly waste: Card[];
  /**
   * Random number generator used for shuffling. Eg, Math.random(). Values
   * generated should have a normal distribution in the domain [0, 1).
   */
  random(): number;
  /** The number of lanes in the tableau. */
  tableauSize: Uint;
  wins: Uint;
}

export function Solitaire(
  drawSize?: Uint,
  random?: () => number,
  wins?: Uint,
  tableauSize?: Uint,
): Solitaire {
  drawSize ??= Uint(3);
  if (random == null) {
    const rnd = new Random(I32.mod(Date.now()));
    random = () => rnd.fraction;
  }
  tableauSize ??= Uint(7);
  const stock = Pile.newDeck();
  ArrayUtil.shuffle(stock, random);
  const self = {
    drawSize,
    foundation: Foundation(),
    stock,
    tableau: Tableau(tableauSize),
    waste: [],
    random,
    tableauSize,
    wins: wins ?? Uint(0),
  };
  Tableau.deal(self.tableau, stock);
  return self;
}

export namespace Solitaire {
  /** Set game to initial state except wins. */
  export function reset(self: Solitaire): void {
    if (isWon(self)) self.wins = Uint(self.wins + 1);
    for (const pillar of self.foundation) self.stock.push(...pillar.splice(0));
    for (const lane of self.tableau) self.stock.push(...lane.splice(0));
    self.stock.push(...self.waste.splice(0));
    for (const card of self.stock) card.direction = 'Down';
    ArrayUtil.shuffle(self.stock, self.random);
    Tableau.deal(self.tableau, self.stock);
  }

  /**
   * Performs a logical operation on the card at:
   * - Stock: if the top of the pile, draw a new hand to the reserve.
   * - Foundation and tableau: if the top card is pointed at and face-down, flip
   *   it. Otherwise, select all cards from card to the top.
   */
  export function point(self: Solitaire, card: Card): Selection | undefined {
    deselect(self);

    const stockY = self.stock.indexOf(card);
    if (stockY != -1) {
      if (stockY != self.stock.length - 1) return;
      const y = Math.max(0, stockY - (self.drawSize - 1));
      const cards = self.stock.splice(y).reverse();
      for (const card of cards) card.direction = 'Up';
      self.waste.push(...cards);
      return;
    }

    const wasteY = self.waste.indexOf(card);
    if (wasteY != -1) {
      self.selected = {
        cards: self.waste.splice(wasteY),
        pile: 'Waste',
        xy: new UintXY(0, wasteY),
      };
      return self.selected;
    }

    self.selected = NonNull(
      Foundation.select(self.foundation, card) ??
        Tableau.select(self.tableau, card),
      `Missing card ${Card.toString('Undirected', card)}.`,
    );
    // Assign to selected as the above operation is a mutation that must be
    // completed or deselected.
    const { cards } = self.selected;
    if (cards.length == 1 && cards[0]?.direction == 'Down') {
      cards[0].direction = 'Up';
      deselect(self);
      // self.selected is now cleared.
    }
    // Facedown cards cannot be moved.
    // if (cards[0]?.direction == 'Down') deselect(self);
    return self.selected;
  }

  /** Return the waste to the stock. Resets the reserve size. */
  export function deal(self: Solitaire): void {
    deselect(self);
    if (self.stock.length > 0) return;
    const waste = self.waste.splice(0).reverse();
    for (const card of waste) card.direction = 'Down';
    self.stock.push(...waste);
  }

  export function isBuildable(
    self: Readonly<Solitaire>,
    at: { type: 'Foundation' } | { type: 'Tableau'; x: Uint },
  ): boolean {
    if (self.selected == null) return false;
    if (at.type == 'Foundation') {
      return Foundation.isBuildable(self.foundation, self.selected.cards);
    }
    return Tableau.isBuildable(
      NonNull(self.tableau[at.x]),
      self.selected.cards,
    );
  }

  export function isWon(self: Readonly<Solitaire>): boolean {
    return Foundation.isBuilt(self.foundation);
  }

  export function toString(
    self: Readonly<Solitaire>,
    visibility: Visibility = 'Directed',
  ): string {
    const foundations = Foundation.toString(self.foundation, visibility);
    const tableau = Tableau.toString(self.tableau, visibility);
    const stock = Card.toString(visibility, ...self.stock);
    const reserve = padCharEnd(
      Card.toString('Directed', ...self.waste.slice(-self.drawSize)),
      Uint(1),
      '🃟',
    );
    const unreservedWaste = self.waste.slice(0, -self.drawSize);
    const waste = padCharEnd(
      visibility == 'Directed'
        ? '🂠'.repeat(unreservedWaste.length)
        : Card.toString(visibility, ...unreservedWaste),
      Uint(1),
      '🃟',
    );
    const selected = self.selected == null
      ? ''
      : (Card.toString(visibility, ...self.selected.cards) +
        ` from ${self.selected.pile} ${self.selected.xy.toString()}`);
    return `
${foundations}
${tableau}
${stock} ${reserve} ${waste}
${selected}
    `.trim();
  }

  export function build(
    self: Solitaire,
    at: { type: 'Foundation' } | { type: 'Tableau'; x: Uint },
  ): void {
    if (self.selected == null) return;
    if (at.type == 'Foundation') {
      Foundation.build(self.foundation, self.selected.cards);
    } else Tableau.build(NonNull(self.tableau[at.x]), self.selected.cards);
    if (self.selected.cards.length != 0) return;
    delete self.selected;
  }

  export function deselect(self: Solitaire): void {
    if (self.selected == null) return;
    const pile = self.selected.pile == 'Waste'
      ? self.waste
      : self[Str.uncapitalize(self.selected.pile)][self.selected.xy.x]!;
    pile.push(...self.selected.cards);
    delete self.selected;
  }
}

function padCharEnd(str: string, width: Uint, char: string): string {
  return str + char.repeat(Math.max(0, width - str.length));
}
