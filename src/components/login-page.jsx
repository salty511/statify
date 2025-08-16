import React from "react"

const LoginPage = ({ accessToken }) => {

  const handleLogin = () => {

    const authUrl = process.env.VITE_LOGIN_URL || "http://localhost:9000/.netlify/functions/api/login"

    window.location.href = authUrl
  }


  return (
 /*    <div className="container text-center mt-5">
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
    </div> */

    <div className="container" style={{paddingTop: "30px", textAlign: "left"}}>
      <h1 className="display-3">Welcome to Statify</h1>
      <p className="lead">This website provides interesting statistics specific to your Spotify account</p>
        <hr className="my-4" />
        <p>It uses the Spotify API to access account data such as your Top Tracks & Artists, You can login to Spotify here</p>
        <p className="lead">
            {!accessToken ?
                <button 
                className="btn btn-success btn-lg" 
                onClick={handleLogin}
              >
                Login with Spotify
              </button>
            : <p>Already Logged in</p>}
      </p>
    </div>
  )
}

export default LoginPage
