import React from "react"

const LoginPage = ({ accessToken }) => {

  const handleLogin = () => {

    const authUrl = process.env.VITE_LOGIN_URL || "http://localhost:9000/.netlify/functions/api/login"
    window.location.href = authUrl
  }


  return (
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
