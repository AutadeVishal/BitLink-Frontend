import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Add dark background to root element to prevent white flash
const rootElement = document.getElementById('root');
rootElement.className = 'bg-gray-900 min-h-screen';

createRoot(rootElement).render(
 // <StrictMode>
    <App />
 // </StrictMode>,
)
