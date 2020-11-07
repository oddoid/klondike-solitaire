import {Card} from '../card/Card'
import {Deck} from './Deck'
import {Tableau} from './Tableau'

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
