import React from 'react'

export default function RightNav({ open = false, onClose = () => {} }) {
  return (
    <nav className={`right-nav ${open ? 'open' : ''}`} aria-hidden={!open}>
      <div className="nav-inner">
        <button className="close-nav" onClick={onClose} aria-label="Close navigation">
          ×
        </button>

        <ul className="nav-list">
          <li><a href="#">Home</a></li>
          <li><a href="#">Category</a></li>
          <li><a href="#">Login</a></li>
          <li><a href="#">Logout</a></li>
          <li><a href="#">Profile</a></li>
        </ul>
      </div>
    </nav>
  )
}
