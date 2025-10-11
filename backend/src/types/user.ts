import mongoose from "mongoose"

export interface IUser {
  id: string
  name: string
  username: string
  email: string
  passwordHash: string
  ratings: mongoose.Types.ObjectId[]
}