import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const rootElement = document.getElementById('root');
rootElement.className = 'bg-gray-50 min-h-screen';

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
