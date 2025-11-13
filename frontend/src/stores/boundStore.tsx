import { create } from 'zustand'
import { type UserState, createUserSlice } from './userSlice'
import { type GameState, createGameSlice } from './gameSlice'
import { persist } from 'zustand/middleware'

export const useBoundStore = create<UserState & GameState>()(
  persist((...a) => ({
    ...createUserSlice(...a),
    ...createGameSlice(...a)
  }), { name: 'bound-store' })
)
