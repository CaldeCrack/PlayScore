import type Duration from './Duration'
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
  average_duration: Duration,
  description: string,
  cover_image: File,
  // franchise_games: Game[]
  ratings: Rating[],
  comments: Comment[]
}