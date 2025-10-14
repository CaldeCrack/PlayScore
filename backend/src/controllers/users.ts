import bcrypt from "bcrypt"
import express from "express"
import User from "../models/users"


const router = express.Router()

router.get("/", async (request, response) => {
  const users = await User.find({})
    .populate("ratings")
    .populate("comments")
  response.json(users)
})

router.get("/:id", async (request, response) => {
  const user = await User.findById(request.params.id)
    .populate("ratings")
    .populate("comments")

  if (!user)
    return response.status(404).json({ error: "no user found" })

  response.json(user)
})

router.post("/", async (request, response) => {
  const { name, username, email, password } = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    name,
    username,
    email,
    passwordHash
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

export default router