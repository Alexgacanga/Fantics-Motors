import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { preloadPublicVehicles } from './services/api.js'

if (window.location.pathname === '/') {
  preloadPublicVehicles().catch((error) => {
    console.error('Unable to preload public vehicles.', error)
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
