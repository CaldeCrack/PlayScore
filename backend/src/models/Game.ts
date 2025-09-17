export interface Game {
  id: number
  title: string
  developer: string
  publisher: string
  release_year: number
  platforms: string[]
  genres: string[]
  average_duration: {
    main_story: number
    main_plus_extras: number
    completionist: number
  }
  rating: {
    average_score: number
    total_reviews: number
  }
  description: string
  cover_image: string
}