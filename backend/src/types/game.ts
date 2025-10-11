import mongoose from "mongoose"

interface AvgDuration {
  main_story: number
  main_plus_extras: number
  completionist: number
}

export interface IGame {
  id: string
  title: string
  developers: string[]
  publisher: string
  release_year: number
  platforms: string[]
  genres: string[]
  average_duration: AvgDuration
  description: string
  cover_image: string
  ratings: mongoose.Types.ObjectId[]
}