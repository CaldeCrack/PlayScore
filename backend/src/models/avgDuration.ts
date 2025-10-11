import mongoose from "mongoose"
import AvgDuration from "../types/avgDuration"


const AvgDurationSchema = new mongoose.Schema<AvgDuration>({
  main_story: Number,
  main_plus_extras: Number,
  completionist: Number
})

export default AvgDurationSchema