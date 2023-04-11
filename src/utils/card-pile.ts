import {
  Card,
  CardDirection,
  cardToString,
  CardVisibility,
  ideographicSpace,
  RankSet,
  SuitSet,
} from '@/solitaire'

/** Generate a complete pack of 52 ordered cards. */
export function newDeck(direction: CardDirection = 'Down'): Card[] {
  const deck = []
  for (const suit of SuitSet) {
    for (const rank of RankSet) deck.push({ suit, rank, direction })
  }
  return deck
}

export function pileToString(
  piles: readonly Readonly<Card[]>[],
  visibility: CardVisibility = 'Directed',
): string {
  const height = piles.reduce((max, pile) => Math.max(max, pile.length), 0)
  let str = ''
  for (let y = 0; y < height; y++) {
    if (str !== '') str += '\n'
    for (let x = 0; x < piles.length; x++) {
      str += piles[x]![y] == null
        ? y === 0 ? '🃟' : ideographicSpace
        : cardToString(visibility, piles[x]![y]!)
    }
  }
  return str === '' ? '🃟'.repeat(piles.length) : str
}
