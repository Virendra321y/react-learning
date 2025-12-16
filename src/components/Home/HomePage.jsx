import React from 'react'
import '../../styles/home.css'

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <span className="hero-badge">Ready for Liftoff 🚀</span>
          <h2>Welcome to LaunchPad</h2>
          <p>Your gateway to exploring the universe of UI development.</p>
          <div className="hero-actions">
            <button className="cta">Start Mission</button>
            <button className="muted">Flight Manual</button>
          </div>
        </div>
      </section>

      <section className="info-grid">
        <div className="info-item">
          <span className="big-icon">🌌</span>
          <h3>Infinite Scale</h3>
          <p>Built for expansion across the galaxy.</p>
        </div>
        <div className="info-item">
          <span className="big-icon">⚡</span>
          <h3>Warp Speed</h3>
          <p>Optimized for zero-latency performance.</p>
        </div>
        <div className="info-item">
          <span className="big-icon">🛡️</span>
          <h3>Hull Casing</h3>
          <p>Fortified security for deep space travel.</p>
        </div>
      </section>

      <section className="cards">
        <article className="card">
          <h3>Booster Stage</h3>
          <p>Initial propulsion systems for heavy lift capabilities.</p>
        </article>
        <article className="card">
          <h3>Orbital Mechanics</h3>
          <p>Precision calculation for stable orbits.</p>
        </article>
        <article className="card">
          <h3>Re-entry</h3>
          <p>Safe return protocols and heat management.</p>
        </article>
      </section>
    </>
  )
}
