import { Card, Foundation, Solitaire } from '@/klondike-solitaire';
import { Uint } from '@/oidlib';
import { assertEquals } from 'std/testing/asserts.ts';
import { assertSnapshot } from '../../oidlib/src/test/TestUtil.ts';
// import { assertSnapshot } from '@/oidlib';

Deno.test('Deal', async (test) => {
  let solitaire: Solitaire;

  await test.step(
    'Set the game.',
    async (test) => {
      solitaire = Solitaire(undefined, () => 1 - Number.EPSILON);
      await assertSnapshot(test, Solitaire.toString(solitaire));
    },
  );

  await test.step('The foundation piles are empty.', (test) => {
    assertEquals(
      Card.toString('Directed', ...solitaire.foundation[0]),
      '',
    );
    assertEquals(
      Card.toString('Directed', ...solitaire.foundation[1]),
      '',
    );
    assertEquals(
      Card.toString('Directed', ...solitaire.foundation[2]),
      '',
    );
    assertEquals(
      Card.toString('Directed', ...solitaire.foundation[3]),
      '',
    );
    assertSnapshot(test, Foundation.toString(solitaire.foundation, 'Directed'));
  });

  await test.step('The waste is empty.', () => {
    assertEquals(
      solitaire.waste.length,
      0,
    );
  });

  await test.step(
    'Deal.',
    async (test) => {
      Solitaire.deal(solitaire);
      await assertSnapshot(test, Solitaire.toString(solitaire, 'Undirected'));
    },
  );

  await test.step('The stock is dealt into the tableau.', () => {
    assertEquals(
      Card.toString('Directed', ...solitaire.stock),
      // 🃑🃒🃓🃔🃕🃖🃗🃘🃙🃚🃛🃝🃞   🃁🃂🃃🃄🃅🃆🃇🃈🃉🃊🃋
      '🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠' + '🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠',
    );
    assertEquals(
      solitaire.tableau.map((pile) => Card.toString('Directed', ...pile)),
      [
        '🂠', //       🂮
        '🂠🂠', //      🂫🂭
        '🂠🂠🂠', //     🂨🂩🂪
        '🂠🂠🂠🂠', //    🂤🂥🂦🂧
        '🂠🂠🂠🂠🂠', //   🂽🂾🂡🂢🂣
        '🂠🂠🂠🂠🂠🂠', //  🂶🂷🂸🂹🂺🂻
        '🂠🂠🂠🂠🂠🂠🂠', // 🃍🃎🂱🂲🂳🂴🂵
      ],
    );
  });

  await test.step(
    'Draw all.',
    async (test) => {
      while (solitaire.stock.length > 0) {
        Solitaire.point(solitaire, solitaire.stock.at(-1)!);
        await assertSnapshot(test, Solitaire.toString(solitaire));
      }
    },
  );

  await test.step(
    'Redeal.',
    async (test) => {
      Solitaire.deal(solitaire);
      await assertSnapshot(test, Solitaire.toString(solitaire, 'Undirected'));
    },
  );

  await test.step(
    'Draw all.',
    async (test) => {
      while (solitaire.stock.length > 0) {
        Solitaire.point(solitaire, solitaire.stock.at(-1)!);
        await assertSnapshot(test, Solitaire.toString(solitaire));
      }
    },
  );
});

Deno.test('Playthrough', async (test) => {
  let solitaire!: Solitaire;
  await test.step(
    'Set the game.',
    async (test) => {
      solitaire = Solitaire(Uint(3), () => 1 - Number.EPSILON, Uint(7));
      Solitaire.deal(solitaire);
      await assertSnapshot(test, Solitaire.toString(solitaire));
    },
  );

  for (const [index, column] of solitaire.tableau.entries()) {
    await test.step(
      `Reveal tableau pile ${index}.`,
      async (test) => {
        Solitaire.point(solitaire, column.at(-1)!);
        await assertSnapshot(test, Solitaire.toString(solitaire));
      },
    );
  }

  await test.step(
    'Take the ten of spades from tableau 2, top.',
    async (test) => {
      Solitaire.point(solitaire, solitaire.tableau[2]!.at(-1)!);
      await assertSnapshot(test, Solitaire.toString(solitaire));
    },
  );

  await test.step(
    'Put onto the jack of hearts at tableau 5.',
    async (test) => {
      Solitaire.put(solitaire, { type: 'Tableau', x: Uint(5) });
      await assertSnapshot(test, Solitaire.toString(solitaire));
    },
  );

  await test.step(
    'Take the the jack of hearts at tableau 5, top.',
    async (test) => {
      Solitaire.point(solitaire, solitaire.tableau[5]!.at(-2)!);
      await assertSnapshot(test, Solitaire.toString(solitaire));
    },
  );

  await test.step(
    'Put onto the queen of spades at tableau 1.',
    async (test) => {
      Solitaire.put(solitaire, { type: 'Tableau', x: Uint(1) });
      await assertSnapshot(test, Solitaire.toString(solitaire));
    },
  );

  await test.step(
    'Reveal tableau pile 2.',
    async (test) => {
      Solitaire.point(solitaire, solitaire.tableau[2]!.at(-1)!);
      await assertSnapshot(test, Solitaire.toString(solitaire));
    },
  );

  await test.step(
    'Reveal tableau pile 5.',
    async (test) => {
      Solitaire.point(solitaire, solitaire.tableau[5]!.at(-1)!);
      await assertSnapshot(test, Solitaire.toString(solitaire));
    },
  );

  await test.step(
    'Take the the nine of spades at tableau 2, top.',
    async (test) => {
      Solitaire.point(solitaire, solitaire.tableau[2]!.at(-1)!);
      await assertSnapshot(test, Solitaire.toString(solitaire));
    },
  );

  await test.step(
    'Put onto the ten of hearts at tableau 1.',
    async (test) => {
      Solitaire.put(solitaire, { type: 'Tableau', x: Uint(5) });
      await assertSnapshot(test, Solitaire.toString(solitaire));
    },
  );

  await test.step(
    'Reveal tableau pile 2.',
    async (test) => {
      Solitaire.point(solitaire, solitaire.tableau[2]!.at(-1)!);
      await assertSnapshot(test, Solitaire.toString(solitaire));
    },
  );
});
