import { Immutable } from '@/oidlib'

/**
 * The physical orientation of the card. All card backs are identical and
 * occlude the fronts. The front, or face, shows the card suit and rank. Each
 * card has a unique suit-rank identity that is secret when hidden (down) and
 * known when visible (up).
 */
export type Direction = Parameters<typeof Direction.values['has']>[0]

export namespace Direction {
  export const values = Immutable(new Set(['Down', 'Up'] as const))
}
