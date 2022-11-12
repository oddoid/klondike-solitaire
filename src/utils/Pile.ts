import {
  Card,
  Direction,
  Rank,
  Suit,
  Unicode,
  Visibility,
} from '@/klondike-solitaire';

export namespace Pile {
  /** Generate a complete pack of 52 ordered cards. */
  export function newDeck(direction: Direction = 'Down'): Card[] {
    const deck = [];
    for (const suit of Suit.values) {
      for (const rank of Rank.values) deck.push({ suit, rank, direction });
    }
    return deck;
  }

  export function toString(
    piles: readonly Readonly<Card[]>[],
    visibility: Visibility = 'Directed',
  ): string {
    const height = piles.reduce((max, pile) => Math.max(max, pile.length), 0);
    let str = '';
    for (let y = 0; y < height; y++) {
      if (str != '') str += '\n';
      for (let x = 0; x < piles.length; x++) {
        str += piles[x]![y] == null
          ? y == 0 ? '🃟' : Unicode.ideographicSpace
          : Card.toString(visibility, piles[x]![y]!);
      }
    }
    return str == '' ? '🃟'.repeat(piles.length) : str;
  }
}
