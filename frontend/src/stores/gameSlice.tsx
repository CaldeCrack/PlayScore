import type { StateCreator } from 'zustand'
import type Game from '../types/Game'

export type GameState = {
  games: Game[]
  addGame: (_game: Game) => void
}

export const createGameSlice: StateCreator<GameState> = (set) => ({
  games: [],
  addGame: (game: Game) => set((state) => ({ games: state.games.concat(game) }))
})
