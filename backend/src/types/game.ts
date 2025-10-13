import mongoose from "mongoose"
import Duration from "./duration"


export default interface IGame {
  id: string
  title: string
  developers: string[]
  release_year: number
  publisher: string
  genres: string[]
  platforms: string[]
  average_duration: Duration
  description: string
  cover_image: string
  ratings: mongoose.Types.ObjectId[]
  comments: mongoose.Types.ObjectId[]
}