import { create } from 'zustand'
import { type UserState, createUserSlice } from './userSlice'
import { type GameState, createGameSlice } from './gameSlice'

export const useBoundStore = create<UserState & GameState>()((...a) => ({
  ...createUserSlice(...a),
  ...createGameSlice(...a)
}))
