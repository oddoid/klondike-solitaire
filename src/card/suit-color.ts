/** Suit primary hue. */
export type SuitColor = Parameters<typeof SuitColorSet['has']>[0]

export const SuitColorSet = new Set(['Black', 'Red'] as const)
