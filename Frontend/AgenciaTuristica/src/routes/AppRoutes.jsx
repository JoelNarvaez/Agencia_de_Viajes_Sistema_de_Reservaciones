import { Route, Routes, Navigate } from 'react-router-dom'
import Home from '../pages/public/Home.jsx'
import Login from '../pages/public/Login.jsx'
import NotFound from '../pages/public/NotFound.jsx'
import PackageDetail from '../pages/public/PackageDetail.jsx'
import Packages from '../pages/public/Packages.jsx'
import Register from '../pages/public/Register.jsx'
import AdminLayout from '../pages/admin/AdminLayout';
import AdminPackages from '../pages/admin/AdminPackages';
import PackageForm from '../pages/admin/PackageForm';
import AdminReservations from '../pages/admin/AdminReservations';
import Checkout from '../pages/users/Checkout.jsx'
import MyReservations from '../pages/users/MyReservations.jsx'
import Profile from '../pages/users/Profile.jsx'
import ReservationDetail from '../pages/users/ReservationDetail.jsx'
import ReservationSuccess from '../pages/users/ReservationSuccess.jsx'
import UserDashboard from '../pages/users/UserDashboard.jsx'
import About from '../pages/public/About.jsx'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/packages" element={<Packages />} />
      <Route path="/packages/:packageId" element={<PackageDetail />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<AdminDashBoard />} />
      <Route path="/user" element={<UserDashboard />} />
      <Route path="/reservations" element={<MyReservations />} />
      <Route path="/reservations/checkout" element={<Checkout />} />
      <Route path="/reservations/success" element={<ReservationSuccess />} />
      <Route path="/reservations/:reservationId" element={<ReservationDetail />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/about" element={<About />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="paquetes" replace />} />
        <Route path="paquetes" element={<AdminPackages />} />
        <Route path="paquetes/nuevo" element={<PackageForm />} />
        <Route path="paquetes/editar/:id" element={<PackageForm />} />
        <Route path="reservaciones" element={<AdminReservations />} />
      </Route>

    </Routes>
  )
}

export default AppRoutes;