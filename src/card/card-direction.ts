/**
 * The physical orientation of the card. All card backs are identical and
 * occlude the fronts. The front, or face, shows the card suit and rank. Each
 * card has a unique suit-rank identity that is secret when hidden (down) and
 * known when visible (up).
 */
export type CardDirection = Parameters<typeof CardDirectionSet['has']>[0]

export const CardDirectionSet = new Set(['Down', 'Up'] as const)
