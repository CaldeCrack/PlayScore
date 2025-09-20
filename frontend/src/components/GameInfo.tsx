import { useEffect, useState } from 'react'
import type { Game } from '../types/Game'
import { useParams } from 'react-router-dom'
import gameService, { postNewRating } from '../services/games'
import '../styles/GameInfo.css'
import type { Rating } from '../types/Rating'

const GameInfo = () => {
  const { id } = useParams();
  const [game, setGame] = useState<Game>();
  const [ratings, setRatings] = useState<Rating[]>([]);

  const [userScore, setUserScore] = useState<number>(5.0);
  const [showScoreInput, setShowScoreInput] = useState<boolean>(false);

  
  const onUserScoreChange  = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserScore(parseFloat(event.target.value))
  };

  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await postNewRating(game!.id, userScore);
    setShowScoreInput(false);
    gameService.getGameRatings(id!).then((data) => setRatings(data))
  }  
  
  useEffect(() => {
    gameService.getGameById(id!).then((data) => setGame(data))
    gameService.getGameRatings(id!).then((data) => setRatings(data))
  }, [id]);

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
          <div className="game-rating">
            ⭐ 
            { ratings.length == 0 ? 
              "No reviews yet"
            :
            `${(ratings.reduce((acc: number, curr: Rating) => acc + curr.score, 0) / ratings.length).toFixed(1)} (${ratings.length} reviews)`
            }

            {
              !showScoreInput ? 
                <button className="rate-btn" type="button" onClick={() => setShowScoreInput(!showScoreInput)}>rate</button>
              : 
                <form onSubmit={ onSubmitHandler } className="rate-form">
                  <input 
                    type="number"
                    min="1"
                    max="10"
                    step="0.1"
                    value={ userScore }
                    onChange={ onUserScoreChange }  
                  ></input>
                  <button className="rate-btn" type="submit">send</button>
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
    </div>
  )
}

export default GameInfo