import { Immutable } from '@/oidlib';

/** Suit primary hue. */
export type Color = Parameters<typeof Color.values['has']>[0];

export namespace Color {
  export const values = Immutable(new Set(['Black', 'Red'] as const));
}
