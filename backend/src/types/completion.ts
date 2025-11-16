import mongoose from "mongoose"

export default interface ICompletion {
  user: mongoose.Types.ObjectId
  game: mongoose.Types.ObjectId
  main_story: number
  main_plus_extras?: number
  completionist?: number
}
