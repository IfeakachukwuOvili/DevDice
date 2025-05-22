import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoutes';
import RollChallenge from './components/RollChallenge';
import MyChallenges from './components/MyChallenges';
import AdminAddChallenge from './components/AdminAddChallenge';
import TopBar from './components/TopBar';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';

function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 px-2 sm:px-4">
      <div className="max-w-3xl mx-auto py-8 space-y-8">
        <RollChallenge />
        <MyChallenges />
      </div>
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  // Hide TopBar on auth pages
  const hideTopBarPaths = ['/login', '/signup', '/forgot-password'];
  const shouldShowTopBar = !hideTopBarPaths.includes(location.pathname);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors">
      {shouldShowTopBar && <TopBar />}
      <div className={shouldShowTopBar ? 'pt-16' : ''}>
        <Routes>
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminAddChallenge />
              </ProtectedRoute>
            }
          />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}