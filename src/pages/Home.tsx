import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import MailIcon from '@mui/icons-material/Mail';
import LoginIcon from '@mui/icons-material/Login';

const Home: React.FC = () => {
  const { auth, login } = useAuth();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 50%, rgba(0, 180, 255, 0.1) 0%, rgba(0, 0, 0, 0) 50%)',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
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
              mb: 4,
            }}
          >
            <img
              src="/wormhole-purple.png"
              alt="Wormhole"
              style={{
                height: '48px',
                opacity: 0.8,
                filter: 'drop-shadow(0 0 10px rgba(0, 180, 255, 0.5))',
              }}
            />
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 'bold',
                color: '#fff',
                textShadow: '0 0 20px rgba(0, 180, 255, 0.5)',
              }}
            >
              EVE OS Mail
            </Typography>
            <img
              src="/wormhole-purple.png"
              alt="Wormhole"
              style={{
                height: '48px',
                opacity: 0.8,
                filter: 'drop-shadow(0 0 10px rgba(0, 180, 255, 0.5))',
              }}
            />
          </Box>

          <Paper
            elevation={24}
            sx={{
              p: 4,
              backgroundColor: 'rgba(13, 13, 13, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 180, 255, 0.2)',
              borderRadius: 3,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, transparent, rgba(0, 180, 255, 0.5), transparent)',
              },
            }}
          >
            {!auth.isAuthenticated ? (
              <>
                <Typography variant="h5" sx={{ mb: 4, color: '#fff', fontWeight: 600 }}>
                  Sign in to EVE OS Mail
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={login}
                  startIcon={<LoginIcon />}
                  sx={{
                    py: 1.5,
                    fontSize: '1.1rem',
                  }}
                >
                  Login with EVE Online
                </Button>
                <Typography
                  variant="body2"
                  sx={{
                    mt: 3,
                    color: 'text.secondary',
                    textAlign: 'center',
                  }}
                >
                  Secure login powered by EVE Online SSO
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="h5" sx={{ mb: 4, color: '#fff', fontWeight: 600 }}>
                  Welcome back, Commander
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={() => navigate('/mail')}
                  startIcon={<MailIcon />}
                  sx={{
                    py: 1.5,
                    fontSize: '1.1rem',
                  }}
                >
                  Open Mail Client
                </Button>
              </>
            )}
          </Paper>

          {!auth.isAuthenticated && (
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  mb: 2,
                }}
              >
                New to EVE OS Mail?
              </Typography>
              <Button
                variant="outlined"
                onClick={() => navigate('/about')}
                sx={{
                  borderColor: 'rgba(0, 180, 255, 0.5)',
                  '&:hover': {
                    borderColor: '#00b4ff',
                    backgroundColor: 'rgba(0, 180, 255, 0.1)',
                  },
                }}
              >
                Learn More
              </Button>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Home; 