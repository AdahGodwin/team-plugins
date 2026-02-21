import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AuthPage from './pages/auth/AuthPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/auth/login" element={<AuthPage view="login" />} />
      <Route path="/auth/register" element={<AuthPage view="register" />} />
      <Route path="/auth/forgot-password" element={<AuthPage view="forgot" />} />
    </Routes>
  )
}

export default App