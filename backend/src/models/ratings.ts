import mongoose from "mongoose"
import IRating from "../types/rating"


const ratingSchema = new mongoose.Schema<IRating>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Game"
  },
  score: Number
})

const Rating = mongoose.model("Rating", ratingSchema)

ratingSchema.set("toJSON", {
  transform: (
    document,
    returnedObject: {
      id?: string
      _id?: mongoose.Types.ObjectId
      __v?: number
    }
  ) => {
    returnedObject.id = returnedObject._id!.toString();
    delete returnedObject._id
    delete returnedObject.__v
  },
})

export default Rating