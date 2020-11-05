import {Card} from './Card'
import {Deck} from '../layout/Deck'

test.each(<const>[
  [
    'deck undirected',
    false,
    Deck.make(),
    '🃑🃒🃓🃔🃕🃖🃗🃘🃙🃚🃛🃝🃞' + '🃁🃂🃃🃄🃅🃆🃇🃈🃉🃊🃋🃍🃎' + '🂱🂲🂳🂴🂵🂶🂷🂸🂹🂺🂻🂽🂾' + '🂡🂢🂣🂤🂥🂦🂧🂨🂩🂪🂫🂭🂮'
  ],
  [
    'hand of four up',
    true,
    [
      {suit: 'clubs', rank: 'ace', direction: 'up'},
      {suit: 'diamonds', rank: 'two', direction: 'up'},
      {suit: 'hearts', rank: 'three', direction: 'up'},
      {suit: 'spades', rank: 'four', direction: 'up'}
    ],
    '🃑🃂🂳🂤'
  ],
  [
    'hand of four down',
    true,
    [
      {suit: 'clubs', rank: 'ace', direction: 'down'},
      {suit: 'diamonds', rank: 'two', direction: 'down'},
      {suit: 'hearts', rank: 'three', direction: 'down'},
      {suit: 'spades', rank: 'four', direction: 'down'}
    ],
    '🂠🂠🂠🂠'
  ],
  [
    'hand of four mixed',
    true,
    [
      {suit: 'clubs', rank: 'ace', direction: 'down'},
      {suit: 'diamonds', rank: 'two', direction: 'up'},
      {suit: 'hearts', rank: 'three', direction: 'down'},
      {suit: 'spades', rank: 'four', direction: 'up'}
    ],
    '🂠🃂🂠🂤'
  ]
])('toString %s', (_, directed, cards, expected) =>
  expect(Card.toString(directed, ...cards)).toStrictEqual(expected)
)

test.each(Deck.make('up'))('fromString %p', card =>
  expect(Card.fromString(Card.toString(true, card))).toStrictEqual(card)
)

test('fromString unknown', () =>
  expect(() => Card.fromString('A')).toThrowError())

test('fromString down', () =>
  expect(Card.fromString('🃑', 'down')).toStrictEqual({
    suit: 'clubs',
    rank: 'ace',
    direction: 'down'
  }))

test('fromString up', () =>
  expect(Card.fromString('🃑', 'up')).toStrictEqual({
    suit: 'clubs',
    rank: 'ace',
    direction: 'up'
  }))
