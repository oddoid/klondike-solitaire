import {ArrayUtil} from './ArrayUtil'

test('shuffle', () => {
  const iterations = 1_000_000
  const array = ['a', 'b', 'c', 'd', 'e']
  const permutations = permute(array).map(permutation => permutation.join(''))

  const distribution: Record<string, number> = {}
  for (let i = 0; i < iterations; i++) {
    ArrayUtil.shuffle(array, Math.random)
    const permutation = array.join('')
    distribution[permutation] = (distribution[permutation] ?? 0) + 1
  }

  for (const permutation of permutations) {
    const occurrences = distribution[permutation] ?? 0
    const frequency = occurrences / iterations
    expect(frequency).toBeGreaterThan(1 / permutations.length - 0.001)
    expect(frequency).toBeLessThan(1 / permutations.length + 0.001)
  }
})

/** [Heap's_algorithm](https://en.wikipedia.org/wiki/Heap%27s_algorithm). */
function permute<T>(array: T[], n: number = array.length): T[][] {
  if (n === 1) return [[...array]]

  const permutations = []
  permutations.push(...permute(array, n - 1))

  for (let i = 0; i < n - 1; i++) {
    if (n % 2) ArrayUtil.swap(array, 0, n - 1)
    else ArrayUtil.swap(array, i, n - 1)
    permutations.push(...permute(array, n - 1))
  }

  return permutations
}
