import {
  cardFromString,
  Foundation,
  foundationBuild,
  foundationIsBuildable,
  foundationIsBuilt,
  foundationIsPillarBuilt,
} from '@/solitaire'
import { assertEquals } from 'std/testing/asserts.ts'

for (
  const [name, foundationStr, cardStr, expected] of [
    ['empty and ace', '', '🃑', '🃑'],
    ['nonempty', '🃑', '🃒', '🃑🃒'],
    ['almost built', '🃑🃒🃓🃔🃕🃖🃗🃘🃙🃚🃛🃝', '🃞', '🃑🃒🃓🃔🃕🃖🃗🃘🃙🃚🃛🃝🃞'],
  ] as const
) {
  Deno.test(`Build buildable: ${name}.`, () => {
    const foundation = Foundation()
    foundation[0].push(...cardFromString(foundationStr))
    const cards = cardFromString(cardStr)
    assertEquals(foundationIsBuildable(foundation, cards), true)
    foundationBuild(foundation, cards)
    assertEquals(cards.length, 0)
    assertEquals(foundation, [cardFromString(expected), [], [], []])
  })
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
    const foundation = Foundation()
    foundation[0].push(...cardFromString(foundationStr))
    const cards = cardFromString(cardStr)
    assertEquals(foundationIsBuildable(foundation, cards), false)
    foundationBuild(foundation, cards)
    assertEquals(cards.length, 1)
  })
}

Deno.test('Build card down.', () => {
  const foundation = Foundation()
  foundation[0].push(...cardFromString('🃑🃒🃓'))
  const cards = cardFromString('🃔', 'Down')
  assertEquals(foundationIsBuildable(foundation, cards), false)
  foundationBuild(foundation, cards)
  assertEquals(cards.length, 1)
})

for (
  const [name, foundation, built] of [
    ['empty', Foundation(), false],
    ['partly', {
      Clubs: cardFromString('🃑'),
      Diamonds: cardFromString('🃁'),
      Hearts: cardFromString('🂱'),
      Spades: cardFromString('🂡'),
    }, false],
    [
      'built',
      {
        Clubs: cardFromString('🃑🃒🃓🃔🃕🃖🃗🃘🃙🃚🃛🃝🃞'),
        Diamonds: cardFromString('🃁🃂🃃🃄🃅🃆🃇🃈🃉🃊🃋🃍🃎'),
        Hearts: cardFromString('🂱🂲🂳🂴🂵🂶🂷🂸🂹🂺🂻🂽🂾'),
        Spades: cardFromString('🂡🂢🂣🂤🂥🂦🂧🂨🂩🂪🂫🂭🂮'),
      },
      true,
    ],
  ] as const
) {
  Deno.test(
    `Is built: ${name}.`,
    () => assertEquals(foundationIsBuilt(<Foundation> foundation), built),
  )
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
      foundationIsPillarBuilt(cardFromString(foundationStr)),
      built,
    ))
}
