import {Card} from '../card/card.js'

export type CardsSelected = {
  readonly cards: Card[]
  readonly pile: 'Foundation' | 'Tableau' | 'Waste'
  readonly xy: {x: number; y: number}
}
