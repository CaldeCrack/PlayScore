import mongoose from "mongoose"
import IRating from "../types/rating"
import config from "../utils/config"


const ratingSchema = new mongoose.Schema<IRating>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `User${config.MONGODB_SUFFIX}`
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `Game${config.MONGODB_SUFFIX}`
  },
  score: {
    type: Number,
    required: true
  }
})

const Rating = mongoose.model(`Rating${config.MONGODB_SUFFIX}`, ratingSchema)

ratingSchema.set("toJSON", {
  transform: (
    document,
    returnedObject: {
      id?: string
      _id?: mongoose.Types.ObjectId
      __v?: number
    }
  ) => {
    returnedObject.id = returnedObject._id!.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

export default Rating