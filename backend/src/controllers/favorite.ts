import express from "express"
import { withUser } from "../utils/middleware"
import mongoose from "mongoose"
import User from "../models/users"
import Game from "../models/games"


const router = express.Router()

router.get("/game/:id", async (request, response) => {
  const gameId = new mongoose.Types.ObjectId(request.params.id)

  const game = await Game.findById(gameId)

  if (!game)
    return response.status(404).json({ error: "Game not found" })

  return response.json(game.favorited_by)
})

router.get("/user/:id", async (request, response) => {
  const userId = new mongoose.Types.ObjectId(request.params.id)

  const user = await User.findById(userId).populate("favorites")

  if (!user)
    return response.status(404).json({ error: "User not found" })

  return response.json({
    userId: user._id,
    favorites: user.favorites
  })
})

router.get("/game/:gameId/user/:userId", async (request, response) => {
  const gameId = new mongoose.Types.ObjectId(request.params.gameId)
  const userId = new mongoose.Types.ObjectId(request.params.userId)

  const user = await User.findById(userId)
  const game = await Game.findById(gameId)

  if (!user)
    return response.status(404).json({ error: "User not found" })

  if (!game)
    return response.status(404).json({ error: "Game not found" })

  const userHasFavorited = user.favorites.some((favId) => favId.equals(gameId))

  return response.json({
    userId,
    gameId,
    favorited: userHasFavorited
  })
})

router.post("/game/:id", withUser, async (request, response) => {
  const userId = new mongoose.Types.ObjectId(request.userId)
  const gameId = new mongoose.Types.ObjectId(request.params.id)

  const user = await User.findById(userId)
  const game = await Game.findById(gameId)

  if (!user)
    return response.status(404).json({ error: "User not found" })

  if (!game)
    return response.status(404).json({ error: "Game not found" })

  // Add game to user's favorites if not already added
  if (gameId && !user.favorites.includes(gameId)) {
    user.favorites.push(gameId)
    await user.save()
  }

  // Add user to game's favorited_by list if not already added
  if (userId && !game.favorited_by.includes(userId)) {
    game.favorited_by.push(userId)
    await game.save()
  }

  return response.status(200).json({
    message: "Game favorited successfully",
    userFavorites: user.favorites
  })
})

router.delete("/game/:id", withUser, async (request, response) => {
  const userId = new mongoose.Types.ObjectId(request.userId)
  const gameId = new mongoose.Types.ObjectId(request.params.id)

  const user = await User.findById(userId)
  const game = await Game.findById(gameId)

  if (!user)
    return response.status(404).json({ error: "User not found" })

  if (!game)
    return response.status(404).json({ error: "Game not found" })

  // Remove game from user's favorites
  user.favorites = user.favorites.filter((favId) => !favId.equals(gameId))
  await user.save()

  // Remove user from game's favorited_by
  game.favorited_by = game.favorited_by.filter((uId) => !uId.equals(userId))
  await game.save()

  return response.status(200).json({
    message: "Game unfavorited successfully",
    userFavorites: user.favorites
  })
})

export default router
