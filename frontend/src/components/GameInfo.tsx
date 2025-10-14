import { useEffect, useState } from 'react'
import type Game from '../types/Game'
import { useParams } from 'react-router-dom'
import gameService from '../services/games'
import ratingService from '../services/ratings'
import '../styles/GameInfo.css'
import type Rating from '../types/Rating'
import type User from '../types/User'
import type Comment from '../types/Comment'
import loginService from '../services/login'
import commentService from '../services/comments'


const GameInfo = () => {
  const { id } = useParams()
  const [game, setGame] = useState<Game>()
  const [ratings, setRatings] = useState<Rating[]>([])
  const [score, setScore] = useState(5.0)
  const [userScore, setUserScore] = useState<number | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [showScoreInput, setShowScoreInput] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')

  const onUserScoreChange  = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScore(parseFloat(event.target.value))
  }

  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await ratingService.postOrUpdateRating(user!.id, game!.id, score)
    const newRatings = await ratingService.getGameRatings(id!)
    setRatings(newRatings)
    setShowScoreInput(false)
  }

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(event.target.value)
  }

  const handleCommentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!newComment.trim() || !user)
      return

    await commentService.postComment(user.id, game!.id, newComment)
    setNewComment('')

    const updatedComments = await commentService.getGameComments(game!.id)
    setComments(updatedComments)
  }

  useEffect(() => {
    const setData = async () => {
      const gameData = await gameService.getGameById(id!)
      setGame(gameData)
      const user = await loginService.restoreLogin()
      setUser(user)
      if (user && gameData) {
        const userRating = await ratingService.getUserGameRating(user.id, gameData.id)
        setUserScore(userRating.score)
      }
      const ratingData = await ratingService.getGameRatings(id!)
      setRatings(ratingData)
      const commentData = await commentService.getGameComments(id!)
      setComments(commentData)
    }
    setData()
  }, [showScoreInput])

  if (!game)
    return <p>Loading game info...</p>

  return (
    <div className="game-info-page">
      {/* Cover + header */}
      <div className="game-header">
        <img
          src={`/img/${game.cover_image}`}
          alt={`${game.title} cover`}
          className="game-cover-large"
        />
        <div className="game-header-text">
          <h1>{game.title} ({game.release_year})</h1>
          <p>
            <strong>Publisher:</strong> {game.publisher}
            <br />
            <strong>Developers:</strong> {game.developers.join(', ')}
          </p>
          <div className="game-info-rating">
            ⭐ { ratings.length == 0 ? 'No reviews yet' :
              `${(ratings
                .reduce((acc: number, curr: Rating) => acc + curr.score, 0) / ratings.length)
                .toFixed(1)
              } (${ratings.length} review${ratings.length > 1 ? 's' : ''})`
            }

            {
              !user
                ? (
                  <button className="rate-btn" type="button" disabled>
                    Login first
                  </button>
                ) : !showScoreInput
                  ?
                  <button
                    className="rate-btn"
                    type="button"
                    onClick={() => setShowScoreInput(!showScoreInput)}
                  >
                    {userScore ? `Change rating (${userScore})` : 'Rate'}
                  </button>
                  :
                  <form onSubmit={ onSubmitHandler } className="rate-form">
                    <input
                      type="number"
                      min="1"
                      max="10"
                      step="0.1"
                      value={ score }
                      onChange={ onUserScoreChange }
                    />
                    <button className="rate-btn" type="submit">Send</button>
                  </form>
            }
          </div>
        </div>
      </div>

      {/* Description */}
      <section className="game-description">
        <h2>Description</h2>
        <span>{game.description}</span>
      </section>

      {/* Genres & Platforms */}
      <section className="game-info-meta">
        <h2>Details</h2>
        <span><strong>Genres:</strong> {game.genres.join(', ')}</span>
        <br />
        <span><strong>Platforms:</strong> {game.platforms.join(', ')}</span>
      </section>

      {/* Durations */}
      <section className="game-info-duration">
        <h2>How long to beat?</h2>
        <div>
          <span>Main Story: {game.average_duration.main_story}h</span>
          <br />
          <span>Main Story + Extras: {game.average_duration.main_plus_extras}h</span>
          <br />
          <span>Completionist: {game.average_duration.completionist}h</span>
        </div>
      </section>

      {/* Comments Section */}
      <section className="game-comments">
        <h2>Comments</h2>

        {/* Comment List */}
        {!comments || comments.length === 0 ? (
          <p>No comments yet. Be the first to comment!</p>
        ) : (
          <ul className="comments-list">
            {comments.map((comment, i) => (
              <li key={i} className="comment-item">
                <strong>{comment.user.username}</strong>: {comment.content}
              </li>
            ))}
          </ul>
        )}

        {/* Comment Form */}
        {user ? (
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={handleCommentChange}
            />
            <button type="submit">Post</button>
          </form>
        ) : (
          <p>Login to post a comment.</p>
        )}
      </section>
    </div>
  )
}

export default GameInfo