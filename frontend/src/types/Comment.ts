import type Game from './Game'
import type User from './User'


export default interface Comment {
  id: string
  user: User
  game: Game
  content: string
}