import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AuthPage from './pages/auth/AuthPage'
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


function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />

      {/* Auth */}
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/auth/login" element={<AuthPage view="login" />} />
      <Route path="/auth/register" element={<AuthPage view="register" />} />
      <Route path="/auth/forgot-password" element={<AuthPage view="forgot" />} />

      {/* Admin portal — nested under shared layout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminOverview />} />
        <Route path="patients" element={<PatientList />} />
        <Route path="patients/update" element={<UpdateClinicalRecord />} />
        <Route path="patients/:uuid" element={<PatientDetails />} />
        <Route path="emergencies" element={<EmergencyCases />} />
      </Route>
      {/* Patient */}
      <Route path="/patient/dashboard" element={<PatientDashboard />} />
      <Route path="/patient/log" element={<PatientLog />} />
      <Route path="/patient/chat" element={<PatientChat />} />
      <Route path="/patient/reports" element={<PatientReports />} />
      <Route path="/patient/notifications" element={<PatientNotifications />} />
      <Route path="/patient/settings" element={<PatientSettings />} />
    </Routes>
  )
}

export default App