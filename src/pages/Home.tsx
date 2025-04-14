import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container, Grid, Stack } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import ParticleBackground from '../components/ParticleBackground';
import MailIcon from '@mui/icons-material/Mail';
import HandshakeIcon from '@mui/icons-material/Handshake';
import LoginIcon from '@mui/icons-material/Login';

const Home: React.FC = () => {
  const { auth, login } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: <MailIcon sx={{ fontSize: 40 }} />,
      title: 'Mail Management',
      description: 'Read, write, and organize your EVE mails in an Outlook-style interface. Access all your communications in one place.',
      path: '/mail',
      requiresAuth: true
    },
    {
      icon: <HandshakeIcon sx={{ fontSize: 40 }} />,
      title: 'Contracts',
      description: 'View and manage your contracts. Create new contracts and track existing ones with ease.',
      path: '/contracts',
      requiresAuth: true
    }
  ];

  return (
    <>
      <ParticleBackground />
      <Container maxWidth="lg">
        <Box
          sx={{
            mt: 8,
            mb: 12,
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              mb: 3,
            }}
          >
            <img
              src="/wormhole-purple.png"
              alt="Wormhole"
              style={{ height: '48px', opacity: 0.8 }}
            />
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 'bold',
                color: '#fff',
                textShadow: '0 0 10px rgba(0, 180, 255, 0.5)',
              }}
            >
              EVE OS Mail
            </Typography>
            <img
              src="/wormhole-purple.png"
              alt="Wormhole"
              style={{ height: '48px', opacity: 0.8 }}
            />
          </Box>
          
          <Typography
            variant="h5"
            sx={{ 
              mb: 6, 
              maxWidth: '800px', 
              mx: 'auto',
              color: 'rgba(255, 255, 255, 0.8)',
            }}
          >
            A modern mail client for EVE Online. Manage your in-game communications and contracts with an intuitive, Outlook-style interface.
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
            sx={{ mb: 8 }}
          >
            {!auth.isAuthenticated && (
              <Button
                variant="contained"
                size="large"
                onClick={login}
                startIcon={<LoginIcon />}
                sx={{
                  backgroundColor: '#00b4ff',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#007db2',
                  },
                  px: 4,
                  py: 2,
                }}
              >
                Login with EVE Online
              </Button>
            )}
            
            {auth.isAuthenticated && (
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/mail')}
                startIcon={<MailIcon />}
                sx={{
                  backgroundColor: '#00b4ff',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#007db2',
                  },
                  px: 4,
                  py: 2,
                }}
              >
                Open Mail Client
              </Button>
            )}
          </Stack>
        </Box>

        <Grid container spacing={4} sx={{ mb: 8 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Box
                sx={{
                  p: 4,
                  height: '100%',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  transition: 'transform 0.2s',
                  cursor: 'pointer',
                  border: '1px solid rgba(0, 180, 255, 0.1)',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    borderColor: 'rgba(0, 180, 255, 0.3)',
                  },
                  position: 'relative',
                }}
                onClick={() => (!feature.requiresAuth || auth.isAuthenticated) && navigate(feature.path)}
              >
                <Box sx={{ color: '#00b4ff', mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h5" component="h2" sx={{ mb: 2, color: '#fff' }}>
                  {feature.title}
                </Typography>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  {feature.description}
                </Typography>
                {feature.requiresAuth && !auth.isAuthenticated && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      backgroundColor: 'rgba(0, 180, 255, 0.1)',
                      color: '#00b4ff',
                      padding: '4px 8px',
                      borderRadius: 1,
                      fontSize: '0.75rem',
                      border: '1px solid rgba(0, 180, 255, 0.3)',
                    }}
                  >
                    Requires Login
                  </Box>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default Home; 