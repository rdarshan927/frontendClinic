import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './components/Toast'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import DoctorsPage from './pages/DoctorsPage'
import DoctorDetailPage from './pages/DoctorDetailPage'
import AddDoctorPage from './pages/AddDoctorPage'
import AddSlotPage from './pages/AddSlotPage'
import MySchedulePage from './pages/MySchedulePage'
import DoctorApplicationsPage from './pages/DoctorApplicationsPage'

function Layout({ children }) {
    return (
        <div className="page-wrapper">
            <Navbar />
            {children}
        </div>
    )
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <ToastProvider>
                    <Routes>
                        {/* Public routes */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />

                        {/* Protected routes - Doctor Service*/}
                        <Route path="/dashboard" element={<ProtectedRoute><Layout><DashboardPage /></Layout></ProtectedRoute> }/>
                        <Route path="/doctors" element={<ProtectedRoute><Layout><DoctorsPage /></Layout></ProtectedRoute>} />
                        <Route path="/doctors/new" element={<ProtectedRoute roles={['ADMIN', 'RECEPTIONIST', 'DOCTOR']}><Layout><AddDoctorPage /></Layout></ProtectedRoute>} />
                        <Route path="/doctors/:id" element={<ProtectedRoute><Layout><DoctorDetailPage /></Layout></ProtectedRoute>} />
                        <Route path="/doctors/:id/slots/new" element={<ProtectedRoute roles={['ADMIN', 'RECEPTIONIST', 'DOCTOR']}><Layout><AddSlotPage /></Layout></ProtectedRoute>} />
                        <Route path="/my-schedule" element={<ProtectedRoute roles={['DOCTOR']}><Layout><MySchedulePage /></Layout></ProtectedRoute>} />
                        <Route path="/doctor-applications" element={<ProtectedRoute roles={['ADMIN', 'RECEPTIONIST']}><Layout><DoctorApplicationsPage /></Layout></ProtectedRoute>} />

                        {/* Fallbacks */ }
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                </ToastProvider>
            </AuthProvider>
        </BrowserRouter>
    )
}
