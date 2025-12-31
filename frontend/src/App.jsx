import './App.css'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import NotFoundPage from './pages/NotFoundPage'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './components/DashboardLayout'
import Dashboard from './pages/dashboard/Dashboard'
// Patient pages
import MyRecords from './pages/dashboard/patient/MyRecords'
import GrantAccess from './pages/dashboard/patient/GrantAccess'
// Doctor pages
import MyPatients from './pages/dashboard/doctor/MyPatients'
import AddRecord from './pages/dashboard/doctor/AddRecord'
import PatientRecords from './pages/dashboard/doctor/PatientRecords'

// Layout component that conditionally shows Navbar/Footer
const Layout = ({ children }) => {
  const location = useLocation()
  const hideNavFooter = ['/login', '/signup'].includes(location.pathname) || location.pathname.startsWith('/dashboard')

  return (
    <div className="min-h-screen flex flex-col">
      {!hideNavFooter && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {!hideNavFooter && <Footer />}
    </div>
  )
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/records"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <MyRecords />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/access"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <GrantAccess />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Doctor Routes */}
          <Route
            path="/dashboard/patients"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <MyPatients />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/add-record"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <AddRecord />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/patient/:patientId/records"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <PatientRecords />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* 404 Catch-all Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
