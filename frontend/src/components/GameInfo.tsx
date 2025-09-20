import { useEffect, useState } from 'react'
import type { Game } from '../types/Game'
import { useParams } from 'react-router-dom'
import gameService from '../services/games'

const GameInfo = () => {
  const { id } = useParams()
  const [game, setGame] = useState<Game>()

  useEffect(() => {
    gameService.getGameById(id!).then((data) => setGame(data))
  }, [id])

  if (!game)
    return <p>Loading game info...</p>

  return (
    <div className="game-info-page">
      {/* Cover + header */}
      <div className="game-header">
        <img
          src={game.cover}
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
          <p className="game-rating">
            ⭐ {game.rating.average_score.toFixed(1)} (
            {game.rating.total_reviews} reviews)
          </p>
        </div>
      </div>

      {/* Description */}
      <section className="game-description">
        <h2>Description</h2>
        <p>{game.description}</p>
      </section>

      {/* Genres & Platforms */}
      <section className="game-meta">
        <h2>Details</h2>
        <p><strong>Genres:</strong> {game.genres.join(', ')}</p>
        <p><strong>Platforms:</strong> {game.platforms.join(', ')}</p>
      </section>

      {/* Durations */}
      <section className="game-duration">
        <h2>How long to beat?</h2>
        <div>
          <span>Main Story: {game.average_duration.main_story}h</span>
          <br />
          <span>Main Story + Extras: {game.average_duration.main_plus_extras}h</span>
          <br />
          <span>Completionist: {game.average_duration.completionist}h</span>
        </div>
      </section>
    </div>
  )
}

export default GameInfo