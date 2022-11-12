import { assertEquals, assertThrows } from 'std/testing/asserts.ts';
import { Card, Pile, Rank } from '@/solitaire';
import { Opt } from '@/oidlib';

for (
  const [name, cards, down, up] of [
    ['one up', [Card.fromStringCode('🃑')], false, true],
    ['one down', [Card.fromStringCode('🃑', 'Down')], true, false],
    [
      'mix',
      [Card.fromStringCode('🃑', 'Down'), Card.fromStringCode('🃑', 'Up')],
      false,
      false,
    ],
  ] as const
) {
  Deno.test(
    `isDirected: ${name}.`,
    () => {
      assertEquals(Card.isDirected('Down', ...cards), down);
      assertEquals(Card.isDirected('Up', ...cards), up);
    },
  );
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
        Card.succeeds(
          (lhs, rhs) => {
            if (lhs == null) return false;
            if (rhs == null) return true;
            return Rank.toOrder[lhs.rank] + 1 == Rank.toOrder[rhs.rank];
          },
          ...Card.fromString(pileStr),
        ),
        expected,
      ),
  );
}

for (const card of Pile.newDeck('Up')) {
  Deno.test(
    `From string: ${Card.toString('Directed', card)}.`,
    () =>
      assertEquals(
        Card.fromStringCode(Card.toString('Directed', card)),
        card,
      ),
  );
}

Deno.test('From string: unknown.', () => {
  assertThrows(() => Card.fromStringCode('A'));
});

Deno.test('From string: empty.', () => {
  assertThrows(() => Card.fromStringCode(''));
});

Deno.test('From string: down.', () =>
  assertEquals(Card.fromStringCode('🃑', 'Down'), {
    suit: 'Clubs',
    rank: 'Ace',
    direction: 'Down',
  }));

Deno.test('From string: up.', () =>
  assertEquals(Card.fromStringCode('🃑', 'Up'), {
    suit: 'Clubs',
    rank: 'Ace',
    direction: 'Up',
  }));

Deno.test('Succeeds: empty.', () => {
  let args: Opt<Card>[];
  Card.succeeds((lhs, rhs) => {
    args = [lhs, rhs];
    return false;
  });
  assertEquals(args!, [undefined, undefined]);
});

Deno.test('Succeeds: singular.', () => {
  const cards = Card.fromString('🃑');
  let args: Opt<Card>[];
  Card.succeeds((lhs, rhs) => {
    args = [lhs, rhs];
    return false;
  }, ...cards);
  assertEquals(args!, [cards[0], undefined]);
});

Deno.test('Succeeds: two.', () => {
  const cards = Card.fromString('🃑🃒');
  let args: Opt<Card>[];
  Card.succeeds((lhs, rhs) => {
    args = [lhs, rhs];
    return false;
  }, ...cards);
  assertEquals(args!, cards);
});

Deno.test('Succeeds: three.', () => {
  const cards = Card.fromString('🃑🃒🃓');
  const args: Opt<Card>[][] = [];
  Card.succeeds((lhs, rhs) => {
    args.push([lhs, rhs]);
    return true;
  }, ...cards);
  assertEquals(args, [[cards[0], cards[1]], [cards[1], cards[2]], [
    cards[2],
    undefined,
  ]]);
});

for (
  const [name, directed, cards, expected] of [
    [
      'deck undirected',
      'Undirected',
      Pile.newDeck(),
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
    () => assertEquals(Card.toString(directed, ...cards), expected),
  );
}
