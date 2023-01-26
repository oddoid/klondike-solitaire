import { Immutable } from '@/oidlib'

/**
 * When directed, respect card direction. That is, face down cards are
 * represented as card backs. When false, all card identities are visible
 * regardless of card directions. For example, a face down ace of spades is
 * `'🂠'` when `'directed'` and `'🂡'` when `'undirected'`.
 */
export type Visibility = typeof Visibility.values[number]

export namespace Visibility {
  // to-do: switch to set.
  export const values = Immutable(['Directed', 'Undirected'] as const)
}
