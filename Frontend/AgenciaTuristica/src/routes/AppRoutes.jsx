import { Route, Routes } from 'react-router-dom'
import Home from '../pages/public/Home.jsx'
import Login from '../pages/public/Login.jsx'
import NotFound from '../pages/public/NotFound.jsx'
import PackageDetail from '../pages/public/PackageDetail.jsx'
import Packages from '../pages/public/Packages.jsx'
import Register from '../pages/public/Register.jsx'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/packages" element={<Packages />} />
      <Route path="/packages/:packageId" element={<PackageDetail />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
