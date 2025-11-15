import express from "express"
import Game from "../models/games"
import User from "../models/users"
import { withUser } from "../utils/middleware"
import multer from "multer"
import path from "path"
import fs from "fs"
import logger from "../utils/logger"
import mongoose from "mongoose"


const uploadDir = path.join(process.cwd(), "uploads")
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir)
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({ storage })

const router = express.Router()

router.get("/", async (request, response) => {
  const games = await Game.find({}).populate("ratings")
  response.json(games)
})

router.get("/:id", async (request, response, next) => {
  const id = request.params.id
  const game = await Game.findById(id).populate("ratings")
  if (game)
    response.json(game)
  else
    response.status(404).end()
})

router.delete("/:id", withUser, async (request, response, next) => {
  const id = request.params.id
  await Game.findByIdAndDelete(id)
  response.status(204).end()
})

router.post("/", withUser, upload.single("cover"), async (request, response, next) => {
  const body = request.body
  logger.info(body)
  const user = await User.findById(request.userId)

  if (!user)
    response.status(400).json({ error: "user not found" })
  else if (user.username !== "admin") //TODO: check better way to do this
    response.status(403).json({ error: "user is not admin" })
  else {
    const coverPath = request.file ? `/uploads/${request.file.filename}` : null
    const game = { ...body, cover_image: coverPath }
    const savedGame = await new Game(game).save()

    response.status(201).json(savedGame)
  }
})

router.post("/favorite/:id", withUser, async (request, response) => {
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

router.delete("/favorite/:id", withUser, async (request, response) => {
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