import { useEffect, useState } from 'react'
import '../styles/GameDisplay.css'
import gameService from '../services/games'
import type { Game } from '../types/Game'
import type { Rating } from '../types/Rating'
import { Link } from 'react-router-dom'

interface Props {
  game: Game
}

const GameDisplay = ({ game }: Props) => {
  const [ratings, setRatings] = useState<Rating[]>([]);

  useEffect(()=>{
    gameService.getGameRatings(game.id.toString())
    .then((data) => setRatings(data))
  }, [])

  return (
    <div className="game-display">
      {/* Cover */}
      <div className="game-cover-container">
        <img
          src={`/img/${game.cover_image}`}
          alt={`${game.title} cover`}
          className="game-cover"
        />
      </div>

      {/* Main info */}
      <div className="game-display-info">
        <h2 className="game-title">
          <Link to={`/games/${game.id}`}>
            {game.title} ({game.release_year})
          </Link>
        </h2>

        <p className="game-meta">
          <span className="publisher">{game.publisher}</span> •{' '}
          <span className="platforms">{game.platforms.join(', ')}</span>
        </p>

        <p className="game-rating">
          ⭐ 
          { ratings.length == 0 ? 
            "No reviews yet"
          :
            `${(ratings.reduce((acc: number, curr: Rating) => acc + curr.score, 0) / ratings.length).toFixed(1)} (${ratings.length} reviews)`
          }
        </p>

        <p className="game-duration">
          ⏱ Main Story: {game.average_duration.main_story}h
        </p>

        <p className="game-genres">{game.genres.join(', ')}</p>
      </div>
    </div>
  )
}

export default GameDisplay
