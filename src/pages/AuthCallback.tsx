import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { handleCallback } = useAuth();

  useEffect(() => {
    const processCallback = async () => {
      try {
        await handleCallback();
        navigate('/mail');
      } catch (error) {
        console.error('Authentication failed:', error);
        navigate('/');
      }
    };

    processCallback();
  }, [handleCallback, navigate]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: 2,
      }}
    >
      <CircularProgress size={40} sx={{ color: '#00b4ff' }} />
      <Typography variant="h6" sx={{ color: 'white' }}>
        Authenticating...
      </Typography>
    </Box>
  );
};

export default AuthCallback; 