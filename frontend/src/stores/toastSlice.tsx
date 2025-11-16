import type { StateCreator } from 'zustand'


type SeverityList = 'error' | 'info' | 'success' | 'warning'

export type ToastState = {
  message: string
  severity: SeverityList
  open: boolean
  setMessage: (_text: string) => void
  setSeverity: (_text: SeverityList) => void
  toggleOn: () => void
  toggleOff: () => void
}

export const createToastSlice: StateCreator<ToastState> = (set) => ({
  message: '',
  severity: 'success',
  open: false,
  setMessage: (text: string) => set({ message: text }),
  setSeverity: (text: SeverityList) => set({ severity: text }),
  toggleOn: () => set({ open: true }),
  toggleOff: () => set({ open: false })
})
