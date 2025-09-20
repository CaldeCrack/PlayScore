import { useEffect, useState } from 'react'
import type { Game } from '../types/Game'
import { useParams } from 'react-router-dom'
import gameService from '../services/games'

const GameInfo = () => {
  const { id } = useParams()
  const [game, setGame] = useState<Game>()

  useEffect(() => {
    gameService
      .getGameById(id!)
      .then((data) => setGame(data))
  }, [id])

  return (game &&
    <>
      <h1>{ game.title } ({ game.release_year })</h1>

      <span>Published by: { game.publisher } | Developed by: { game.developers.join(', ') }<br/></span>
      <span>{ game.rating.average_score } (from { game.rating.total_reviews } users)<br/></span>

      <br/>
      <span>{ game.description }<br/></span>
      <br/>

      <span>{ game.genres.join(', ') }<br/></span>
      <span>{ game.platforms.join(', ') }<br/></span>

      <br/>

      <h2>Duration</h2>
      <ul>
        <li key={0}>Main Story: { game.average_duration.main_story }</li>
        <li key={1}>Main Story and extras: { game.average_duration.main_plus_extras }</li>
        <li key={2}>Completionist: { game.average_duration.completionist }</li>
      </ul>
    </>
  )
}

export default GameInfo