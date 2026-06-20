import { Outlet } from 'react-router-dom'
import AdminSideBar from '../../components/admin/AdminSideBar'
import styles from './AdminLayout.module.css'

function AdminLayout() {
  return (
    <div className={styles.layout}>
      <AdminSideBar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
