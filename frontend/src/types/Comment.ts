import type Game from './Game'
import type User from './User'


export interface Comment {
  id: string
  author: User
  game: Game
  content: string
}