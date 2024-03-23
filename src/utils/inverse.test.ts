import {expect, test} from 'vitest'
import {Inverse} from './inverse.js'

for (const [name, record, expected] of [
  ['empty', {}, {}],
  ['nonempty', {a: 1, b: 2, c: 3}, {1: 'a', 2: 'b', 3: 'c'}],
  [
    'inherited',
    Object.create(
      {a: 1, b: 2, c: 3},
      {
        d: {enumerable: true, value: 4}
      }
    ),
    {4: 'd'}
  ]
]) {
  test(`Inverse ${name}.`, () =>
    expect(Inverse(record)).toStrictEqual(expected))
}
