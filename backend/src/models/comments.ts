import mongoose from "mongoose"
import IComment from "../types/comment"
import config from "../utils/config"


const commentSchema = new mongoose.Schema<IComment>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `User${config.MONGODB_SUFFIX}`
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `Game${config.MONGODB_SUFFIX}`
  },
  content: {
    type: String,
    required: true
  }
})

const Comment = mongoose.model(`Comment${config.MONGODB_SUFFIX}`, commentSchema)

commentSchema.set("toJSON", {
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

export default Comment