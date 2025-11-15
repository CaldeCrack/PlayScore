import mongoose from "mongoose"


export default interface IUser {
  id: string
  name: string
  username: string
  email: string
  passwordHash: string
  ratings: mongoose.Types.ObjectId[]
  comments: mongoose.Types.ObjectId[]
  favorites: mongoose.Types.ObjectId[]
}