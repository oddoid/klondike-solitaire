/**
 * When directed, respect card direction. That is, face down cards are
 * represented as card backs. When false, all card identities are visible
 * regardless of card directions. For example, a face down ace of spades is
 * `'🂠'` when `'directed'` and `'🂡'` when `'undirected'`.
 */
export type CardVisibility = Parameters<(typeof CardVisibilitySet)['has']>[0]
export const CardVisibilitySet = new Set(<const>['Directed', 'Undirected'])
