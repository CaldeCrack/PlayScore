import type { StateCreator } from 'zustand'
import type Game from '../types/Game'

export type GameState = {
  games: Game[]
  setGames: (_games: Game[]) => void
  addGame: (_game: Game) => void
}

export const createGameSlice: StateCreator<GameState> = (set) => ({
  games: [],
  setGames: (games: Game[]) => set({ games: games }),
  addGame: (game: Game) => set((state) => ({ games: state.games.concat(game) }))
})
