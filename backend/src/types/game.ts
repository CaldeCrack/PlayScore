import mongoose from "mongoose"
import Completion from "./completion"


export default interface IGame {
  id: string
  title: string
  developers: string[]
  release_year: number
  publisher: string
  genres: string[]
  platforms: string[]
  completions: Completion[]
  description: string
  cover_image: string
  ratings: mongoose.Types.ObjectId[]
  comments: mongoose.Types.ObjectId[]
  favorited_by: mongoose.Types.ObjectId[]
}