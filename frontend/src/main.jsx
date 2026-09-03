import React from 'react'
import ReactDOM from 'react-dom/client'
import AppRouter from './router/AppRouter.jsx'
import './index.css'
import { Toaster } from 'sonner' // Changed to Toaster from sonner if we were using it

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRouter />
    <Toaster richColors position="top-right" />
  </React.StrictMode>,
)
