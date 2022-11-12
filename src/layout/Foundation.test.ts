import { assertEquals } from 'std/testing/asserts.ts';
import { Card, Foundation } from '@/klondike-solitaire';

for (
  const [name, foundationStr, cardStr, expected] of [
    ['empty and ace', '', '🃑', '🃑'],
    ['nonempty', '🃑', '🃒', '🃑🃒'],
    ['almost built', '🃑🃒🃓🃔🃕🃖🃗🃘🃙🃚🃛🃝', '🃞', '🃑🃒🃓🃔🃕🃖🃗🃘🃙🃚🃛🃝🃞'],
  ] as const
) {
  Deno.test(`Build buildable: ${name}.`, () => {
    const foundation = Foundation();
    foundation[0].push(...Card.fromString(foundationStr));
    const cards = Card.fromString(cardStr);
    console.error(foundation, cards);
    assertEquals(Foundation.isBuildable(foundation, cards), true);
    Foundation.build(foundation, cards);
    assertEquals(cards.length, 0);
    assertEquals(foundation, [Card.fromString(expected), [], [], []]);
  });
}

for (
  const [name, foundationStr, cardStr] of [
    ['empty and non-ace', '', '🃒'],
    ['nonempty and non-matching suit', '🃑', '🂢'],
    ['nonempty and non-sequential rank', '🃑', '🃓'],
    ['built', '🃑🃒🃓🃔🃕🃖🃗🃘🃙🃚🃛🃝🃞', '🃑'],
  ] as const
) {
  Deno.test(`Forbid building: ${name}.`, () => {
    const foundation = Foundation();
    foundation[0].push(...Card.fromString(foundationStr));
    const cards = Card.fromString(cardStr);
    assertEquals(Foundation.isBuildable(foundation, cards), false);
    Foundation.build(foundation, cards);
    assertEquals(cards.length, 1);
  });
}

Deno.test('Build card down.', () => {
  const foundation = Foundation();
  foundation[0].push(...Card.fromString('🃑🃒🃓'));
  const cards = Card.fromString('🃔', 'Down');
  assertEquals(Foundation.isBuildable(foundation, cards), false);
  Foundation.build(foundation, cards);
  assertEquals(cards.length, 1);
});

for (
  const [name, foundation, built] of [
    ['empty', Foundation(), false],
    ['partly', {
      Clubs: Card.fromString('🃑'),
      Diamonds: Card.fromString('🃁'),
      Hearts: Card.fromString('🂱'),
      Spades: Card.fromString('🂡'),
    }, false],
    [
      'built',
      {
        Clubs: Card.fromString('🃑🃒🃓🃔🃕🃖🃗🃘🃙🃚🃛🃝🃞'),
        Diamonds: Card.fromString('🃁🃂🃃🃄🃅🃆🃇🃈🃉🃊🃋🃍🃎'),
        Hearts: Card.fromString('🂱🂲🂳🂴🂵🂶🂷🂸🂹🂺🂻🂽🂾'),
        Spades: Card.fromString('🂡🂢🂣🂤🂥🂦🂧🂨🂩🂪🂫🂭🂮'),
      },
      true,
    ],
  ] as const
) {
  Deno.test(
    `Is built: ${name}.`,
    () => assertEquals(Foundation.isBuilt(<Foundation> foundation), built),
  );
}

for (
  const [name, foundationStr, built] of [
    ['empty', '', false],
    ['singular', '🃑', false],
    ['not built', '🃑🃒🃓🃔🃕🃖🃗🃘🃙🃚🃛🃝', false],
    ['built', '🃑🃒🃓🃔🃕🃖🃗🃘🃙🃚🃛🃝🃞', true],
  ] as const
) {
  Deno.test(`Is pillar built: ${name}.`, () =>
    assertEquals(
      Foundation.isPillarBuilt(Card.fromString(foundationStr)),
      built,
    ));
}
