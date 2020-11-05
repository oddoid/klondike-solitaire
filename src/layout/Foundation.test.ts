import {Card} from '../card/Card'
import {Foundation} from './Foundation'

test.each([
  ['empty', '', '🃑', '🃑'],
  ['nonempty', '🃑', '🃒', '🃑🃒'],
  ['almost built', '🃑🃒🃓🃔🃕🃖🃗🃘🃙🃚🃛🃝', '🃞', '🃑🃒🃓🃔🃕🃖🃗🃘🃙🃚🃛🃝🃞']
])('build buildable %s', (_, foundationStr, pileStr, expected) => {
  const foundation = Foundation.make()
  foundation.clubs.push(
    ...[...foundationStr].map(card => Card.fromString(card))
  )
  const pile = [...pileStr].map(card => Card.fromString(card))
  expect(Foundation.isBuildable(foundation, pile)).toStrictEqual(true)
  Foundation.build(foundation, pile)
  expect(foundation).toStrictEqual({
    clubs: [...expected].map(card => Card.fromString(card)),
    diamonds: [],
    hearts: [],
    spades: []
  })
})

test.each([
  ['empty and non-ace', '', '🃒', ''],
  ['nonempty and non-matching suit', '🃑', '🃂', '🃑'],
  ['nonempty and non-sequential rank', '🃑', '🃓', '🃑'],
  ['built', '🃑🃒🃓🃔🃕🃖🃗🃘🃙🃚🃛🃝🃞', '🃑', '🃑🃒🃓🃔🃕🃖🃗🃘🃙🃚🃛🃝🃞']
])('build non-buildable %s', (_, foundationStr, pileStr, expected) => {
  const foundation = Foundation.make()
  foundation.clubs.push(
    ...[...foundationStr].map(card => Card.fromString(card))
  )
  const pile = [...pileStr].map(card => Card.fromString(card))
  expect(Foundation.isBuildable(foundation, pile)).toStrictEqual(false)
  Foundation.build(foundation, pile)
  expect(foundation).toStrictEqual({
    clubs: [...expected].map(card => Card.fromString(card)),
    diamonds: [],
    hearts: [],
    spades: []
  })
})

test('build card down', () => {
  const foundation = Foundation.make()
  foundation.clubs.push(...[...'🃑🃒🃓'].map(card => Card.fromString(card)))
  const pile = [Card.fromString('🃔', 'down')]
  expect(Foundation.isBuildable(foundation, pile)).toStrictEqual(false)
  Foundation.build(foundation, pile)
  expect(foundation.clubs).toStrictEqual(
    [...'🃑🃒🃓'].map(card => Card.fromString(card))
  )
})

test.each([
  ['empty', '', false],
  ['singular', '🃑', false],
  ['not built', '🃑🃒🃓🃔🃕🃖🃗🃘🃙🃚🃛🃝', false],
  ['built', '🃑🃒🃓🃔🃕🃖🃗🃘🃙🃚🃛🃝🃞', true]
])('isBuilt %s', (_, foundation, built) =>
  expect(
    Foundation.isBuilt([...foundation].map(card => Card.fromString(card)))
  ).toStrictEqual(built)
)

test.each([
  ['empty', '', '', ''],
  ['singular', '🃑', '', '🃑'],
  ['multiple', '🃑🃒', '🃑', '🃒']
])('worry %s', (_, foundationStr, expectedFoundation, expectedCard) => {
  const foundation = [...foundationStr].map(card => Card.fromString(card))
  const top = Foundation.worry(foundation)
  expect(foundation).toStrictEqual(
    [...expectedFoundation].map(card => Card.fromString(card))
  )
  expect(top).toStrictEqual(
    expectedCard ? Card.fromString(expectedCard) : undefined
  )
})
