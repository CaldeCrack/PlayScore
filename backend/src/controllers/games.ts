import express from "express"
import Game from "../models/games"
import User from "../models/users"
import { withUser } from "../utils/middleware"


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

router.post("/", withUser, async (request, response, next) => {
  const body = request.body
  const user = await User.findById(request.userId)

  if (!user)
    response.status(400).json({ error: "user not found" })
  else if (user.username !== "admin") //TODO: check better way to do this
    response.status(403).json({ error: "user is not admin" })
  else if (!body.content)
    response.status(400).json({ error: "content missing" })
  else {
    const game = {}
    const savedGame = await new Game(game).save()

    response.status(201).json(savedGame)
  }
})

export default router