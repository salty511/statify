import React from "react"

const LoginPage = () => {
  const handleLogin = () => {
    const clientId = process.env.VITE_SPOTIFY_CLIENT_ID
    const redirectUri = process.env.VITE_SPOTIFY_REDIRECT_URI || 'http://localhost:3000'
    const scope = 'user-read-private user-read-email user-top-read user-read-recently-played'
    
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`
    
    window.location.href = authUrl
  }

  return (
    <div className="container text-center mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title mb-4">Welcome to Statify</h2>
              <p className="card-text mb-4">
                Discover insights about your Spotify listening habits. 
                Get detailed analytics about your top tracks, artists, and genres.
              </p>
              <button 
                className="btn btn-success btn-lg" 
                onClick={handleLogin}
              >
                Login with Spotify
              </button>
              <p className="text-muted mt-3">
                You'll be redirected to Spotify to authorize this application.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
