import type Game from './Game'
import type User from './User'


export default interface Comment {
  id: string
  author: User
  game: Game
  content: string
}