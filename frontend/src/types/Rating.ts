import type Game from './Game'
import type User from './User'


export interface Rating {
  id: string
  user: User
  game: Game
  score: number
}