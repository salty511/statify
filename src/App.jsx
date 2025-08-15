import React, { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useStore } from './store/useStore'
import { useSpotifyData } from './hooks/useSpotifyData'
import queryString from "query-string"

// Components
import MainPage from "./components/main-page.jsx"
import NavBar from "./components/nav-bar.jsx"
import LoginPage from "./components/login-page.jsx"
import AboutPage from "./components/about-page.jsx"
import AudioFeaturesPage from "./components/audio-features-page.jsx"

// Chart.js configuration for React 18
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
} from 'chart.js'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
)

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function AppContent() {
  const { accessToken, setAccessToken } = useStore()
  
  // Initialize data fetching
  useSpotifyData()

  useEffect(() => {
    // Parse access token from URL on mount
    const parsed = queryString.parse(window.location.search)
    if (parsed.access_token) {
      setAccessToken(parsed.access_token)
    }
  }, [setAccessToken])

  return (
    <div className="App">
      <Router>
        <NavBar />
        <Routes>
          <Route 
            path="/" 
            element={
              accessToken ? (
                <MainPage />
              ) : (
                <LoginPage />
              )
            } 
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/audio-features" element={<AudioFeaturesPage />} />
        </Routes>
      </Router>
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  )
}

export default App
