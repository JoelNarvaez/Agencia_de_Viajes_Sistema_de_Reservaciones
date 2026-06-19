import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Loader from '../components/common/Loader.jsx'
import ProtectedRoute from '../components/common/ProtectedRoute.jsx'

const About = lazy(() => import('../pages/public/About.jsx'))
const AdminDashBoard = lazy(() => import('../pages/admin/AdminDashBoard.jsx'))
const Checkout = lazy(() => import('../pages/users/Checkout.jsx'))
const Home = lazy(() => import('../pages/public/Home.jsx'))
const Login = lazy(() => import('../pages/public/Login.jsx'))
const MyReservations = lazy(() => import('../pages/users/MyReservations.jsx'))
const NotFound = lazy(() => import('../pages/public/NotFound.jsx'))
const PackageDetail = lazy(() => import('../pages/public/PackageDetail.jsx'))
const Packages = lazy(() => import('../pages/public/Packages.jsx'))
const Profile = lazy(() => import('../pages/users/Profile.jsx'))
const Register = lazy(() => import('../pages/public/Register.jsx'))
const ReservationDetail = lazy(() => import('../pages/users/ReservationDetail.jsx'))
const ReservationSuccess = lazy(() => import('../pages/users/ReservationSuccess.jsx'))
const UserDashboard = lazy(() => import('../pages/users/UserDashboard.jsx'))

const routeFallback = (
  <main style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
    <Loader text="Cargando pagina..." />
  </main>
)

function AppRoutes() {
  return (
    <Suspense fallback={routeFallback}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/packages/:packageId" element={<PackageDetail />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin">
            <Route index element={<AdminDashBoard />} />
            <Route path="packages" element={<AdminDashBoard />} />
            <Route path="reservations" element={<AdminDashBoard />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['user']} />}>
          <Route path="/user">
            <Route index element={<UserDashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="reservations" element={<MyReservations />} />
          </Route>
          <Route path="/profile" element={<Profile />} />
          <Route path="/reservations">
            <Route index element={<MyReservations />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="success" element={<ReservationSuccess />} />
            <Route path=":reservationId" element={<ReservationDetail />} />
          </Route>
        </Route>

        <Route path="/admin/*" element={<Navigate replace to="/admin" />} />
        <Route path="/user/*" element={<Navigate replace to="/user" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
