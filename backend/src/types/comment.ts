import mongoose from "mongoose"


export default interface IComment {
  id: string
  user: mongoose.Types.ObjectId
  game: mongoose.Types.ObjectId
  content: string
}