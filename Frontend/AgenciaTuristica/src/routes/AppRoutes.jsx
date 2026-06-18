import { Route, Routes, Navigate } from 'react-router-dom'
import Home from '../pages/public/Home.jsx'
import Login from '../pages/public/Login.jsx'
import NotFound from '../pages/public/NotFound.jsx'
import Register from '../pages/public/Register.jsx'
import AdminLayout from '../pages/admin/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashBoard';
import AdminDestinations from '../pages/admin/AdminDestinations';
import DestinationForm from '../pages/admin/DestinationForms';
import AdminPackages from '../pages/admin/AdminPackages';
import PackageForm from '../pages/admin/PackageForm';
import AdminReservations from '../pages/admin/AdminReservations';
import AdminUsers from '../pages/admin/AdminUsers';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<NotFound />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="destinos" element={<AdminDestinations />} />
        <Route path="destinos/nuevo" element={<DestinationForm />} />
        <Route path="destinos/editar/:id" element={<DestinationForm />} />
        <Route path="paquetes" element={<AdminPackages />} />
        <Route path="paquetes/nuevo" element={<PackageForm />} />
        <Route path="paquetes/editar/:id" element={<PackageForm />} />
        <Route path="reservaciones" element={<AdminReservations />} />
        <Route path="usuarios" element={<AdminUsers />} />
      </Route>

    </Routes>
  )
}

export default AppRoutes;