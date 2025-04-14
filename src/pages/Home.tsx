import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container, TextField } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import MailIcon from '@mui/icons-material/Mail';
import LoginIcon from '@mui/icons-material/Login';

const Home: React.FC = () => {
  const { auth, login } = useAuth();
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          mt: { xs: 4, md: 8 },
          mb: { xs: 6, md: 12 },
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

        <Box
          sx={{
            maxWidth: '400px',
            mx: 'auto',
            mt: 6,
            p: 4,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            border: '1px solid rgba(0, 180, 255, 0.2)',
          }}
        >
          {!auth.isAuthenticated ? (
            <>
              <Typography variant="h5" sx={{ mb: 4, color: '#fff' }}>
                Sign in to EVE OS Mail
              </Typography>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={login}
                startIcon={<LoginIcon />}
                sx={{
                  backgroundColor: '#00b4ff',
                  color: '#fff',
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: '#007db2',
                  },
                }}
              >
                Login with EVE Online
              </Button>
              <Typography
                variant="body2"
                sx={{
                  mt: 3,
                  color: 'rgba(255, 255, 255, 0.7)',
                  textAlign: 'center',
                }}
              >
                Secure login powered by EVE Online SSO
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="h5" sx={{ mb: 4, color: '#fff' }}>
                Welcome back, Commander
              </Typography>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={() => navigate('/mail')}
                startIcon={<MailIcon />}
                sx={{
                  backgroundColor: '#00b4ff',
                  color: '#fff',
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: '#007db2',
                  },
                }}
              >
                Open Mail Client
              </Button>
            </>
          )}
        </Box>

        {!auth.isAuthenticated && (
          <Box sx={{ mt: 6, textAlign: 'center' }}>
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                mb: 2,
              }}
            >
              New to EVE OS Mail?
            </Typography>
            <Button
              variant="outlined"
              onClick={() => navigate('/about')}
              sx={{
                color: '#00b4ff',
                borderColor: '#00b4ff',
                '&:hover': {
                  borderColor: '#007db2',
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
  );
};

export default Home; 