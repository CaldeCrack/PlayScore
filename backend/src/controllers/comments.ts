import express from "express"
import { withUser } from "../utils/middleware"
import User from "../models/users"
import Game from "../models/games"
import Comment from "../models/comments"


const router = express.Router()

router.get("/", async (request, response) => {
  const comments = await Comment.find({})
    .populate("user")
    .populate("game")
  response.json(comments)
})

router.get("/:id", async (request, response, next) => {
  const id = request.params.id
  const comment = await Comment.findById(id)
    .populate("user")
    .populate("game")

  if (comment)
    response.json(comment)
  else
    response.status(404).end()
})

router.get("/game/:id", async (request, response) => {
  const comments = await Comment.find({ game: request.params.id })
    .populate("user")
    .populate("game")

  if (comments.length === 0)
    return response.status(404).json({ error: "no comments found for this game" })

  response.json(comments)
})

router.get("/user/:id", async (request, response) => {
  const comments = await Comment.find({ user: request.params.id })
    .populate("user")
    .populate("game")

  if (comments.length === 0)
    return response.status(404).json({ error: "this user has no comments" })

  response.json(comments)
})

router.delete("/:id", withUser, async (request, response, next) => {
  const commentId = request.params.id
  const userId = request.userId

  const comment = await Comment.findById(commentId)
  const user = await User.findById(userId)

  if (!user)
    return response.status(400).json({ error: "user not found" })
  else if (!comment)
    return response.status(404).json({ error: "comment not found" })

  if (comment.user.toString() !== user.id.toString())
    return response.status(403).json({ error: "not allowed to delete this comment" })

  await Comment.findByIdAndDelete(commentId)

  user.comments = user.comments.filter(r => r.toString() !== commentId)
  await user.save()

  const game = await Game.findById(comment.game)
  game!.comments = game!.comments.filter(r => r.toString() !== commentId)
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
  else if (!body.content)
    response.status(400).json({ error: "content missing" })
  else {
    const comment = {
      user: user.id,
      game: game.id,
      content: body.content
    }

    const savedComment = await new Comment(comment).save()

    user.comments = user.comments.concat(savedComment.id)
    await user.save()
    game.comments = game.comments.concat(savedComment.id)
    await game.save()

    response.status(201).json(savedComment)
  }
})

export default router