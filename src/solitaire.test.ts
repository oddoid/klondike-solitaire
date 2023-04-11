import {
  cardToString,
  foundationToString,
  Solitaire,
  solitaireBuild,
  solitaireDeal,
  solitairePoint,
  solitaireToString,
} from '@/solitaire'
import { assertEquals } from 'std/testing/asserts.ts'
import { assertSnapshot } from '../../ooz/src/test/test-util.ts'
// import { assertSnapshot } from '@/ooz';

Deno.test('Deal', async (test) => {
  let solitaire: Solitaire

  await test.step(
    'Set the game.',
    async (test) => {
      solitaire = Solitaire(() => 1 - Number.EPSILON)
      await assertSnapshot(test, solitaireToString(solitaire))
    },
  )

  await test.step('The foundation piles are empty.', (test) => {
    assertEquals(
      cardToString('Directed', ...solitaire.foundation[0]),
      '',
    )
    assertEquals(
      cardToString('Directed', ...solitaire.foundation[1]),
      '',
    )
    assertEquals(
      cardToString('Directed', ...solitaire.foundation[2]),
      '',
    )
    assertEquals(
      cardToString('Directed', ...solitaire.foundation[3]),
      '',
    )
    assertSnapshot(
      test,
      foundationToString(solitaire.foundation, 'Directed'),
    )
  })

  await test.step('The waste is empty.', () => {
    assertEquals(
      solitaire.waste.length,
      0,
    )
  })

  await test.step(
    'Deal.',
    async (test) => {
      solitaireDeal(solitaire)
      await assertSnapshot(test, solitaireToString(solitaire, 'Undirected'))
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
        await assertSnapshot(test, solitaireToString(solitaire))
      }
    },
  )

  await test.step(
    'Redeal.',
    async (test) => {
      solitaireDeal(solitaire)
      await assertSnapshot(test, solitaireToString(solitaire, 'Undirected'))
    },
  )

  await test.step(
    'Draw all.',
    async (test) => {
      while (solitaire.stock.length > 0) {
        solitairePoint(solitaire, solitaire.stock.at(-1)!)
        await assertSnapshot(test, solitaireToString(solitaire))
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
      await assertSnapshot(test, solitaireToString(solitaire))
    },
  )

  for (const [index, column] of solitaire.tableau.entries()) {
    await test.step(
      `Reveal tableau pile ${index}.`,
      async (test) => {
        solitairePoint(solitaire, column.at(-1)!)
        await assertSnapshot(test, solitaireToString(solitaire))
      },
    )
  }

  await test.step(
    'Take the ten of spades from tableau 2, top.',
    async (test) => {
      solitairePoint(solitaire, solitaire.tableau[2]!.at(-1)!)
      await assertSnapshot(test, solitaireToString(solitaire))
    },
  )

  await test.step(
    'Put onto the jack of hearts at tableau 5.',
    async (test) => {
      solitaireBuild(solitaire, { type: 'Tableau', x: 5 })
      await assertSnapshot(test, solitaireToString(solitaire))
    },
  )

  await test.step(
    'Take the the jack of hearts at tableau 5, top.',
    async (test) => {
      solitairePoint(solitaire, solitaire.tableau[5]!.at(-2)!)
      await assertSnapshot(test, solitaireToString(solitaire))
    },
  )

  await test.step(
    'Put onto the queen of spades at tableau 1.',
    async (test) => {
      solitaireBuild(solitaire, { type: 'Tableau', x: 1 })
      await assertSnapshot(test, solitaireToString(solitaire))
    },
  )

  await test.step(
    'Reveal tableau pile 2.',
    async (test) => {
      solitairePoint(solitaire, solitaire.tableau[2]!.at(-1)!)
      await assertSnapshot(test, solitaireToString(solitaire))
    },
  )

  await test.step(
    'Reveal tableau pile 5.',
    async (test) => {
      solitairePoint(solitaire, solitaire.tableau[5]!.at(-1)!)
      await assertSnapshot(test, solitaireToString(solitaire))
    },
  )

  await test.step(
    'Take the the nine of spades at tableau 2, top.',
    async (test) => {
      solitairePoint(solitaire, solitaire.tableau[2]!.at(-1)!)
      await assertSnapshot(test, solitaireToString(solitaire))
    },
  )

  await test.step(
    'Put onto the ten of hearts at tableau 1.',
    async (test) => {
      solitaireBuild(solitaire, { type: 'Tableau', x: 5 })
      await assertSnapshot(test, solitaireToString(solitaire))
    },
  )

  await test.step(
    'Reveal tableau pile 2.',
    async (test) => {
      solitairePoint(solitaire, solitaire.tableau[2]!.at(-1)!)
      await assertSnapshot(test, solitaireToString(solitaire))
    },
  )
})
