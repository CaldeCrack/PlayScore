import type { Duration } from './Duration'
import type { Rating } from './Rating'

export interface Game {
    id: number,
    name: string,
    developers: string[],
    release_year: number,
    publisher: string,
    genres: string[],
    platforms: string[],
    player_score: Rating,
    average_duration: Duration,
    description: string,
    cover: string,
    franchise: number[] 
}