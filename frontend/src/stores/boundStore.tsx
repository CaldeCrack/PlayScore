import { create } from 'zustand'
import { type UserState, createUserSlice } from './userSlice'
import { type GameState, createGameSlice } from './gameSlice'
import { type ToastState, createToastSlice } from './toastSlice'
import { persist } from 'zustand/middleware'

export const useBoundStore = create<UserState & GameState & ToastState>()(
  persist((...a) => ({
    ...createUserSlice(...a),
    ...createGameSlice(...a),
    ...createToastSlice(...a)
  }), { name: 'bound-store' })
)
