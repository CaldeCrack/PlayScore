import mongoose from "mongoose"
import Duration from "./duration"


export default interface IGame {
  id: string
  title: string
  developers: string[]
  publisher: string
  release_year: number
  platforms: string[]
  genres: string[]
  average_duration: Duration
  description: string
  cover_image: string
  ratings: mongoose.Types.ObjectId[]
}