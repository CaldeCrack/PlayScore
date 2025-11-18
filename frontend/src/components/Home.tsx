import { useEffect } from 'react'
import type Game from '../types/Game'
import GameDisplay from './GameDisplay'
import gameService from '../services/games'
import { useBoundStore } from '../stores/boundStore'
import Box from '@mui/material/Box'


const Home = () => {
  const { games, setGames } = useBoundStore()

  useEffect(() => {
    gameService
      .getAllGames()
      .then((data) => setGames(data))
  }, [])

  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'space-evenly', mb: 1 }}>
      {games.length
        ? games.map((game: Game) => <GameDisplay key={ game.id } game={ game } />)
        : 'No games found'
      }
    </Box>
  )
}

export default Home