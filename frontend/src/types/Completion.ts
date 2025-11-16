import type Game from './Game'
import type User from './User'

export default interface Completion {
  user: User
  game: Game
  main_story: number
  main_plus_extras?: number
  completionist?: number
}