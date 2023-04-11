import {
  Card,
  cardFromString,
  cardFromStringCode,
  cardIsDirected,
  cardSucceeds,
  cardToString,
  newDeck,
  rankToOrder,
} from '@/solitaire'
import { assertEquals, assertThrows } from 'std/testing/asserts.ts'

for (
  const [name, cards, down, up] of [
    ['one up', [cardFromStringCode('🃑')], false, true],
    ['one down', [cardFromStringCode('🃑', 'Down')], true, false],
    [
      'mix',
      [cardFromStringCode('🃑', 'Down'), cardFromStringCode('🃑', 'Up')],
      false,
      false,
    ],
  ] as const
) {
  Deno.test(
    `isDirected: ${name}.`,
    () => {
      assertEquals(cardIsDirected('Down', ...cards), down)
      assertEquals(cardIsDirected('Up', ...cards), up)
    },
  )
}

for (
  const [name, pileStr, expected] of [
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
    ['non-succession of five at index 3', '🃑🃒🃓🃕🃔', false],
  ] as const
) {
  Deno.test(
    `Succeeds: ${name}.`,
    () =>
      assertEquals(
        cardSucceeds(
          (lhs, rhs) => {
            if (lhs == null) return false
            if (rhs == null) return true
            return rankToOrder[lhs.rank] + 1 === rankToOrder[rhs.rank]
          },
          ...cardFromString(pileStr),
        ),
        expected,
      ),
  )
}

for (const card of newDeck('Up')) {
  Deno.test(
    `From string: ${cardToString('Directed', card)}.`,
    () =>
      assertEquals(
        cardFromStringCode(cardToString('Directed', card)),
        card,
      ),
  )
}

Deno.test('From string: unknown.', () => {
  assertThrows(() => cardFromStringCode('A'))
})

Deno.test('From string: empty.', () => {
  assertThrows(() => cardFromStringCode(''))
})

Deno.test('From string: down.', () =>
  assertEquals(cardFromStringCode('🃑', 'Down'), {
    suit: 'Clubs',
    rank: 'Ace',
    direction: 'Down',
  }))

Deno.test('From string: up.', () =>
  assertEquals(cardFromStringCode('🃑', 'Up'), {
    suit: 'Clubs',
    rank: 'Ace',
    direction: 'Up',
  }))

Deno.test('Succeeds: empty.', () => {
  let args: (Card | undefined)[]
  cardSucceeds((lhs, rhs) => {
    args = [lhs, rhs]
    return false
  })
  assertEquals(args!, [undefined, undefined])
})

Deno.test('Succeeds: singular.', () => {
  const cards = cardFromString('🃑')
  let args: (Card | undefined)[]
  cardSucceeds((lhs, rhs) => {
    args = [lhs, rhs]
    return false
  }, ...cards)
  assertEquals(args!, [cards[0], undefined])
})

Deno.test('Succeeds: two.', () => {
  const cards = cardFromString('🃑🃒')
  let args: (Card | undefined)[]
  cardSucceeds((lhs, rhs) => {
    args = [lhs, rhs]
    return false
  }, ...cards)
  assertEquals(args!, cards)
})

Deno.test('Succeeds: three.', () => {
  const cards = cardFromString('🃑🃒🃓')
  const args: (Card | undefined)[][] = []
  cardSucceeds((lhs, rhs) => {
    args.push([lhs, rhs])
    return true
  }, ...cards)
  assertEquals(args, [[cards[0], cards[1]], [cards[1], cards[2]], [
    cards[2],
    undefined,
  ]])
})

for (
  const [name, directed, cards, expected] of [
    [
      'deck undirected',
      'Undirected',
      newDeck(),
      '🃑🃒🃓🃔🃕🃖🃗🃘🃙🃚🃛🃝🃞🃁🃂🃃🃄🃅🃆🃇🃈🃉🃊🃋🃍🃎🂱🂲🂳🂴🂵🂶🂷🂸🂹🂺🂻🂽🂾🂡🂢🂣🂤🂥🂦🂧🂨🂩🂪🂫🂭🂮',
    ],
    [
      'hand of four up',
      'Directed',
      [
        { direction: 'Up', rank: 'Ace', suit: 'Clubs' },
        { direction: 'Up', rank: 'Two', suit: 'Diamonds' },
        { direction: 'Up', rank: 'Three', suit: 'Hearts' },
        { direction: 'Up', rank: 'Four', suit: 'Spades' },
      ],
      '🃑🃂🂳🂤',
    ],
    [
      'hand of four down',
      'Directed',
      [
        { direction: 'Down', rank: 'Ace', suit: 'Clubs' },
        { direction: 'Down', rank: 'Two', suit: 'Diamonds' },
        { direction: 'Down', rank: 'Three', suit: 'Hearts' },
        { direction: 'Down', rank: 'Four', suit: 'Spades' },
      ],
      '🂠🂠🂠🂠',
    ],
    [
      'hand of four mixed',
      'Directed',
      [
        { direction: 'Down', rank: 'Ace', suit: 'Clubs' },
        { direction: 'Up', rank: 'Two', suit: 'Diamonds' },
        { direction: 'Down', rank: 'Three', suit: 'Hearts' },
        { direction: 'Up', rank: 'Four', suit: 'Spades' },
      ],
      '🂠🃂🂠🂤',
    ],
  ] as const
) {
  Deno.test(
    `To string: ${name}.`,
    () => assertEquals(cardToString(directed, ...cards), expected),
  )
}
