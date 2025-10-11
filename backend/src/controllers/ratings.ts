import express from "express"
import Rating from "../models/ratings"
import User from "../models/users"
import jwt from "jsonwebtoken"
import config from "../utils/config"
import { withUser } from "../utils/middleware"
import Game from "../models/games"


const router = express.Router()

router.get("/", async (request, response) => {
  const ratings = await Rating.find({})
    .populate("user")
    .populate("game")
  response.json(ratings)
})

router.get("/:id", async (request, response, next) => {
  const id = request.params.id
  const rating = await Rating.findById(id)
    .populate("user")
    .populate("game")

  if (rating)
    response.json(rating)
  else
    response.status(404).end()
})

router.delete("/:id", withUser, async (request, response, next) => {
  const id = request.params.id
  await Rating.findByIdAndDelete(id)
  response.status(204).end()
})

router.post("/", withUser, async (request, response, next) => {
  const body = request.body
  const user = await User.findById(request.userId)
  const game = await Game.findById(body.game)

  if (!user)
    response.status(400).json({ error: "user not found" })
  else if (!game)
    response.status(400).json({ error: "game not found" })
  else if (!body.content)
    response.status(400).json({ error: "content missing" })
  else {
    const rating = {
      user: user.id,
      game: game.id,
      score: body.score
    }

    const savedRating = await new Rating(rating).save()

    user.ratings = user.ratings.concat(savedRating.id)
    await user.save()
    game.ratings = game.ratings.concat(savedRating.id)
    await game.save()

    response.status(201).json(savedRating)
  }
})

router.put("/:id", withUser, async (request, response, next) => {
  const { score } = request.body
  const rating = await Rating.findById(request.params.id)

  if (rating) {
    rating.score = score
    const updatedRating = await rating.save()

    response.json(updatedRating)
  } else
    response.status(404).end()
})

export default router