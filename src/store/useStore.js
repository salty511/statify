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
  
  // Preview URL cache - maps trackId to preview URL
  previewUrlCache: new Map(),
  
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
  
  // Cache a preview URL for a track
  cachePreviewUrl: (trackId, previewUrl) => {
    const state = get()
    const newCache = new Map(state.previewUrlCache)
    
    // Optional: Limit cache size to prevent memory issues
    const MAX_CACHE_SIZE = 100
    if (newCache.size >= MAX_CACHE_SIZE) {
      // Remove oldest entries (first in Map)
      const firstKey = newCache.keys().next().value
      newCache.delete(firstKey)
    }
    
    newCache.set(trackId, previewUrl)
    set({ previewUrlCache: newCache })
  },
  
  // Get cached preview URL for a track
  getCachedPreviewUrl: (trackId) => {
    const state = get()
    return state.previewUrlCache.get(trackId)
  },
  
  // Clear cache (useful for logout)
  clearPreviewUrlCache: () => set({ previewUrlCache: new Map() }),
  
  logout: () => set({ 
    accessToken: null, 
    user: null, 
    shortTerm: null, 
    mediumTerm: null, 
    longTerm: null,
    previewUrlCache: new Map() // Clear cache on logout
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
