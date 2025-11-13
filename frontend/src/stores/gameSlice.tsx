import { create } from 'zustand'
import type Game from '../types/Game'

type GameState = {
  games: Game[]
  addGame: (_game: Game) => void
}

const createGameSlice = create<GameState>((set) => ({
  games: [],
  addGame: (game: Game) => set((state) => ({ games: state.games.concat(game) }))
}))

export default createGameSlice
