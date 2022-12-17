import { Card } from '@/solitaire';

/**
 * Returns true if right card directly succeeds left.
 *
 * Empty behavior (left or right is undefined) is implementation-specific but
 * the function is guaranteed to be called once when both inputs are empty and
 * otherwise once for every pair (len - 1).
 */
export type Succeeds = (
  lhs: Readonly<Card> | undefined,
  rhs: Readonly<Card> | undefined,
) => boolean;
