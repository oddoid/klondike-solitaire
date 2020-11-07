import {Card} from '../card/Card'
import {Rank} from '../card/Rank'
import {Suit} from '../card/Suit'

export namespace Deck {
  /** Generate a complete pack of 52 ordered cards. */
  export function make(direction: Card.Direction = 'down'): Card[] {
    const deck = []
    for (const suit of Suit.values)
      for (const rank of Rank.values) deck.push({suit, rank, direction})
    return deck
  }
}
