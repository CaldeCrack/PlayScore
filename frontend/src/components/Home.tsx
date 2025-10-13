import { useEffect, useState } from 'react'
import type Game from '../types/Game'
import GameDisplay from './GameDisplay'
import gameService from '../services/games'
import '../styles/Home.css'

const Home = () => {
  const [games, setGames] = useState<Game[]>([])

  useEffect(() => {
    gameService
      .getAllGames()
      .then((data) => setGames(data))
  }, [])

  return (
    <>
      <h1 className='title'>PlayScore</h1>
      {games.map((game: Game) => <GameDisplay key={ game.id } game={ game } />)}
    </>
  )
}

export default Home