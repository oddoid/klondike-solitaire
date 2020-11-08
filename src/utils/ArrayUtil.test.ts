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

// function factorial(n: number, memo: Record<number, number> = {0: 1}): number {
//   memo[n] ??= n * factorial(n - 1)
//   return memo[n]!
// }

// function permuteWithRepetitions<T>(items: T[]): T[][] {
//   // In a binary number, each digit has one of two values: 0 or 1. The total
//   // number of permutations is the number of digits to the number of values
//   // power. In a byte, that's 2^8. In this case, each item is a "digit" and we
//   // know that to get every permutation, it needs to be the same length as the
//   // number of possible values for each digit.
//   const permutations: T[][] = Array(items.length ** items.length)
//   for (let i = 0; i < permutations.length; i++) {
//     const permutation: T[] = Array(items.length)
//     for (let place = 0, val = i; place < items.length; place++) {
//       const digit = items[val % items.length]
//       if (digit) permutation[place] = digit
//       // Right shift by one by dividing by the radix. For example, in a base-two system the radix is two. items.length is the number of number of possible values in a single digit.
//       val = ~~(val / items.length)
//     }
//     permutations[i] = permutation
//   }
//   return permutations
// }
