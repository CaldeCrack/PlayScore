import { useEffect } from 'react'
import type Game from '../types/Game'
import GameDisplay from './GameDisplay'
import gameService from '../services/games'
import '../styles/Home.css'
import { useBoundStore } from '../stores/boundStore'

const Home = () => {
  const { games, setGames } = useBoundStore()

  useEffect(() => {
    gameService
      .getAllGames()
      .then((data) => setGames(data))
  }, [])

  return games.map((game: Game) => <GameDisplay key={ game.id } game={ game } />)
}

export default Home