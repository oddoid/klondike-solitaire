import { assertEquals } from 'std/testing/asserts.ts'
import { Card, Pile, Tableau } from '@/solitaire'
import { Uint } from '@/ooz'

Deno.test('Tableau.', () => {
  const stock = Pile.newDeck()
  const tableau = Tableau(Uint(7))
  Tableau.deal(tableau, stock)
  assertEquals(
    Card.toString('Undirected', ...stock),
    '🃑🃒🃓🃔🃕🃖🃗🃘🃙🃚🃛🃝🃞' + '🃁🃂🃃🃄🃅🃆🃇🃈🃉🃊🃋',
  )
  assertEquals(tableau.map((pile) => Card.toString('Undirected', ...pile)), [
    '🂮',
    '🂫🂭',
    '🂨🂩🂪',
    '🂤🂥🂦🂧',
    '🂽🂾🂡🂢🂣',
    '🂶🂷🂸🂹🂺🂻',
    '🃍🃎🂱🂲🂳🂴🂵',
  ])
  assertEquals(
    tableau.every((pile) => Card.isDirected('Down', ...pile)),
    true,
  )
})

Deno.test('Tableau from insufficient stock.', () => {
  const stock = Card.fromString('🂺🂻🂽🂾🂡🂢🂣🂤🂥🂦🂧🂨🂩🂪🂫🂭🂮')
  const tableau = Tableau(Uint(7))
  Tableau.deal(tableau, stock)
  assertEquals(stock, [])
  assertEquals(tableau.map((pile) => Card.toString('Directed', ...pile)), [
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
    const pile = Card.fromString(pileStr, 'Down')
    if (pile.length > 0) pile.at(-1)!.direction = 'Up'
    const cards = Card.fromString(cardStr)
    assertEquals(Tableau.isBuildable(pile, cards), true)
    Tableau.build(pile, cards)
    assertEquals(
      pile,
      [...expected].map((card, i, array) =>
        Card.fromStringCode(card, i >= array.length - 2 ? 'Up' : 'Down')
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
    const pile = Card.fromString(pileStr, 'Down')
    if (pile.length > 0) pile.at(-1)!.direction = 'Up'
    const cards = Card.fromString(cardStr)
    assertEquals(Tableau.isBuildable(pile, cards), false)
    Tableau.build(pile, cards)
    assertEquals(cards.length, 1)
  })
}

Deno.test('build card Down', () => {
  const pile = Card.fromString('🃞🃍🃛')
  const cards = Card.fromString('🃊', 'Down')
  assertEquals(Tableau.isBuildable(pile, cards), false)
  Tableau.build(pile, cards)
  assertEquals(cards.length, 1)
})

Deno.test('build pile Down', () => {
  const pile = Card.fromString('🃞🃍🃛', 'Down')
  const cards = Card.fromString('🃊')
  assertEquals(Tableau.isBuildable(pile, cards), false)
  Tableau.build(pile, cards)
  assertEquals(cards.length, 1)
})
