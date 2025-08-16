import { create } from 'zustand'

export const useStore = create((set, get) => ({
  // User state
  user: null,
  accessToken: null,
  
  // Music data state
  shortTerm: null,
  mediumTerm: null,
  longTerm: null,
  
  // UI state
  currentDataSet: 'mediumTerm',
  playStatus: 'STOPPED', // STOPPED, PLAYING, PAUSED
  previewURL: null,
  
  // Actions
  setAccessToken: (token) => set({ accessToken: token }),
  
  setUser: (userData) => set({ user: userData }),
  
  setMusicData: (timeRange, data) => {
    const state = get()
    switch (timeRange) {
      case 'short_term':
        set({ shortTerm: data })
        break
      case 'medium_term':
        set({ mediumTerm: data })
        break
      case 'long_term':
        set({ longTerm: data })
        break
      default:
        break
    }
  },
  
  setCurrentDataSet: (dataSet) => set({ currentDataSet: dataSet }),
  
  setPlayStatus: (status) => set({ playStatus: status }),
  
  setPreviewURL: (url) => set({ previewURL: url }),
  
  logout: () => set({ 
    accessToken: null, 
    user: null, 
    shortTerm: null, 
    mediumTerm: null, 
    longTerm: null 
  }),
  
  // Computed values
  getCurrentDataSet: () => {
    const state = get()
    switch (state.currentDataSet) {
      case 'shortTerm':
        return state.shortTerm
      case 'mediumTerm':
        return state.mediumTerm
      case 'longTerm':
        return state.longTerm
      default:
        return state.mediumTerm
    }
  }
}))
