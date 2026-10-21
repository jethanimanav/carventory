import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Cars from './pages/Cars'
import CarDetails from './pages/CarDetails'
import Login from './pages/Login'
import Register from './pages/Register'
import Favourites from './pages/Favourites'
import Compare from './pages/Compare'
import AdminDashboard from './pages/AdminDashboard'
import AdminLogin from './pages/AdminLogin'
import AdminInventory from './pages/AdminInventory'
import AdminEnquiries from './pages/AdminEnquiries'
import { useAuth } from './context/AuthContext'
import Chat from './pages/Chat'

function AdminRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
	<Route path="/chat" element={<Chat />} />
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/cars/:carId" element={<CarDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/favourites" element={<Favourites />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/inventory" element={<AdminRoute><AdminInventory /></AdminRoute>} />
        <Route path="/admin/cars/new" element={<AdminRoute><AdminInventory /></AdminRoute>} />
        <Route path="/admin/cars/:carId/edit" element={<AdminRoute><AdminInventory /></AdminRoute>} />
        <Route path="/admin/enquiries" element={<AdminRoute><AdminEnquiries /></AdminRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
