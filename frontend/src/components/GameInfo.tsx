import { useEffect, useState } from 'react'
import type { Game } from '../types/Game'
import { useParams } from 'react-router-dom'
import gameService from '../services/games'
import '../styles/GameInfo.css'

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
    </div>
  )
}

export default GameInfo