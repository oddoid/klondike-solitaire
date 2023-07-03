import { assertAlmostEquals, assertEquals } from 'std/testing/asserts.ts'
import { assertSnapshot } from 'std/testing/snapshot.ts'
import { cardToString } from './card/card.ts'
import { foundationToString } from './layout/foundation.ts'
import {
  shuffle,
  Solitaire,
  solitaireBuild,
  solitaireDeal,
  solitairePoint,
  solitaireToString,
  swapIndices,
  uncapitalize,
} from './solitaire.ts'

Deno.test('Deal', async (test) => {
  let solitaire: Solitaire

  await test.step(
    'Set the game.',
    async (test) => {
      solitaire = Solitaire(() => 1 - Number.EPSILON)
      await assertSnapshot(test, solitaireToString(solitaire), { dir: '.' })
    },
  )

  await test.step('The foundation piles are empty.', (test) => {
    assertEquals(cardToString('Directed', ...solitaire.foundation[0]), '')
    assertEquals(cardToString('Directed', ...solitaire.foundation[1]), '')
    assertEquals(cardToString('Directed', ...solitaire.foundation[2]), '')
    assertEquals(cardToString('Directed', ...solitaire.foundation[3]), '')
    assertSnapshot(test, foundationToString(solitaire.foundation, 'Directed'), {
      dir: '.',
    })
  })

  await test.step('The waste is empty.', () => {
    assertEquals(solitaire.waste.length, 0)
  })

  await test.step(
    'Deal.',
    async (test) => {
      solitaireDeal(solitaire)
      await assertSnapshot(test, solitaireToString(solitaire, 'Undirected'), {
        dir: '.',
      })
    },
  )

  await test.step('The stock is dealt into the tableau.', () => {
    assertEquals(
      cardToString('Directed', ...solitaire.stock),
      // 🃑🃒🃓🃔🃕🃖🃗🃘🃙🃚🃛🃝🃞   🃁🃂🃃🃄🃅🃆🃇🃈🃉🃊🃋
      '🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠' + '🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠',
    )
    assertEquals(
      solitaire.tableau.map((pile) => cardToString('Directed', ...pile)),
      [
        '🂠', //       🂮
        '🂠🂠', //      🂫🂭
        '🂠🂠🂠', //     🂨🂩🂪
        '🂠🂠🂠🂠', //    🂤🂥🂦🂧
        '🂠🂠🂠🂠🂠', //   🂽🂾🂡🂢🂣
        '🂠🂠🂠🂠🂠🂠', //  🂶🂷🂸🂹🂺🂻
        '🂠🂠🂠🂠🂠🂠🂠', // 🃍🃎🂱🂲🂳🂴🂵
      ],
    )
  })

  await test.step(
    'Draw all.',
    async (test) => {
      while (solitaire.stock.length > 0) {
        solitairePoint(solitaire, solitaire.stock.at(-1)!)
        await assertSnapshot(test, solitaireToString(solitaire), { dir: '.' })
      }
    },
  )

  await test.step(
    'Redeal.',
    async (test) => {
      solitaireDeal(solitaire)
      await assertSnapshot(test, solitaireToString(solitaire, 'Undirected'), {
        dir: '.',
      })
    },
  )

  await test.step(
    'Draw all.',
    async (test) => {
      while (solitaire.stock.length > 0) {
        solitairePoint(solitaire, solitaire.stock.at(-1)!)
        await assertSnapshot(test, solitaireToString(solitaire), { dir: '.' })
      }
    },
  )
})

Deno.test('Playthrough', async (test) => {
  let solitaire!: Solitaire
  await test.step(
    'Set the game.',
    async (test) => {
      solitaire = Solitaire(() => 1 - Number.EPSILON, 0, 3, 7)
      solitaireDeal(solitaire)
      await assertSnapshot(test, solitaireToString(solitaire), { dir: '.' })
    },
  )

  for (const [index, column] of solitaire.tableau.entries()) {
    await test.step(
      `Reveal tableau pile ${index}.`,
      async (test) => {
        solitairePoint(solitaire, column.at(-1)!)
        await assertSnapshot(test, solitaireToString(solitaire), { dir: '.' })
      },
    )
  }

  await test.step(
    'Take the ten of spades from tableau 2, top.',
    async (test) => {
      solitairePoint(solitaire, solitaire.tableau[2]!.at(-1)!)
      await assertSnapshot(test, solitaireToString(solitaire), { dir: '.' })
    },
  )

  await test.step(
    'Put onto the jack of hearts at tableau 5.',
    async (test) => {
      solitaireBuild(solitaire, { type: 'Tableau', x: 5 })
      await assertSnapshot(test, solitaireToString(solitaire), { dir: '.' })
    },
  )

  await test.step(
    'Take the the jack of hearts at tableau 5, top.',
    async (test) => {
      solitairePoint(solitaire, solitaire.tableau[5]!.at(-2)!)
      await assertSnapshot(test, solitaireToString(solitaire), { dir: '.' })
    },
  )

  await test.step(
    'Put onto the queen of spades at tableau 1.',
    async (test) => {
      solitaireBuild(solitaire, { type: 'Tableau', x: 1 })
      await assertSnapshot(test, solitaireToString(solitaire), { dir: '.' })
    },
  )

  await test.step(
    'Reveal tableau pile 2.',
    async (test) => {
      solitairePoint(solitaire, solitaire.tableau[2]!.at(-1)!)
      await assertSnapshot(test, solitaireToString(solitaire), { dir: '.' })
    },
  )

  await test.step(
    'Reveal tableau pile 5.',
    async (test) => {
      solitairePoint(solitaire, solitaire.tableau[5]!.at(-1)!)
      await assertSnapshot(test, solitaireToString(solitaire), { dir: '.' })
    },
  )

  await test.step(
    'Take the the nine of spades at tableau 2, top.',
    async (test) => {
      solitairePoint(solitaire, solitaire.tableau[2]!.at(-1)!)
      await assertSnapshot(test, solitaireToString(solitaire), { dir: '.' })
    },
  )

  await test.step(
    'Put onto the ten of hearts at tableau 1.',
    async (test) => {
      solitaireBuild(solitaire, { type: 'Tableau', x: 5 })
      await assertSnapshot(test, solitaireToString(solitaire), { dir: '.' })
    },
  )

  await test.step(
    'Reveal tableau pile 2.',
    async (test) => {
      solitairePoint(solitaire, solitaire.tableau[2]!.at(-1)!)
      await assertSnapshot(test, solitaireToString(solitaire), { dir: '.' })
    },
  )
})

Deno.test('Shuffle: permutations.', () => {
  const iterations = 1_000_000
  const array = ['a', 'b', 'c', 'd', 'e']
  const permutations = permute(array).map((permutation) => permutation.join(''))

  const distribution: Record<string, number> = {}
  for (let i = 0; i < iterations; i++) {
    shuffle(array, Math.random)
    const permutation = array.join('')
    distribution[permutation] ??= 0
    distribution[permutation]++
  }

  for (const permutation of permutations) {
    const occurrences = distribution[permutation] ?? 0
    const frequency = occurrences / iterations
    assertAlmostEquals(frequency, 1 / permutations.length, 0.001)
  }
})

Deno.test('Shuffle: no randomization.', () => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'
  const letters = [...alphabet]
  shuffle(letters, () => 1 - Number.EPSILON)
  assertEquals(letters.join(''), alphabet)
})

/** [Heap's_algorithm](https://en.wikipedia.org/wiki/Heap%27s_algorithm). */
function permute<T>(array: T[], n: number = array.length): T[][] {
  if (n === 1) return [[...array]]

  const permutations = []
  permutations.push(...permute(array, n - 1))

  for (let i = 0; i < n - 1; i++) {
    if (n % 2) swapIndices(array, 0, n - 1)
    else swapIndices(array, i, n - 1)
    permutations.push(...permute(array, n - 1))
  }

  return permutations
}

Deno.test('Str', async (test) => {
  for (
    const [str, uncapitalized] of [
      ['', ''],
      [' ', ' '],
      ['\t', '\t'],
      ['\n', '\n'],
      ['   ', '   '],
      ['a', 'a'],
      ['A', 'a'],
      ['abc', 'abc'],
      ['ABC', 'aBC'],
    ] as const
  ) {
    await test.step(`strUncapitalize(${str}) => ${uncapitalized}`, () =>
      assertEquals(uncapitalize(str), uncapitalized))
  }
})
