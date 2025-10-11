import mongoose from "mongoose"

export interface IRating {
  id: string
  user: mongoose.Types.ObjectId
  game: mongoose.Types.ObjectId
  score: number
}