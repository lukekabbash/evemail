import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container, Grid, Stack } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import ParticleBackground from '../components/ParticleBackground';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MailIcon from '@mui/icons-material/Mail';
import SearchIcon from '@mui/icons-material/Search';
import LoginIcon from '@mui/icons-material/Login';

const Home: React.FC = () => {
  const { auth, login } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: <SearchIcon sx={{ fontSize: 40 }} />,
      title: 'Browse Market',
      description: 'Search and browse all items available in EVE Online markets. No login required!',
      path: '/checklist',
      requiresAuth: false
    },
    {
      icon: <ShoppingCartIcon sx={{ fontSize: 40 }} />,
      title: 'Create Lists',
      description: 'Build and manage your shopping lists with ease. Lists are saved locally when not logged in.',
      path: '/checklist',
      requiresAuth: false
    },
    {
      icon: <MailIcon sx={{ fontSize: 40 }} />,
      title: 'Send to Game',
      description: 'Mail your shopping lists directly to your in-game character. Requires EVE Online login.',
      path: '/mail',
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
              Welcome to EVE OS Mail
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
            A third-party EVE Online tool designed to improve logistics, organization, and communication.
            Create shopping lists and send them directly to your in-game mailbox. Start browsing and creating lists instantly - no login required!
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
            sx={{ mb: 8 }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/checklist')}
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
              Start Creating Lists
            </Button>
            
            {!auth.isAuthenticated && (
              <Button
                variant="outlined"
                size="large"
                onClick={login}
                startIcon={<LoginIcon />}
                sx={{
                  borderColor: '#00b4ff',
                  color: '#fff',
                  '&:hover': {
                    borderColor: '#007db2',
                    backgroundColor: 'rgba(0, 180, 255, 0.1)',
                  },
                  px: 4,
                  py: 2,
                }}
              >
                Login with EVE Online
              </Button>
            )}
          </Stack>
        </Box>

        <Grid container spacing={4} sx={{ mb: 8 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
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