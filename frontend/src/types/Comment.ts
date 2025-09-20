import type { Game } from './Game'

export interface Comment {
  id: number,
  game: Game,
  content: string,
  author?: string
}