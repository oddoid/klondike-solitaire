import {ArrayUtil} from './ArrayUtil'

test('shuffle', () => {
  const iterations = 1_000_000
  const items = ['a', 'b', 'c', 'd', 'e']
  const permutations = permute(items).map(permutation => permutation.join(''))

  const distribution = new Map<string, number>()
  for (let i = 0; i < iterations; i++) {
    ArrayUtil.shuffle(items, Math.random)
    const permutation = items.join('')
    distribution.set(permutation, (distribution.get(permutation) ?? 0) + 1)
  }

  for (const permutation of permutations) {
    const occurrences = distribution.get(permutation) ?? 0
    const frequency = occurrences / iterations
    expect(frequency).toBeGreaterThan(1 / distribution.size - 0.001)
    expect(frequency).toBeLessThan(1 / distribution.size + 0.001)
  }
})

/** [Heap's_algorithm](https://en.wikipedia.org/wiki/Heap%27s_algorithm). */
function permute<T>(items: T[], n: number = items.length): T[][] {
  if (n === 1) return [[...items]]

  const permutations = []
  permutations.push(...permute(items, n - 1))

  for (let i = 0; i < n - 1; i++) {
    if (n % 2) ArrayUtil.swap(items, 0, n - 1)
    else ArrayUtil.swap(items, i, n - 1)
    permutations.push(...permute(items, n - 1))
  }

  return permutations
}
