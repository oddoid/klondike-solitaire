import { UintXY } from '@/oidlib';
import { Card } from '@/klondike-solitaire';

export interface Selection {
  readonly cards: Card[];
  readonly pile: 'Foundation' | 'Tableau' | 'Waste';
  readonly xy: UintXY;
}
