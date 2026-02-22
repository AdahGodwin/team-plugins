import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AuthPage from './pages/auth/AuthPage'
import Unauthorized from './pages/Unauthorized'
import AdminLayout from './components/admin/AdminLayout'
import AdminOverview from './pages/admin/AdminOverview'
import PatientList from './pages/admin/PatientList'
import PatientDetails from './pages/admin/PatientDetails'
import UpdateClinicalRecord from './pages/admin/UpdateClinicalRecord'
import EmergencyCases from './pages/admin/EmergencyCases'
import PatientDashboard from './pages/patient/PatientDashboard'
import PatientLog from './pages/patient/PatientLog'
import PatientNotifications from './pages/patient/PatientNotifications'
import PatientChat from './pages/patient/PatientChat'
import PatientReports from './pages/patient/PatientReports'
import PatientSettings from './pages/patient/PatientSettings'
import RouteLoader from './components/common/RouteLoader'
import ProtectedRoute from './components/common/ProtectedRoute'
import GuestRoute from './components/common/GuestRoute'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <RouteLoader>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Auth — guests only (redirect away if already logged in) */}
          <Route element={<GuestRoute />}>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/auth/login" element={<AuthPage view="login" />} />
            <Route path="/auth/register" element={<AuthPage view="register" />} />
            <Route path="/auth/forgot-password" element={<AuthPage view="forgot" />} />
          </Route>

          {/* Admin portal — must be logged in AND have role="admin" */}
          <Route element={<ProtectedRoute role="admin" />}>
            <Route path="/portal" element={<AdminLayout />}>
              <Route index element={<AdminOverview />} />
              <Route path="patients" element={<PatientList />} />
              <Route path="patients/update" element={<UpdateClinicalRecord />} />
              <Route path="patients/:uuid" element={<PatientDetails />} />
              <Route path="emergencies" element={<EmergencyCases />} />
            </Route>
          </Route>

          {/* Patient dashboard — must be logged in AND have role="patient" */}
          <Route element={<ProtectedRoute role="patient" />}>
            <Route path="/dashboard" element={<PatientDashboard />} />
            <Route path="/dashboard/log" element={<PatientLog />} />
            <Route path="/dashboard/chat" element={<PatientChat />} />
            <Route path="/dashboard/reports" element={<PatientReports />} />
            <Route path="/dashboard/notifications" element={<PatientNotifications />} />
            <Route path="/dashboard/settings" element={<PatientSettings />} />
          </Route>
        </Routes>
      </RouteLoader>
    </AuthProvider>
  )
}

export default App