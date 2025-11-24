import express, { response } from 'express';
import User from '../models/users';
import Comment from '../models/comments';
import Completion from '../models/completion';
import Game from '../models/games';
import Rating from '../models/ratings';

const router = express.Router();

router.post("/reset", async (req, res) => {
    await Comment.deleteMany({})
    await Completion.deleteMany({})
    await Game.deleteMany({})
    await Rating.deleteMany({})
    await User.deleteMany({})

    res.status(204).end()
})

export default router;