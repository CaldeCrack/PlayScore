import type { Duration } from './Duration'

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
  cover_image: string,
  franchise_games: number[]
}