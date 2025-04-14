import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ChecklistProvider } from './contexts/ChecklistContext';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Checklist from './pages/Checklist';
import Mail from './pages/Mail';
import { Login } from './pages/Login';
import Callback from './pages/Callback';
import About from './pages/About';
import './App.css';
import { theme } from './theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthCallback from './pages/AuthCallback';
import { initGA, logPageView } from './utils/analytics';

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { auth } = useAuth();
  return auth.isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};

const queryClient = new QueryClient();

const App: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Initialize Google Analytics
    initGA();
  }, []);

  useEffect(() => {
    // Log page views on route changes
    logPageView(location.pathname + location.search);
  }, [location]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/auth/callback" element={<Callback />} />
                <Route
                  path="/mail"
                  element={
                    <ProtectedRoute>
                      <Mail />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
