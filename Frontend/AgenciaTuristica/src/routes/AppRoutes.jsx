import { Route, Routes, Navigate } from 'react-router-dom'
import Home from '../pages/public/Home.jsx'
import Login from '../pages/public/Login.jsx'
import NotFound from '../pages/public/NotFound.jsx'
import Register from '../pages/public/Register.jsx'
import AdminLayout from '../pages/admin/AdminLayout';
import AdminPackages from '../pages/admin/AdminPackages';
import PackageForm from '../pages/admin/PackageForm';
import AdminReservations from '../pages/admin/AdminReservations';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<NotFound />} />

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