import {Card} from '../card/Card'
import {Rank} from '../card/Rank'
import {Suit} from '../card/Suit'

export namespace Deck {
  /** Generate a complete pack of 52, face down, and ordered cards. */
  export function make(direction: Card.Direction = 'down'): Card[] {
    const deck = []
    for (const suit of Object.values(Suit.Type))
      for (const rank of Object.values(Rank.Type))
        deck.push({suit, rank, direction})
    return deck
  }
}
