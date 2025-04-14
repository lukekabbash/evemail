import React from 'react';
import { useNavigate, useLocation, Link, Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  Grid,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../../contexts/AuthContext';
import ParticleBackground from '../ParticleBackground';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path: string) => {
    handleClose();
    navigate(path);
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    ...(auth.isAuthenticated
      ? [
          { label: 'Mail', path: '/mail' },
        ]
      : []),
  ];

  const hideHeader = location.pathname.startsWith('/mail');

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <Box 
        sx={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(/bg_main.jpg)',
          backgroundSize: '120% auto',
          backgroundPosition: 'center',
          transform: 'scale(1.1)',
          zIndex: 0,
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }
        }}
      />
      <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
        <ParticleBackground />
      </Box>
      {!hideHeader && (
        <AppBar
          position="sticky"
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(10px)',
            zIndex: 10,
          }}
        >
          <Container maxWidth="lg">
            <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
              <Box
                component={Link}
                to="/"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <img
                  src="/EVE MAIL.png"
                  alt="EVE Mail Logo"
                  style={{ height: '32px', marginRight: '12px' }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 'bold',
                    color: '#fff',
                  }}
                >
                  EVE OS Mail
                </Typography>
              </Box>

              {isMobile ? (
                <>
                  <IconButton
                    size="large"
                    edge="end"
                    color="inherit"
                    aria-label="menu"
                    onClick={handleMenu}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    sx={{
                      '& .MuiPaper-root': {
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        backdropFilter: 'blur(10px)',
                      },
                    }}
                  >
                    {navItems.map((item) => (
                      <MenuItem
                        key={item.path}
                        onClick={() => handleNavigation(item.path)}
                        selected={location.pathname === item.path}
                      >
                        {item.label}
                      </MenuItem>
                    ))}
                    {auth.isAuthenticated && (
                      <MenuItem onClick={logout}>Logout</MenuItem>
                    )}
                  </Menu>
                </>
              ) : (
                <Box sx={{ display: 'flex', gap: 3 }}>
                  {navItems.map((item) => (
                    <Button
                      key={item.path}
                      color="inherit"
                      onClick={() => navigate(item.path)}
                      sx={{
                        color: location.pathname === item.path ? '#00b4ff' : '#fff',
                        '&:hover': {
                          color: '#00b4ff',
                        },
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}
                  {auth.isAuthenticated && (
                    <Button
                      color="inherit"
                      onClick={logout}
                      sx={{
                        color: '#fff',
                        border: '1px solid',
                        borderColor: '#00b4ff',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 180, 255, 0.1)',
                        },
                      }}
                    >
                      Logout
                    </Button>
                  )}
                </Box>
              )}
            </Toolbar>
          </Container>
        </AppBar>
      )}

      <Box 
        component="main" 
        sx={{ 
          position: 'relative',
          zIndex: 2,
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {children}
      </Box>

      <Box
        component="footer"
        sx={{
          position: 'relative',
          zIndex: 2,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          py: 6,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <RouterLink to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                  <img
                    src="/EVE MAIL.png"
                    alt="EVE Mail Logo"
                    style={{ height: '40px', marginRight: '12px' }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      color: '#fff',
                    }}
                  >
                    EVE OS Mail
                  </Typography>
                </RouterLink>
              </Box>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                A third-party EVE Online tool for logistics and organization.
              </Typography>
              <RouterLink to="/login" style={{ textDecoration: 'none' }}>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    color: '#00b4ff',
                    borderColor: '#00b4ff',
                    mt: 2,
                    '&:hover': {
                      backgroundColor: 'rgba(0, 180, 255, 0.08)',
                      borderColor: '#00b4ff',
                    },
                  }}
                >
                  SSO management
                </Button>
              </RouterLink>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
                Navigation
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start' }}>
                <Button
                  component={Link}
                  to="/"
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)', 
                    justifyContent: 'flex-start',
                    py: 0.6,
                    px: 1.2,
                    mx: -1.2,
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)'
                    }
                  }}
                >
                  Home
                </Button>
                <Button
                  component={Link}
                  to="/about"
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)', 
                    justifyContent: 'flex-start',
                    py: 0.6,
                    px: 1.2,
                    mx: -1.2,
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)'
                    }
                  }}
                >
                  About
                </Button>
                {auth.isAuthenticated && (
                  <Button
                    component={Link}
                    to="/mail"
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)', 
                      justifyContent: 'flex-start',
                      py: 0.6,
                      px: 1.2,
                      mx: -1.2,
                      borderRadius: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)'
                      }
                    }}
                  >
                    Mail
                  </Button>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
                Legal
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start' }}>
                <Button
                  component={Link}
                  to="/terms"
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)', 
                    justifyContent: 'flex-start',
                    py: 0.6,
                    px: 1.2,
                    mx: -1.2,
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)'
                    }
                  }}
                >
                  Terms of Service
                </Button>
                <Button
                  component={Link}
                  to="/privacy"
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)', 
                    justifyContent: 'flex-start',
                    py: 0.6,
                    px: 1.2,
                    mx: -1.2,
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)'
                    }
                  }}
                >
                  Privacy Policy
                </Button>
              </Box>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 4, fontSize: '0.875rem' }}>
                EVE Online and the EVE logo are registered trademarks of CCP hf. All rights reserved. Used with permission.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout; 