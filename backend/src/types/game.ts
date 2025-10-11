import mongoose from "mongoose"
import AvgDuration from "./avgDuration"


export default interface IGame {
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