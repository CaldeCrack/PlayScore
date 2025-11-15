import express from "express"
import { withUser } from "../utils/middleware"
import Rating from "../models/ratings"
import User from "../models/users"
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

router.get("/game/:id", async (request, response) => {
  const ratings = await Rating.find({ game: request.params.id })
    .populate("user")
    .populate("game")

  response.json(ratings)
})

router.get("/user/:id", async (request, response) => {
  const ratings = await Rating.find({ user: request.params.id })
    .populate("user")
    .populate("game")

  if (ratings.length === 0)
    return response.json([])

  response.json(ratings)
})

router.get("/user/:userId/game/:gameId", async (request, response) => {
  const { userId, gameId } = request.params

  const rating = await Rating.findOne({ user: userId, game: gameId })
    .populate("user")
    .populate("game")

  if (!rating)
    return response.json({})

  response.json(rating)
})

router.delete("/:id", withUser, async (request, response, next) => {
  const ratingId = request.params.id
  const userId = request.userId

  const rating = await Rating.findById(ratingId)
  const user = await User.findById(userId)

  if (!user)
    return response.status(400).json({ error: "user not found" })
  else if (!rating)
    return response.status(404).json({ error: "rating not found" })

  if (rating.user.toString() !== user.id.toString())
    return response.status(403).json({ error: "not allowed to delete this rating" })

  await Rating.findByIdAndDelete(ratingId)

  user.ratings = user.ratings.filter(r => r.toString() !== ratingId)
  await user.save()

  const game = await Game.findById(rating.game)
  game!.ratings = game!.ratings.filter(r => r.toString() !== ratingId)
  await game!.save()

  response.status(204).end()
})

router.post("/", withUser, async (request, response, next) => {
  const body = request.body
  const user = await User.findById(request.userId)

  if (!body.game)
    response.status(400).json({ error: "game id is missing" })

  const game = await Game.findById(body.game)

  if (!user)
    response.status(400).json({ error: "user not found" })
  else if (!game)
    response.status(400).json({ error: "game not found" })
  else if (!body.score)
    response.status(400).json({ error: "score missing" })
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