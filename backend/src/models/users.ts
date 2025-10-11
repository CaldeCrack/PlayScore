import mongoose from "mongoose"
import IUser from "../types/user"


const userSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
      }
    }
  },
  passwordHash: { type: String, required: true },
  ratings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rating",
    default: []
  }]
})

const User = mongoose.model("User", userSchema)

userSchema.set("toJSON", {
  transform: (
    document,
    returnedObject: {
      id?: string
      _id?: mongoose.Types.ObjectId
      __v?: number
      passwordHash?: string
    }
  ) => {
    returnedObject.id = returnedObject._id!.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  },
})

export default User