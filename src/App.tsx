import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { auth } = useAuth();
  return auth.isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AuthProvider>
            <ChecklistProvider>
              <Layout>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/auth/callback" element={<Callback />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/" element={<Home />} />
                  <Route path="/checklist" element={<Checklist />} />
                  <Route 
                    path="/mail" 
                    element={
                      <PrivateRoute>
                        <Mail />
                      </PrivateRoute>
                    } 
                  />
                </Routes>
              </Layout>
            </ChecklistProvider>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
