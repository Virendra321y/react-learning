import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = () => setIsLoggedIn(true)
  const handleLogout = () => setIsLoggedIn(false)

  // Mock registration: alert and show login state (or jump to logged in)
  const handleSignUp = () => {
    alert("Registration successful! You are now logged in.")
    setIsLoggedIn(true)
  }

  return (
    <header className="app-header">
      <div className="container">
        <Link
          to="/"
          className="brand"
          aria-label="Go to homepage"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <span className="logo" role="img" aria-label="Rocket">🚀</span>
          <h1 className="title">LaunchPad</h1>
        </Link>

        <nav className="header-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Home
          </NavLink>

          <NavLink
            to="/category"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Category
          </NavLink>

          {!isLoggedIn ? (
            <>
              <button className="btn signup" onClick={handleSignUp}>Sign Up</button>
              <button className="btn login" onClick={handleLogin}>Login</button>
            </>
          ) : (
            <button className="btn logout" onClick={handleLogout}>Logout</button>
          )}
        </nav>
      </div>
    </header>
  )
}
