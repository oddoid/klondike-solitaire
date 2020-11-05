import {Card} from '../card/Card'
import {Foundation} from './Foundation'

test.each([
  ['empty', '', '🃑', '🃑'],
  ['nonempty', '🃑', '🃒', '🃑🃒'],
  ['almost built', '🃑🃒🃓🃔🃕🃖🃗🃘🃙🃚🃛🃝', '🃞', '🃑🃒🃓🃔🃕🃖🃗🃘🃙🃚🃛🃝🃞']
])('build buildable %s', (_, foundationStr, cardStr, expected) => {
  const foundation = Foundation.make()
  foundation.clubs.push(
    ...[...foundationStr].map(card => Card.fromString(card))
  )
  const card = Card.fromString(cardStr)
  expect(Foundation.isBuildable(foundation, card)).toStrictEqual(true)
  Foundation.build(foundation, card)
  expect(foundation).toStrictEqual({
    clubs: [...expected].map(card => Card.fromString(card)),
    diamonds: [],
    hearts: [],
    spades: []
  })
})

test.each([
  ['empty and non-ace', '', '🃒'],
  ['nonempty and non-matching suit', '🃑', '🃂'],
  ['nonempty and non-sequential rank', '🃑', '🃓'],
  ['built', '🃑🃒🃓🃔🃕🃖🃗🃘🃙🃚🃛🃝🃞', '🃑']
])('build non-buildable %s', (_, foundationStr, cardStr) => {
  const foundation = Foundation.make()
  foundation.clubs.push(
    ...[...foundationStr].map(card => Card.fromString(card))
  )
  const card = Card.fromString(cardStr)
  expect(Foundation.isBuildable(foundation, card)).toStrictEqual(false)
  expect(() => Foundation.build(foundation, card)).toThrowError()
})

test('build card down', () => {
  const foundation = Foundation.make()
  foundation.clubs.push(...[...'🃑🃒🃓'].map(card => Card.fromString(card)))
  const card = Card.fromString('🃔', 'down')
  expect(Foundation.isBuildable(foundation, card)).toStrictEqual(false)
  expect(() => Foundation.build(foundation, card)).toThrowError()
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
