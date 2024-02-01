import { Card } from '../card/card.ts'

export type CardsSelected = {
  readonly cards: Card[]
  readonly pile: 'Foundation' | 'Tableau' | 'Waste'
  readonly xy: { x: number; y: number }
}
