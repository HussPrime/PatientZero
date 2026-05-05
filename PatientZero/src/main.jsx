// Purpose: Browser entry point that mounts the React application into the Vite HTML root.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import './styles/layout.css'
import './styles/components.css'
import App from './App.jsx'

// Creates the React root and enables StrictMode checks during development.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
