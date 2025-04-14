import React from 'react';
import { Box, Button, Typography, Container, Paper } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import ParticleBackground from '../components/ParticleBackground';

export const Login: React.FC = () => {
  const { login, clearSSO } = useAuth();

  return (
    <>
      <ParticleBackground />
      <Container maxWidth="sm">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          gap={4}
          sx={{ position: 'relative', zIndex: 1 }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              backgroundColor: 'rgba(26, 26, 26, 0.7)',
              backdropFilter: 'blur(10px)',
              borderRadius: 2,
              width: '100%',
              textAlign: 'center'
            }}
          >
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom
              sx={{
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #00b4ff 30%, #007db2 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 3
              }}
            >
              EVE OS MAIL
            </Typography>
            
            <Typography variant="h6" component="h2" gutterBottom>
              Third-Party EVE Online Mail Tool
            </Typography>
            
            <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
              Enhance your EVE Online logistics, organization, and communication with our powerful tools.
              Create shopping lists and send them directly to your in-game mailbox.
            </Typography>

            <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
              Features:
              • Browse items and create shopping lists without login
              • Save lists locally for future reference
              • Send lists directly to in-game mail (requires login)
              • Secure EVE Online SSO authentication
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={login}
              sx={{
                backgroundColor: '#00b4ff',
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: '#007db2',
                },
                padding: '12px 32px',
                borderRadius: '4px',
                textTransform: 'none',
                fontSize: '1.1rem',
                mb: 2
              }}
            >
              Login with EVE Online
            </Button>

            <Button
              variant="outlined"
              color="error"
              fullWidth
              sx={{ mb: 2, mt: 1, borderColor: '#ff4444', color: '#ff4444', '&:hover': { bgcolor: 'rgba(255,68,68,0.08)', borderColor: '#ff4444' } }}
              onClick={clearSSO}
            >
              Clear SSO / Logout
            </Button>
            <Typography variant="caption" color="textSecondary" sx={{ mb: 2, display: 'block' }}>
              This will clear your EVE SSO login from this device. You will need to log in again to access your mail.
            </Typography>
          </Paper>
        </Box>
      </Container>
    </>
  );
}; 