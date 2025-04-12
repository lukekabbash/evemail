import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import { CircularProgress, Box, Typography } from '@mui/material';

const Callback: React.FC = () => {
  const navigate = useNavigate();
  const { updateAuthState } = useAuth();

  useEffect(() => {
    try {
      const token = authService.handleCallback();
      updateAuthState(token);
      navigate('/');
    } catch (error) {
      console.error('Authentication failed:', error);
      navigate('/login');
    }
  }, [navigate, updateAuthState]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      gap={2}
    >
      <CircularProgress size={60} />
      <Typography variant="h6" color="textSecondary">
        Authenticating with EVE Online...
      </Typography>
    </Box>
  );
};

export default Callback; 