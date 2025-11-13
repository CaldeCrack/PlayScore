import { create } from 'zustand'
import type User from '../types/User'
import loginService from '../services/login'

type UserState = {
  user: User | null
  logout: () => void
}

const createUserSlice = create<UserState>(() => ({
  user: null,
  logout: () => loginService.logout()
}))

export default createUserSlice
