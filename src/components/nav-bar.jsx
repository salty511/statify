import React from "react"
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'

const NavBar = () => {
  const { accessToken, logout } = useStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="navbar navbar-expand navbar-dark bg-dark">
      <div className="container">
        <span className="navbar-brand">Statify</span>
        <div className="collapse navbar-collapse" id="navbarColor02">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                {accessToken ? 'Home' : 'Login'}
              </Link>
            </li>
            {accessToken && (
              <>
                <li className="nav-item">
                  <Link to="/audio-features" className="nav-link">
                    Audio Features
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/about" className="nav-link">
                    About
                  </Link>
                </li>
              </>
            )}
          </ul>
          {accessToken && (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <button 
                  type="button" 
                  className="btn btn-outline-danger btn-sm" 
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default NavBar
