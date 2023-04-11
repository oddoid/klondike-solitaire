import { XY } from '@/ooz'
import { Card } from '@/solitaire'

export interface CardsSelected {
  readonly cards: Card[]
  readonly pile: 'Foundation' | 'Tableau' | 'Waste'
  readonly xy: XY
}
