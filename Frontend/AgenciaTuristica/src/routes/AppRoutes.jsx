import { Route, Routes } from 'react-router-dom'
import Home from '../pages/public/Home.jsx'
import Login from '../pages/public/Login.jsx'
import NotFound from '../pages/public/NotFound.jsx'
import PackageDetail from '../pages/public/PackageDetail.jsx'
import Packages from '../pages/public/Packages.jsx'
import Register from '../pages/public/Register.jsx'
import Checkout from '../pages/users/Checkout.jsx'
import MyReservations from '../pages/users/MyReservations.jsx'
import Profile from '../pages/users/Profile.jsx'
import ReservationDetail from '../pages/users/ReservationDetail.jsx'
import ReservationSuccess from '../pages/users/ReservationSuccess.jsx'
import UserDashboard from '../pages/users/UserDashboard.jsx'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/packages" element={<Packages />} />
      <Route path="/packages/:packageId" element={<PackageDetail />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/register" element={<Register />} />
      <Route path="/user" element={<UserDashboard />} />
      <Route path="/reservations" element={<MyReservations />} />
      <Route path="/reservations/checkout" element={<Checkout />} />
      <Route path="/reservations/success" element={<ReservationSuccess />} />
      <Route path="/reservations/:reservationId" element={<ReservationDetail />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
