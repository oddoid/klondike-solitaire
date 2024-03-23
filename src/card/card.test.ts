import {expect, test} from 'vitest'
import {newDeck} from '../utils/card-pile.js'
import {
  Card,
  cardFromString,
  cardFromStringCode,
  cardIsDirected,
  cardSucceeds,
  cardToString
} from './card.js'
import {rankToOrder} from './rank.js'

for (const [name, cards, down, up] of <const>[
  ['one up', [cardFromStringCode('🃑')], false, true],
  ['one down', [cardFromStringCode('🃑', 'Down')], true, false],
  [
    'mix',
    [cardFromStringCode('🃑', 'Down'), cardFromStringCode('🃑', 'Up')],
    false,
    false
  ]
]) {
  test(`isDirected: ${name}.`, () => {
    expect(cardIsDirected('Down', ...cards)).toBe(down)
    expect(cardIsDirected('Up', ...cards)).toBe(up)
  })
}

for (const [name, pileStr, expected] of <const>[
  ['empty', '', false],
  ['singular', '🃑', true],
  ['succession of two', '🃑🃒', true],
  ['succession of three', '🃑🃒🃓', true],
  ['succession of four', '🃑🃒🃓🃔', true],
  ['succession of five', '🃑🃒🃓🃔🃕', true],
  ['non-succession of two at last index', '🃑🃕', false],
  ['non-succession of three at last index', '🃑🃒🃕', false],
  ['non-succession of four at last index', '🃑🃒🃓🃕', false],
  ['non-succession of five at index 0', '🃕🃑🃒🃓🃔', false],
  ['non-succession of five at index 1', '🃑🃕🃒🃓🃔', false],
  ['non-succession of five at index 2', '🃑🃒🃕🃓🃔', false],
  ['non-succession of five at index 3', '🃑🃒🃓🃕🃔', false]
]) {
  test(`Succeeds: ${name}.`, () =>
    expect(
      cardSucceeds(
        (lhs, rhs) => {
          if (lhs == null) return false
          if (rhs == null) return true
          return rankToOrder[lhs.rank] + 1 === rankToOrder[rhs.rank]
        },
        ...cardFromString(pileStr)
      )
    ).toBe(expected))
}

for (const card of newDeck('Up')) {
  test(`From string: ${cardToString('Directed', card)}.`, () =>
    expect(cardFromStringCode(cardToString('Directed', card))).toStrictEqual(
      card
    ))
}

test('From string: unknown.', () => {
  expect(() => cardFromStringCode('A')).toThrow()
})

test('From string: empty.', () => {
  expect(() => cardFromStringCode('')).toThrow()
})

test('From string: down.', () =>
  expect(cardFromStringCode('🃑', 'Down')).toStrictEqual({
    suit: 'Clubs',
    rank: 'Ace',
    direction: 'Down'
  }))

test('From string: up.', () =>
  expect(cardFromStringCode('🃑', 'Up')).toStrictEqual({
    suit: 'Clubs',
    rank: 'Ace',
    direction: 'Up'
  }))

test('Succeeds: empty.', () => {
  let args: (Card | undefined)[]
  cardSucceeds((lhs, rhs) => {
    args = [lhs, rhs]
    return false
  })
  expect(args!).toStrictEqual([undefined, undefined])
})

test('Succeeds: singular.', () => {
  const cards = cardFromString('🃑')
  let args: (Card | undefined)[]
  cardSucceeds(
    (lhs, rhs) => {
      args = [lhs, rhs]
      return false
    },
    ...cards
  )
  expect(args!).toStrictEqual([cards[0], undefined])
})

test('Succeeds: two.', () => {
  const cards = cardFromString('🃑🃒')
  let args: (Card | undefined)[]
  cardSucceeds(
    (lhs, rhs) => {
      args = [lhs, rhs]
      return false
    },
    ...cards
  )
  expect(args!).toStrictEqual(cards)
})

test('Succeeds: three.', () => {
  const cards = cardFromString('🃑🃒🃓')
  const args: (Card | undefined)[][] = []
  cardSucceeds(
    (lhs, rhs) => {
      args.push([lhs, rhs])
      return true
    },
    ...cards
  )
  expect(args).toStrictEqual([
    [cards[0], cards[1]],
    [cards[1], cards[2]],
    [cards[2], undefined]
  ])
})

for (const [name, directed, cards, expected] of <const>[
  [
    'deck undirected',
    'Undirected',
    newDeck(),
    '🃑🃒🃓🃔🃕🃖🃗🃘🃙🃚🃛🃝🃞🃁🃂🃃🃄🃅🃆🃇🃈🃉🃊🃋🃍🃎🂱🂲🂳🂴🂵🂶🂷🂸🂹🂺🂻🂽🂾🂡🂢🂣🂤🂥🂦🂧🂨🂩🂪🂫🂭🂮'
  ],
  [
    'hand of four up',
    'Directed',
    [
      {direction: 'Up', rank: 'Ace', suit: 'Clubs'},
      {direction: 'Up', rank: 'Two', suit: 'Diamonds'},
      {direction: 'Up', rank: 'Three', suit: 'Hearts'},
      {direction: 'Up', rank: 'Four', suit: 'Spades'}
    ],
    '🃑🃂🂳🂤'
  ],
  [
    'hand of four down',
    'Directed',
    [
      {direction: 'Down', rank: 'Ace', suit: 'Clubs'},
      {direction: 'Down', rank: 'Two', suit: 'Diamonds'},
      {direction: 'Down', rank: 'Three', suit: 'Hearts'},
      {direction: 'Down', rank: 'Four', suit: 'Spades'}
    ],
    '🂠🂠🂠🂠'
  ],
  [
    'hand of four mixed',
    'Directed',
    [
      {direction: 'Down', rank: 'Ace', suit: 'Clubs'},
      {direction: 'Up', rank: 'Two', suit: 'Diamonds'},
      {direction: 'Down', rank: 'Three', suit: 'Hearts'},
      {direction: 'Up', rank: 'Four', suit: 'Spades'}
    ],
    '🂠🃂🂠🂤'
  ]
]) {
  test(`To string: ${name}.`, () =>
    expect(cardToString(directed, ...cards)).toBe(expected))
}
