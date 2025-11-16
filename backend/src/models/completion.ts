import mongoose from "mongoose"
import ICompletion from "../types/completion"
import config from "../utils/config"


const completionSchema = new mongoose.Schema<ICompletion>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `User${config.MONGODB_SUFFIX}`
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `Game${config.MONGODB_SUFFIX}`
  },
  main_story: { type: Number, required: true },
  main_plus_extras: Number,
  completionist: Number
})

const Completion = mongoose.model(`Completion${config.MONGODB_SUFFIX}`, completionSchema)

completionSchema.set("toJSON", {
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

export default Completion
