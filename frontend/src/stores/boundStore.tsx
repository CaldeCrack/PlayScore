import { create } from 'zustand'
import createUserSlice from './userSlice'
import createGameSlice from './gameSlice'

const useBoundStore = create(() => ({
  ...createUserSlice(),
  ...createGameSlice()
}))

export default useBoundStore
