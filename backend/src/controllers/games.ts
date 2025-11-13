import express from "express"
import Game from "../models/games"
import User from "../models/users"
import { withUser } from "../utils/middleware"
import multer from "multer"
import path from "path"
import fs from "fs"
import logger from "../utils/logger"


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

export default router