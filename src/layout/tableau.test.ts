import {
  cardFromString,
  cardFromStringCode,
  cardIsDirected,
  cardToString,
  newDeck,
  Tableau,
  tableauBuild,
  tableauDeal,
  tableauIsBuildable,
} from '@/solitaire'
import { assertEquals } from 'std/testing/asserts.ts'

Deno.test('tableau', () => {
  const stock = newDeck()
  const tableau = Tableau(7)
  tableauDeal(tableau, stock)
  assertEquals(
    cardToString('Undirected', ...stock),
    '🃑🃒🃓🃔🃕🃖🃗🃘🃙🃚🃛🃝🃞' + '🃁🃂🃃🃄🃅🃆🃇🃈🃉🃊🃋',
  )
  assertEquals(tableau.map((pile) => cardToString('Undirected', ...pile)), [
    '🂮',
    '🂫🂭',
    '🂨🂩🂪',
    '🂤🂥🂦🂧',
    '🂽🂾🂡🂢🂣',
    '🂶🂷🂸🂹🂺🂻',
    '🃍🃎🂱🂲🂳🂴🂵',
  ])
  assertEquals(
    tableau.every((pile) => cardIsDirected('Down', ...pile)),
    true,
  )
})

Deno.test('Tableau from insufficient stock.', () => {
  const stock = cardFromString('🂺🂻🂽🂾🂡🂢🂣🂤🂥🂦🂧🂨🂩🂪🂫🂭🂮')
  const tableau = Tableau(7)
  tableauDeal(tableau, stock)
  assertEquals(stock, [])
  assertEquals(tableau.map((pile) => cardToString('Directed', ...pile)), [
    '🂠',
    '🂠🂠',
    '🂠🂠🂠',
    '🂠🂠🂠🂠',
    '🂠🂠🂠🂠🂠',
    '🂠🂠',
    '',
  ])
})

for (
  const [name, pileStr, cardStr, expected] of [
    ['empty', '', '🃞', '🃞'],
    ['nonempty', '🃚', '🃉', '🃚🃉'],
    ['almost built', '🃞🃍🃛🃊🃙🃈🃗🃆🃕🃄🃓🃂', '🃑', '🃞🃍🃛🃊🃙🃈🃗🃆🃕🃄🃓🃂🃑'],
  ] as const
) {
  Deno.test(`build buildable ${name}`, () => {
    const pile = cardFromString(pileStr, 'Down')
    if (pile.length > 0) pile.at(-1)!.direction = 'Up'
    const cards = cardFromString(cardStr)
    assertEquals(tableauIsBuildable(pile, cards), true)
    tableauBuild(pile, cards)
    assertEquals(
      pile,
      [...expected].map((card, i, array) =>
        cardFromStringCode(card, i >= array.length - 2 ? 'Up' : 'Down')
      ),
    )
  })
}

for (
  const [name, pileStr, cardStr] of [
    ['empty and non-king', '', '🃒'],
    ['nonempty and matching suit', '🃒', '🃑'],
    ['nonempty and matching color', '🃒', '🂡'],
    ['nonempty and non-sequential rank', '🃓', '🃁'],
    ['built', '🃞🃍🃛🃊🃙🃈🃗🃆🃕🃄🃓🃂🃑', '🃑'],
  ] as const
) {
  Deno.test(`build non-buildable ${name}`, () => {
    const pile = cardFromString(pileStr, 'Down')
    if (pile.length > 0) pile.at(-1)!.direction = 'Up'
    const cards = cardFromString(cardStr)
    assertEquals(tableauIsBuildable(pile, cards), false)
    tableauBuild(pile, cards)
    assertEquals(cards.length, 1)
  })
}

Deno.test('build card Down', () => {
  const pile = cardFromString('🃞🃍🃛')
  const cards = cardFromString('🃊', 'Down')
  assertEquals(tableauIsBuildable(pile, cards), false)
  tableauBuild(pile, cards)
  assertEquals(cards.length, 1)
})

Deno.test('build pile Down', () => {
  const pile = cardFromString('🃞🃍🃛', 'Down')
  const cards = cardFromString('🃊')
  assertEquals(tableauIsBuildable(pile, cards), false)
  tableauBuild(pile, cards)
  assertEquals(cards.length, 1)
})
