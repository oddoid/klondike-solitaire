import {describe, expect, test} from 'vitest'
import {cardToString} from './card/card.js'
import {foundationToString} from './layout/foundation.js'
import {
  Solitaire,
  shuffle,
  solitaireBuild,
  solitaireDeal,
  solitairePoint,
  solitaireToString,
  swapIndices,
  uncapitalize
} from './solitaire.js'

describe('Deal', async () => {
  let solitaire: Solitaire

  test('Set the game.', () => {
    solitaire = Solitaire(() => 1 - Number.EPSILON)
    expect(solitaireToString(solitaire)).toMatchInlineSnapshot(`
      "🃟🃟🃟🃟
      🂠🂠🂠🂠🂠🂠🂠
      　🂠🂠🂠🂠🂠🂠
      　　🂠🂠🂠🂠🂠
      　　　🂠🂠🂠🂠
      　　　　🂠🂠🂠
      　　　　　🂠🂠
      　　　　　　🂠
      🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠 🃟 🃟"
    `)
  })

  test('The foundation piles are empty.', () => {
    expect(cardToString('Directed', ...solitaire.foundation[0])).toBe('')
    expect(cardToString('Directed', ...solitaire.foundation[1])).toBe('')
    expect(cardToString('Directed', ...solitaire.foundation[2])).toBe('')
    expect(cardToString('Directed', ...solitaire.foundation[3])).toBe('')
    expect(
      foundationToString(solitaire.foundation, 'Directed')
    ).toMatchInlineSnapshot(`"🃟🃟🃟🃟"`)
  })

  test('The waste is empty.', () => {
    expect(solitaire.waste.length).toBe(0)
  })

  test('Deal.', () => {
    solitaireDeal(solitaire)
    expect(solitaireToString(solitaire, 'Undirected')).toMatchInlineSnapshot(`
      "🃟🃟🃟🃟
      🂮🂫🂨🂤🂽🂶🃍
      　🂭🂩🂥🂾🂷🃎
      　　🂪🂦🂡🂸🂱
      　　　🂧🂢🂹🂲
      　　　　🂣🂺🂳
      　　　　　🂻🂴
      　　　　　　🂵
      🃑🃒🃓🃔🃕🃖🃗🃘🃙🃚🃛🃝🃞🃁🃂🃃🃄🃅🃆🃇🃈🃉🃊🃋 🃟 🃟"
    `)
  })

  test('The stock is dealt into the tableau.', () => {
    expect(cardToString('Directed', ...solitaire.stock)).toBe(
      // 🃑🃒🃓🃔🃕🃖🃗🃘🃙🃚🃛🃝🃞   🃁🃂🃃🃄🃅🃆🃇🃈🃉🃊🃋
      '🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠' + '🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠'
    )
    expect(
      solitaire.tableau.map(pile => cardToString('Directed', ...pile))
    ).toStrictEqual([
      '🂠', //       🂮
      '🂠🂠', //      🂫🂭
      '🂠🂠🂠', //     🂨🂩🂪
      '🂠🂠🂠🂠', //    🂤🂥🂦🂧
      '🂠🂠🂠🂠🂠', //   🂽🂾🂡🂢🂣
      '🂠🂠🂠🂠🂠🂠', //  🂶🂷🂸🂹🂺🂻
      '🂠🂠🂠🂠🂠🂠🂠' // 🃍🃎🂱🂲🂳🂴🂵
    ])
  })

  test('Draw all.', () => {
    while (solitaire.stock.length > 0) {
      solitairePoint(solitaire, solitaire.stock.at(-1)!)
      expect(solitaireToString(solitaire)).toMatchSnapshot()
    }
  })

  test('Redeal.', () => {
    solitaireDeal(solitaire)
    expect(solitaireToString(solitaire, 'Undirected')).toMatchInlineSnapshot(`
      "🃟🃟🃟🃟
      🂮🂫🂨🂤🂽🂶🃍
      　🂭🂩🂥🂾🂷🃎
      　　🂪🂦🂡🂸🂱
      　　　🂧🂢🂹🂲
      　　　　🂣🂺🂳
      　　　　　🂻🂴
      　　　　　　🂵
      🃑🃒🃓🃔🃕🃖🃗🃘🃙🃚🃛🃝🃞🃁🃂🃃🃄🃅🃆🃇🃈🃉🃊🃋 🃟 🃟"
    `)
  })

  test('Draw all.', () => {
    while (solitaire.stock.length > 0) {
      solitairePoint(solitaire, solitaire.stock.at(-1)!)
      expect(solitaireToString(solitaire)).toMatchSnapshot()
    }
  })
})

describe('Playthrough', () => {
  const solitaire = Solitaire(() => 1 - Number.EPSILON, 0, 3, 7)
  solitaireDeal(solitaire)

  test('Set the game.', () => {
    expect(solitaireToString(solitaire)).toMatchInlineSnapshot(`
      "🃟🃟🃟🃟
      🂠🂠🂠🂠🂠🂠🂠
      　🂠🂠🂠🂠🂠🂠
      　　🂠🂠🂠🂠🂠
      　　　🂠🂠🂠🂠
      　　　　🂠🂠🂠
      　　　　　🂠🂠
      　　　　　　🂠
      🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠 🃟 🃟"
    `)
  })

  for (const [index, column] of solitaire.tableau.entries()) {
    test(`Reveal tableau pile ${index}.`, () => {
      solitairePoint(solitaire, column.at(-1)!)
      expect(solitaireToString(solitaire)).toMatchSnapshot()
    })
  }

  test('Take the ten of spades from tableau 2, top.', () => {
    solitairePoint(solitaire, solitaire.tableau[2]!.at(-1)!)
    expect(solitaireToString(solitaire)).toMatchInlineSnapshot(`
      "🃟🃟🃟🃟
      🂮🂠🂠🂠🂠🂠🂠
      　🂭🂠🂠🂠🂠🂠
      　　　🂠🂠🂠🂠
      　　　🂧🂠🂠🂠
      　　　　🂣🂠🂠
      　　　　　🂻🂠
      　　　　　　🂵
      🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠 🃟 🃟
      🂪 from Tableau (2, 2)"
    `)
  })

  test('Put onto the jack of hearts at tableau 5.', () => {
    solitaireBuild(solitaire, {type: 'Tableau', x: 5})
    expect(solitaireToString(solitaire)).toMatchInlineSnapshot(`
      "🃟🃟🃟🃟
      🂮🂠🂠🂠🂠🂠🂠
      　🂭🂠🂠🂠🂠🂠
      　　　🂠🂠🂠🂠
      　　　🂧🂠🂠🂠
      　　　　🂣🂠🂠
      　　　　　🂻🂠
      　　　　　🂪🂵
      🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠 🃟 🃟"
    `)
  })

  test('Take the the jack of hearts at tableau 5, top.', () => {
    solitairePoint(solitaire, solitaire.tableau[5]!.at(-2)!)
    expect(solitaireToString(solitaire)).toMatchInlineSnapshot(`
      "🃟🃟🃟🃟
      🂮🂠🂠🂠🂠🂠🂠
      　🂭🂠🂠🂠🂠🂠
      　　　🂠🂠🂠🂠
      　　　🂧🂠🂠🂠
      　　　　🂣🂠🂠
      　　　　　　🂠
      　　　　　　🂵
      🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠 🃟 🃟
      🂻🂪 from Tableau (5, 5)"
    `)
  })

  test('Put onto the queen of spades at tableau 1.', () => {
    solitaireBuild(solitaire, {type: 'Tableau', x: 1})
    expect(solitaireToString(solitaire)).toMatchInlineSnapshot(`
      "🃟🃟🃟🃟
      🂮🂠🂠🂠🂠🂠🂠
      　🂭🂠🂠🂠🂠🂠
      　🂻　🂠🂠🂠🂠
      　🂪　🂧🂠🂠🂠
      　　　　🂣🂠🂠
      　　　　　　🂠
      　　　　　　🂵
      🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠 🃟 🃟"
    `)
  })

  test('Reveal tableau pile 2.', () => {
    solitairePoint(solitaire, solitaire.tableau[2]!.at(-1)!)
    expect(solitaireToString(solitaire)).toMatchInlineSnapshot(`
      "🃟🃟🃟🃟
      🂮🂠🂠🂠🂠🂠🂠
      　🂭🂩🂠🂠🂠🂠
      　🂻　🂠🂠🂠🂠
      　🂪　🂧🂠🂠🂠
      　　　　🂣🂠🂠
      　　　　　　🂠
      　　　　　　🂵
      🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠 🃟 🃟"
    `)
  })

  test('Reveal tableau pile 5.', () => {
    solitairePoint(solitaire, solitaire.tableau[5]!.at(-1)!)
    expect(solitaireToString(solitaire)).toMatchInlineSnapshot(`
      "🃟🃟🃟🃟
      🂮🂠🂠🂠🂠🂠🂠
      　🂭🂩🂠🂠🂠🂠
      　🂻　🂠🂠🂠🂠
      　🂪　🂧🂠🂠🂠
      　　　　🂣🂺🂠
      　　　　　　🂠
      　　　　　　🂵
      🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠 🃟 🃟"
    `)
  })

  test('Take the the nine of spades at tableau 2, top.', () => {
    solitairePoint(solitaire, solitaire.tableau[2]!.at(-1)!)
    expect(solitaireToString(solitaire)).toMatchInlineSnapshot(`
      "🃟🃟🃟🃟
      🂮🂠🂠🂠🂠🂠🂠
      　🂭　🂠🂠🂠🂠
      　🂻　🂠🂠🂠🂠
      　🂪　🂧🂠🂠🂠
      　　　　🂣🂺🂠
      　　　　　　🂠
      　　　　　　🂵
      🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠 🃟 🃟
      🂩 from Tableau (2, 1)"
    `)
  })

  test('Put onto the ten of hearts at tableau 1.', () => {
    solitaireBuild(solitaire, {type: 'Tableau', x: 5})
    expect(solitaireToString(solitaire)).toMatchInlineSnapshot(`
      "🃟🃟🃟🃟
      🂮🂠🂠🂠🂠🂠🂠
      　🂭　🂠🂠🂠🂠
      　🂻　🂠🂠🂠🂠
      　🂪　🂧🂠🂠🂠
      　　　　🂣🂺🂠
      　　　　　🂩🂠
      　　　　　　🂵
      🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠 🃟 🃟"
    `)
  })

  test('Reveal tableau pile 2.', () => {
    solitairePoint(solitaire, solitaire.tableau[2]!.at(-1)!)
    expect(solitaireToString(solitaire)).toMatchInlineSnapshot(`
      "🃟🃟🃟🃟
      🂮🂠🂨🂠🂠🂠🂠
      　🂭　🂠🂠🂠🂠
      　🂻　🂠🂠🂠🂠
      　🂪　🂧🂠🂠🂠
      　　　　🂣🂺🂠
      　　　　　🂩🂠
      　　　　　　🂵
      🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠 🃟 🃟"
    `)
  })
})

test('Shuffle: permutations.', () => {
  const iterations = 1_000_000
  const array = ['a', 'b', 'c', 'd', 'e']
  const permutations = permute(array).map(permutation => permutation.join(''))

  const distribution: {[letter: string]: number} = {}
  for (let i = 0; i < iterations; i++) {
    shuffle(array, Math.random)
    const permutation = array.join('')
    distribution[permutation] ??= 0
    distribution[permutation]++
  }

  for (const permutation of permutations) {
    const occurrences = distribution[permutation] ?? 0
    const frequency = occurrences / iterations
    expect(frequency).toBeCloseTo(1 / permutations.length, 0.001)
  }
})

test('Shuffle: no randomization.', () => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'
  const letters = [...alphabet]
  shuffle(letters, () => 1 - Number.EPSILON)
  expect(letters.join('')).toBe(alphabet)
})

/** [Heap's_algorithm](https://en.wikipedia.org/wiki/Heap%27s_algorithm). */
function permute<T>(array: T[], n: number = array.length): T[][] {
  if (n === 1) return [[...array]]

  const permutations: T[][] = []
  permutations.push(...permute(array, n - 1))

  for (let i = 0; i < n - 1; i++) {
    if (n % 2) swapIndices(array, 0, n - 1)
    else swapIndices(array, i, n - 1)
    permutations.push(...permute(array, n - 1))
  }

  return permutations
}

describe('Str', () => {
  for (const [str, uncapitalized] of <const>[
    ['', ''],
    [' ', ' '],
    ['\t', '\t'],
    ['\n', '\n'],
    ['   ', '   '],
    ['a', 'a'],
    ['A', 'a'],
    ['abc', 'abc'],
    ['ABC', 'aBC']
  ]) {
    test(`strUncapitalize(${str}) => ${uncapitalized}`, () =>
      expect(uncapitalize(str)).toBe(uncapitalized))
  }
})
