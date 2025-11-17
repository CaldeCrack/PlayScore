import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import express from "express"
import User from "../models/users"
import config from "../utils/config"
import crypto from "crypto"
import { withUser } from "../utils/middleware"


const router = express.Router()

router.post("/", async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })
  if (user) {
    const passwordCorrect = await bcrypt.compare(password, user.passwordHash)

    if (!passwordCorrect)
      response.status(401).json({ error: "invalid username or password" })
    else {
      const userForToken = {
        username: user.username,
        csrf: crypto.randomUUID(),
        id: user.id,
      }

      const token = jwt.sign(userForToken, config.JWT_SECRET, { expiresIn: 60 * 60 })
      response.setHeader("X-CSRF-Token", userForToken.csrf)
      response.cookie("token", token, { httpOnly: true })
      response.status(200).send({ username: user.username, name: user.name, id: user.id })
    }
  } else
    response.status(401).json({ error: "invalid username or password" })
})

router.get("/me", withUser, async (request, response, next) => {
  const user = await User.findById(request.userId)
  response.status(200).json(user)
})

router.post("/logout", (request, response) => {
  response.clearCookie("token")
  response.status(200).send({ message: "Logged out successfully" })
})

export default router