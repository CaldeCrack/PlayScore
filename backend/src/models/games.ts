import mongoose from "mongoose"
import type IGame from "../types/game"
import AvgDurationSchema from "./avgDuration"


const gameSchema = new mongoose.Schema<IGame>({
  title: String,
  developers: [String],
  publisher: String,
  release_year: Number,
  platforms: [String],
  genres: [String],
  average_duration: AvgDurationSchema,
  description: String,
  cover_image: String,
  ratings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rating"
  }]
})

const Game = mongoose.model("Game", gameSchema)

gameSchema.set("toJSON", {
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

export default Game