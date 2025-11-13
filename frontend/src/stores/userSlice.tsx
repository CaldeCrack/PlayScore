import { type StateCreator } from 'zustand'
import type User from '../types/User'


export type UserState = {
  user: User | null
  setUser: (_user: User | null) => void
}

export const createUserSlice: StateCreator<UserState> = (set) => ({
  user: null,
  setUser: (user: User | null) => set({ user: user }),
})
