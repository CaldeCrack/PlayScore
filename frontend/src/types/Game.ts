import type { Duration } from './Duration'
import type { Rating } from './Rating'

export interface Game {
  id: number,
  title: string,
  developers: string[],
  release_year: number,
  publisher: string,
  genres: string[],
  platforms: string[],
  rating: Rating,
  average_duration: Duration,
  description: string,
  cover: string,
  franchise_games: number[]
}