import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';

const layoutStyle = {
  display: 'flex',
  minHeight: '100vh',
  background: '#f1f5f9',
};

/**
 * AdminLayout
 * Envuelve todas las rutas del admin con el sidebar lateral.
 * Usa <Outlet /> de React Router para renderizar la página activa.
 *
 * Uso en AppRoutes.jsx:
 *   <Route path="/admin" element={<AdminLayout />}>
 *     <Route path="dashboard" element={<AdminDashboard />} />
 *     <Route path="destinos" element={<AdminDestinations />} />
 *     <Route path="destinos/nuevo" element={<DestinationForm />} />
 *     <Route path="destinos/editar/:id" element={<DestinationForm />} />
 *     <Route path="paquetes" element={<AdminPackages />} />
 *     <Route path="paquetes/nuevo" element={<PackageForm />} />
 *     <Route path="paquetes/editar/:id" element={<PackageForm />} />
 *     <Route path="reservaciones" element={<AdminReservations />} />
 *     <Route path="usuarios" element={<AdminUsers />} />
 *   </Route>
 */
function AdminLayout() {
  return (
    <div style={layoutStyle}>
      <AdminSidebar />
      <main style={{ flex: 1, overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
