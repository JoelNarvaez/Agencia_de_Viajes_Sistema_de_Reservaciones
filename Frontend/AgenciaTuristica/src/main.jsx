import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './context/AuthContext.jsx'
import ReservationProvider from './context/ReservationContext.jsx'
import './index.css'
import App from './App.jsx'

localStorage.removeItem('agencia_turistica_reservation_draft')

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ReservationProvider>
          <App />
        </ReservationProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)

