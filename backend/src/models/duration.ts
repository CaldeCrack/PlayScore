import mongoose from "mongoose"
import Duration from "../types/duration"


const DurationSchema = new mongoose.Schema<Duration>({
  main_story: Number,
  main_plus_extras: Number,
  completionist: Number
})

export default DurationSchema