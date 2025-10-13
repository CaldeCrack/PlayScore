import type Game from './Game'
import type User from './User'


export default interface Rating {
  id: string
  user: User
  game: Game
  score: number
}