import { Card } from '../card/card.ts'

export type CardsSelected = Readonly<{
  cards: Card[]
  pile: 'Foundation' | 'Tableau' | 'Waste'
  xy: { x: number; y: number }
}>
