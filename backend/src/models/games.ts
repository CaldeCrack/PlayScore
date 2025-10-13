import mongoose from "mongoose"
import type IGame from "../types/game"
import DurationSchema from "./duration"


const gameSchema = new mongoose.Schema<IGame>({
  title: { type: String, required: true },
  developers: { type: [String], required: true },
  publisher: { type: String, required: true },
  release_year: { type: Number, required: true },
  platforms: { type: [String], required: true },
  genres: { type: [String], required: true },
  average_duration: DurationSchema,
  description: { type: String, required: true },
  cover_image: { type: String, required: true },
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