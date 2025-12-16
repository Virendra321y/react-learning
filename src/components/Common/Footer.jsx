import React from 'react'

function IconGitHub() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .5C5.73.5.75 5.48.75 11.76c0 4.93 3.19 9.11 7.61 10.59.56.1.77-.24.77-.54 0-.27-.01-1-.02-1.96-3.09.67-3.74-1.49-3.74-1.49-.5-1.28-1.23-1.62-1.23-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15.99 1.7 2.6 1.21 3.24.92.1-.72.39-1.21.71-1.49-2.47-.28-5.07-1.24-5.07-5.53 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.4.11-2.92 0 0 .94-.3 3.08 1.15a10.73 10.73 0 012.8-.38c.95.01 1.9.13 2.8.38 2.14-1.45 3.07-1.15 3.07-1.15.61 1.52.23 2.64.12 2.92.72.78 1.15 1.78 1.15 3 0 4.3-2.6 5.25-5.08 5.53.4.35.76 1.05.76 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.2.65.78.54C19.07 20.87 22.25 16.69 22.25 11.76 22.25 5.48 17.27.5 11 .5z" />
    </svg>
  )
}

function IconLinkedIn() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.63v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.07 1.4-2.07 2.86v5.49H8.86V9h3.49v1.56h.05c.49-.93 1.7-1.91 3.5-1.91 3.74 0 4.43 2.46 4.43 5.66v6.14zM5.34 7.43a2.11 2.11 0 110-4.22 2.11 2.11 0 010 4.22zM7.16 20.45H3.5V9h3.66v11.45z" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="brand-copy">© {new Date().getFullYear()} React Learning</div>

        <div className="footer-actions">
          <div className="footer-links">Built with care • Accessibility minded</div>

          <div className="socials">
            <a href="https://github.com/Virendra321y" aria-label="GitHub" className="social-link" target="_blank" rel="noopener noreferrer">
              <IconGitHub />
            </a>
            <a href="https://www.linkedin.com/in/virendra-yadav-5652091b8/" aria-label="LinkedIn" className="social-link" target="_blank" rel="noopener noreferrer">
              <IconLinkedIn />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
