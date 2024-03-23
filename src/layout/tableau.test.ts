import {expect, test} from 'vitest'
import {
  cardFromString,
  cardFromStringCode,
  cardIsDirected,
  cardToString
} from '../card/card.js'
import {newDeck} from '../utils/card-pile.js'
import {
  Tableau,
  tableauBuild,
  tableauDeal,
  tableauIsBuildable
} from './tableau.js'

test('tableau', () => {
  const stock = newDeck()
  const tableau = Tableau(7)
  tableauDeal(tableau, stock)
  expect(cardToString('Undirected', ...stock)).toBe(
    '🃑🃒🃓🃔🃕🃖🃗🃘🃙🃚🃛🃝🃞' + '🃁🃂🃃🃄🃅🃆🃇🃈🃉🃊🃋'
  )
  expect(
    tableau.map(pile => cardToString('Undirected', ...pile))
  ).toStrictEqual(['🂮', '🂫🂭', '🂨🂩🂪', '🂤🂥🂦🂧', '🂽🂾🂡🂢🂣', '🂶🂷🂸🂹🂺🂻', '🃍🃎🂱🂲🂳🂴🂵'])
  expect(tableau.every(pile => cardIsDirected('Down', ...pile))).toBe(true)
})

test('Tableau from insufficient stock.', () => {
  const stock = cardFromString('🂺🂻🂽🂾🂡🂢🂣🂤🂥🂦🂧🂨🂩🂪🂫🂭🂮')
  const tableau = Tableau(7)
  tableauDeal(tableau, stock)
  expect(stock).toStrictEqual([])
  expect(tableau.map(pile => cardToString('Directed', ...pile))).toStrictEqual([
    '🂠',
    '🂠🂠',
    '🂠🂠🂠',
    '🂠🂠🂠🂠',
    '🂠🂠🂠🂠🂠',
    '🂠🂠',
    ''
  ])
})

for (const [name, pileStr, cardStr, expected] of <const>[
  ['empty', '', '🃞', '🃞'],
  ['nonempty', '🃚', '🃉', '🃚🃉'],
  ['almost built', '🃞🃍🃛🃊🃙🃈🃗🃆🃕🃄🃓🃂', '🃑', '🃞🃍🃛🃊🃙🃈🃗🃆🃕🃄🃓🃂🃑']
]) {
  test(`build buildable ${name}`, () => {
    const pile = cardFromString(pileStr, 'Down')
    if (pile.length > 0) pile.at(-1)!.direction = 'Up'
    const cards = cardFromString(cardStr)
    expect(tableauIsBuildable(pile, cards)).toBe(true)
    tableauBuild(pile, cards)
    expect(pile).toStrictEqual(
      [...expected].map((card, i, array) =>
        cardFromStringCode(card, i >= array.length - 2 ? 'Up' : 'Down')
      )
    )
  })
}

for (const [name, pileStr, cardStr] of <const>[
  ['empty and non-king', '', '🃒'],
  ['nonempty and matching suit', '🃒', '🃑'],
  ['nonempty and matching color', '🃒', '🂡'],
  ['nonempty and non-sequential rank', '🃓', '🃁'],
  ['built', '🃞🃍🃛🃊🃙🃈🃗🃆🃕🃄🃓🃂🃑', '🃑']
]) {
  test(`build non-buildable ${name}`, () => {
    const pile = cardFromString(pileStr, 'Down')
    if (pile.length > 0) pile.at(-1)!.direction = 'Up'
    const cards = cardFromString(cardStr)
    expect(tableauIsBuildable(pile, cards)).toBe(false)
    tableauBuild(pile, cards)
    expect(cards.length).toBe(1)
  })
}

test('build card Down', () => {
  const pile = cardFromString('🃞🃍🃛')
  const cards = cardFromString('🃊', 'Down')
  expect(tableauIsBuildable(pile, cards)).toBe(false)
  tableauBuild(pile, cards)
  expect(cards.length).toBe(1)
})

test('build pile Down', () => {
  const pile = cardFromString('🃞🃍🃛', 'Down')
  const cards = cardFromString('🃊')
  expect(tableauIsBuildable(pile, cards)).toBe(false)
  tableauBuild(pile, cards)
  expect(cards.length).toBe(1)
})
