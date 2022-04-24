import {Card} from '../card/Card.js'
import {Direction} from '../card/Direction.js'
import {Rank} from '../card/Rank.js'
import {Suit} from '../card/Suit.js'

export namespace Deck {
  /** Generate a complete pack of 52 ordered cards. */
  export function make(direction: Direction = 'down'): Card[] {
    const deck = []
    for (const suit of Suit.values)
      for (const rank of Rank.values) deck.push({suit, rank, direction})
    return deck
  }
}
