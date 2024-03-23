import {expect, test} from 'vitest'
import {cardFromString} from '../card/card.js'
import {
  Foundation,
  foundationBuild,
  foundationIsBuildable,
  foundationIsBuilt,
  foundationIsPillarBuilt
} from './foundation.js'

for (const [name, foundationStr, cardStr, expected] of <const>[
  ['empty and ace', '', '🃑', '🃑'],
  ['nonempty', '🃑', '🃒', '🃑🃒'],
  ['almost built', '🃑🃒🃓🃔🃕🃖🃗🃘🃙🃚🃛🃝', '🃞', '🃑🃒🃓🃔🃕🃖🃗🃘🃙🃚🃛🃝🃞']
]) {
  test(`Build buildable: ${name}.`, () => {
    const foundation = Foundation()
    foundation[0].push(...cardFromString(foundationStr))
    const cards = cardFromString(cardStr)
    expect(foundationIsBuildable(foundation, cards)).toBe(true)
    foundationBuild(foundation, cards)
    expect(cards.length).toBe(0)
    expect(foundation).toStrictEqual([cardFromString(expected), [], [], []])
  })
}

for (const [name, foundationStr, cardStr] of <const>[
  ['empty and non-ace', '', '🃒'],
  ['nonempty and non-matching suit', '🃑', '🂢'],
  ['nonempty and non-sequential rank', '🃑', '🃓'],
  ['built', '🃑🃒🃓🃔🃕🃖🃗🃘🃙🃚🃛🃝🃞', '🃑']
]) {
  test(`Forbid building: ${name}.`, () => {
    const foundation = Foundation()
    foundation[0].push(...cardFromString(foundationStr))
    const cards = cardFromString(cardStr)
    expect(foundationIsBuildable(foundation, cards)).toBe(false)
    foundationBuild(foundation, cards)
    expect(cards.length).toBe(1)
  })
}

test('Build card down.', () => {
  const foundation = Foundation()
  foundation[0].push(...cardFromString('🃑🃒🃓'))
  const cards = cardFromString('🃔', 'Down')
  expect(foundationIsBuildable(foundation, cards)).toBe(false)
  foundationBuild(foundation, cards)
  expect(cards.length).toBe(1)
})

for (const [name, foundation, built] of <const>[
  ['empty', Foundation(), false],
  [
    'partly',
    {
      Clubs: cardFromString('🃑'),
      Diamonds: cardFromString('🃁'),
      Hearts: cardFromString('🂱'),
      Spades: cardFromString('🂡')
    },
    false
  ],
  [
    'built',
    {
      Clubs: cardFromString('🃑🃒🃓🃔🃕🃖🃗🃘🃙🃚🃛🃝🃞'),
      Diamonds: cardFromString('🃁🃂🃃🃄🃅🃆🃇🃈🃉🃊🃋🃍🃎'),
      Hearts: cardFromString('🂱🂲🂳🂴🂵🂶🂷🂸🂹🂺🂻🂽🂾'),
      Spades: cardFromString('🂡🂢🂣🂤🂥🂦🂧🂨🂩🂪🂫🂭🂮')
    },
    true
  ]
]) {
  test(`Is built: ${name}.`, () =>
    expect(foundationIsBuilt(<Foundation>foundation)).toBe(built))
}

for (const [name, foundationStr, built] of <const>[
  ['empty', '', false],
  ['singular', '🃑', false],
  ['not built', '🃑🃒🃓🃔🃕🃖🃗🃘🃙🃚🃛🃝', false],
  ['built', '🃑🃒🃓🃔🃕🃖🃗🃘🃙🃚🃛🃝🃞', true]
]) {
  test(`Is pillar built: ${name}.`, () =>
    expect(foundationIsPillarBuilt(cardFromString(foundationStr))).toBe(built))
}
