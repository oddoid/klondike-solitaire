import {Card} from '../card/Card.js'
import {Deck} from './Deck.js'
import {Tableau} from './Tableau.js'

test('make', () => {
  const stock = Deck.make()
  const tableau = Tableau.make(stock)
  expect(Card.toString(false, ...stock)).toStrictEqual(
    '🃑🃒🃓🃔🃕🃖🃗🃘🃙🃚🃛🃝🃞' + '🃁🃂🃃🃄🃅🃆🃇🃈🃉🃊🃋'
  )
  expect(
    tableau.every(pile => pile.every(card => card.direction === 'down'))
  ).toStrictEqual(true)
  expect(tableau.map(pile => Card.toString(false, ...pile))).toStrictEqual([
    '🂮',
    '🂫🂭',
    '🂨🂩🂪',
    '🂤🂥🂦🂧',
    '🂽🂾🂡🂢🂣',
    '🂶🂷🂸🂹🂺🂻',
    '🃍🃎🂱🂲🂳🂴🂵'
  ])
})

test('make from insufficient stock', () => {
  const stock = [...'🂺🂻🂽🂾🂡🂢🂣🂤🂥🂦🂧🂨🂩🂪🂫🂭🂮'].map(card =>
    Card.fromString(card, 'up')
  )
  const tableau = Tableau.make(stock)
  expect(stock).toStrictEqual([])
  expect(tableau.map(pile => Card.toString(true, ...pile))).toStrictEqual([
    '🂠',
    '🂠🂠',
    '🂠🂠🂠',
    '🂠🂠🂠🂠',
    '🂠🂠🂠🂠🂠',
    '🂠🂠',
    ''
  ])
})

test.each(<const>[
  ['empty', [], []],
  [
    'singular',
    [{suit: 'clubs', rank: 'ace', direction: 'down'}],
    [{suit: 'clubs', rank: 'ace', direction: 'up'}]
  ],
  [
    'multiple',
    [
      {suit: 'clubs', rank: 'ace', direction: 'down'},
      {suit: 'clubs', rank: 'two', direction: 'down'}
    ],
    [
      {suit: 'clubs', rank: 'ace', direction: 'down'},
      {suit: 'clubs', rank: 'two', direction: 'up'}
    ]
  ]
])('revealTop %s', (_, pile, expected) => {
  Tableau.revealTop(pile)
  expect(pile).toStrictEqual(expected)
})

test.each([
  ['empty', [], [], undefined],
  [
    'nonempty',
    <Card[]>[{suit: 'clubs', rank: 'ace', direction: 'up'}],
    [],
    {suit: 'clubs', rank: 'ace', direction: 'up'}
  ],
  [
    'down',
    <Card[]>[{suit: 'clubs', rank: 'ace', direction: 'down'}],
    [{suit: 'clubs', rank: 'ace', direction: 'down'}],
    undefined
  ]
])('play %s', (_, pile, expectedPile, expectedCard) => {
  expect(Tableau.play(pile)).toStrictEqual(expectedCard)
  expect(pile).toStrictEqual(expectedPile)
})

test.each([
  ['empty', '', '🃞', '🃞'],
  ['nonempty', '🃚', '🃉', '🃚🃉'],
  ['almost built', '🃞🃍🃛🃊🃙🃈🃗🃆🃕🃄🃓🃂', '🃑', '🃞🃍🃛🃊🃙🃈🃗🃆🃕🃄🃓🃂🃑']
])('build buildable %s', (_, pileStr, cardStr, expected) => {
  const pile = [...pileStr].map(card => Card.fromString(card, 'down'))
  if (pile.length) pile[pile.length - 1]!.direction = 'up'
  const card = Card.fromString(cardStr)
  expect(Tableau.isBuildable(pile, card)).toStrictEqual(true)
  Tableau.tryBuild(pile, card)
  expect(pile).toStrictEqual(
    [...expected].map((card, i, array) =>
      Card.fromString(card, i >= array.length - 2 ? 'up' : 'down')
    )
  )
})

test.each([
  ['empty and non-king', '', '🃒'],
  ['nonempty and matching suit', '🃒', '🃑'],
  ['nonempty and matching color', '🃒', '🂡'],
  ['nonempty and non-sequential rank', '🃓', '🃁'],
  ['built', '🃞🃍🃛🃊🃙🃈🃗🃆🃕🃄🃓🃂🃑', '🃑']
])('build non-buildable %s', (_, pileStr, cardStr) => {
  const pile = [...pileStr].map(card => Card.fromString(card, 'down'))
  if (pile.length) pile[pile.length - 1]!.direction = 'up'
  const card = Card.fromString(cardStr)
  expect(Tableau.isBuildable(pile, card)).toStrictEqual(false)
  expect(() => Tableau.tryBuild(pile, card)).toThrow()
})

test('build card down', () => {
  const pile = [...'🃞🃍🃛'].map(card => Card.fromString(card))
  const card = Card.fromString('🃊', 'down')
  expect(Tableau.isBuildable(pile, card)).toStrictEqual(false)
  expect(() => Tableau.tryBuild(pile, card)).toThrow()
})

test('build pile down', () => {
  const pile = [...'🃞🃍🃛'].map(card => Card.fromString(card, 'down'))
  const card = Card.fromString('🃊')
  expect(Tableau.isBuildable(pile, card)).toStrictEqual(false)
  expect(() => Tableau.tryBuild(pile, card)).toThrow()
})
