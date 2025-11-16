import type Completion from './Completion'
import type Rating from './Rating'
import type Comment from './Comment'


export default interface Game {
  id: string,
  title: string,
  developers: string[],
  release_year: number,
  publisher: string,
  genres: string[],
  platforms: string[],
  description: string,
  cover_image: File,
  // franchise_games: Game[]
  ratings: Rating[],
  comments: Comment[],
  completions: Completion[]
}