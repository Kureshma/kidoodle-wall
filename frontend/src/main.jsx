import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { setAuthToken } from './api/client'

const raw = localStorage.getItem('kidoodle_auth')
if (raw) {
  try {
    const { token } = JSON.parse(raw)
    if (token) setAuthToken(token)
  } catch {
    /* ignore */
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
