import express from 'express'
import { withUser } from '../utils/middleware'
import Completion from '../models/completion'
import User from '../models/users'
import Game from '../models/games'


const router = express.Router()

router.get("/", async (_req, res) => {
  const completions = await Completion.find({})
    .populate("user")
    .populate("game")

  res.json(completions)
})

router.get("/:id", async (req, res) => {
  const completion = await Completion.findById(req.params.id)
    .populate("user")
    .populate("game")

  if (!completion)
    return res.status(404).end()

  res.json(completion)
})

router.get("/game/:id", async (req, res) => {
  const completions = await Completion.find({ game: req.params.id })
    .populate("user")
    .populate("game")

  res.json(completions)
})

router.get("/user/:id", async (req, res) => {
  const completions = await Completion.find({ user: req.params.id })
    .populate("user")
    .populate("game")

  if (completions.length === 0)
    return res.json([])

  res.json(completions)
})

router.get("/user/:userId/game/:gameId", async (req, res) => {
  const { userId, gameId } = req.params

  const completion = await Completion.findOne({ user: userId, game: gameId })
    .populate("user")
    .populate("game")

  if (!completion)
    return res.json({})

  res.json(completion)
})

router.delete("/:id", withUser, async (req, res) => {
  const completionId = req.params.id
  const userId = req.userId

  const completion = await Completion.findById(completionId)
  const user = await User.findById(userId)

  if (!user)
    return res.status(400).json({ error: "user not found" })
  if (!completion)
    return res.status(404).json({ error: "completion not found" })

  if (completion.user.toString() !== user.id.toString())
    return res.status(403).json({ error: "not allowed to delete this completion" })

  await Completion.findByIdAndDelete(completionId)

  // remove from user
  user.completions = user.completions.filter(c => c.toString() !== completionId)
  await user.save()

  // remove from game
  const game = await Game.findById(completion.game)
  if (game) {
    game.completions = game.completions.filter(c => c.toString() !== completionId)
    await game.save()
  }

  res.status(204).end()
})

router.post("/", withUser, async (req, res) => {
  const body = req.body
  const user = await User.findById(req.userId)

  if (!body.game)
    return res.status(400).json({ error: "game id is missing" })

  const game = await Game.findById(body.game)

  if (!user)
    return res.status(400).json({ error: "user not found" })
  if (!game)
    return res.status(400).json({ error: "game not found" })
  if (!body.main_story)
    return res.status(400).json({ error: "main_story is required" })
  if (body.main_story <= 0 || body.main_plus_extras <= 0 || body.completionist <= 0)
    return res.status(400).json({ error: "time must be positive" })

  const completion = {
    user: user.id,
    game: game.id,
    main_story: body.main_story,
    main_plus_extras: body.main_plus_extras,
    completionist: body.completionist
  }

  const savedCompletion = await new Completion(completion).save()

  user.completions = user.completions.concat(savedCompletion.id)
  await user.save()

  game.completions = game.completions.concat(savedCompletion.id)
  await game.save()

  res.status(201).json(savedCompletion)
})

router.put("/:id", withUser, async (req, res) => {
  const { main_story, main_plus_extras, completionist } = req.body

  const completion = await Completion.findById(req.params.id)

  if (!completion)
    return res.status(404).end()
  if (main_story <= 0 || main_plus_extras <= 0 || completionist <= 0)
    return res.status(400).json({ error: "time must be positive" })

  // Update only provided fields
  if (main_story !== undefined) completion.main_story = main_story
  if (main_plus_extras !== undefined) completion.main_plus_extras = main_plus_extras
  if (completionist !== undefined) completion.completionist = completionist

  const updatedCompletion = await completion.save()

  res.json(updatedCompletion)
})

export default router
