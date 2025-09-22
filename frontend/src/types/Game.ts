import type { Duration } from './Duration'

export interface Game {
  id: number,
  title: string,
  developers: string[],
  release_year: number,
  publisher: string,
  genres: string[],
  platforms: string[],
  average_duration: Duration,
  description: string,
  cover_image: string,
  franchise_games: number[]
}