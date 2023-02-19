import { UintXY } from '@/ooz'
import { Card } from '@/solitaire'

export interface Selection {
  readonly cards: Card[]
  readonly pile: 'Foundation' | 'Tableau' | 'Waste'
  readonly xy: UintXY
}
