import React from 'react';
import { Container, Typography, Box, Paper, Grid, Link } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import { Link as RouterLink } from 'react-router-dom';

const About: React.FC = () => {
  const features = [
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Secure by Design',
      description: 'All API calls are made directly from your browser to EVE Online\'s ESI API. No data passes through our servers.',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      title: 'Fast & Efficient',
      description: 'Modern web-based mail client with instant search and real-time updates.',
    },
    {
      icon: <IntegrationInstructionsIcon sx={{ fontSize: 40 }} />,
      title: 'EVE OS Integration',
      description: 'Seamlessly integrated with the EVE OS platform for a complete EVE Online toolset.',
    },
  ];

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        position: 'relative',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,20,40,0.8) 100%)',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ py: 8 }}>
          <Typography
            variant="h2"
            component="h1"
            align="center"
            sx={{
              mb: 4,
              fontWeight: 'bold',
              color: '#fff',
              textShadow: '0 0 20px rgba(0, 180, 255, 0.3)',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-16px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60px',
                height: '4px',
                backgroundColor: '#00b4ff',
                borderRadius: '2px',
              }
            }}
          >
            About EVE OS Mail
          </Typography>

          <Paper
            elevation={3}
            sx={{
              p: 4,
              mb: 6,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(10px)',
              color: '#fff',
              border: '1px solid rgba(0, 180, 255, 0.1)',
              borderRadius: '8px',
              '&:hover': {
                boxShadow: '0 0 20px rgba(0, 180, 255, 0.1)',
              },
              transition: 'box-shadow 0.3s ease-in-out',
            }}
          >
            <Typography variant="body1" paragraph>
              EVE OS Mail is an integral part of the EVE OS platform, providing a modern and efficient way to manage your EVE Online communications. 
              Our tool offers a seamless mail experience with features like instant search, rich text formatting, and character validation.
            </Typography>
            <Typography variant="body1" paragraph>
              Built with the EVE Online community in mind, we focus on providing a responsive and intuitive interface while maintaining 
              the highest standards of security and performance.
            </Typography>
          </Paper>

          <Grid container spacing={4} sx={{ mb: 8 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 4,
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease-in-out',
                    color: '#fff',
                    border: '1px solid rgba(0, 180, 255, 0.1)',
                    borderRadius: '8px',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 0 20px rgba(0, 180, 255, 0.1)',
                      borderColor: 'rgba(0, 180, 255, 0.3)',
                    },
                  }}
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
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Paper
            elevation={3}
            sx={{
              p: 4,
              mb: 6,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(10px)',
              color: '#fff',
              border: '1px solid rgba(0, 180, 255, 0.1)',
              borderRadius: '8px',
            }}
          >
            <Typography 
              variant="h4" 
              component="h2" 
              sx={{ 
                mb: 3, 
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                '&::before': {
                  content: '""',
                  width: '4px',
                  height: '24px',
                  backgroundColor: '#00b4ff',
                  marginRight: '12px',
                  borderRadius: '2px',
                }
              }}
            >
              How EVE OS Mail Works
            </Typography>
            <Box 
              component="ol" 
              sx={{ 
                pl: 3,
                '& > li': {
                  mb: 2,
                  color: 'rgba(255, 255, 255, 0.9)',
                  '&::marker': {
                    color: '#00b4ff',
                  }
                }
              }}
            >
              <Typography component="li" variant="body1">
                Log in with your EVE Online account using secure SSO authentication.
              </Typography>
              <Typography component="li" variant="body1">
                Access your EVE Online mailbox with a modern, responsive interface.
              </Typography>
              <Typography component="li" variant="body1">
                Compose messages with rich text formatting and character validation.
              </Typography>
              <Typography component="li" variant="body1">
                Manage your communications efficiently with instant search and folder organization.
              </Typography>
            </Box>
            <Typography 
              variant="body1" 
              sx={{ 
                mt: 4, 
                color: 'rgba(255, 255, 255, 0.7)',
                pl: 2,
                borderLeft: '2px solid rgba(0, 180, 255, 0.3)',
              }}
            >
              All interactions with EVE Online's services are made through the official ESI API,
              ensuring your account's security and compliance with the EVE Online Developer
              License Agreement.
            </Typography>
          </Paper>

          <Paper
            elevation={3}
            sx={{
              p: 4,
              mb: 6,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(10px)',
              color: '#fff',
            }}
          >
            <Typography variant="h4" component="h2" sx={{ mb: 3, color: '#fff' }}>
              About the{' '}
              <Link 
                href="https://www.eveos.space" 
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: '#fff',
                  textDecoration: 'none',
                  '&:hover': {
                    color: '#00b4ff',
                  }
                }}
              >
                EVE OS
              </Link>
              {' '}Platform
            </Typography>
            <Typography variant="body1" paragraph>
              EVE OS is a comprehensive, browser-based toolkit designed to enhance various aspects of EVE Online gameplay. 
              Developed by EVE Online veteran Luke Kabbash, the platform offers a suite of tools to assist players in 
              exploration, industry, combat, and more.
            </Typography>
            <Typography variant="h5" sx={{ mt: 4, mb: 2, color: '#fff' }}>
              Platform Features
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Link 
                  href="https://www.eveos.space/lukesguide"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ 
                    textDecoration: 'none',
                    '&:hover h6': {
                      color: '#007db2',
                    }
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 1, color: '#00b4ff' }}>
                    Wormhole Guide
                  </Typography>
                </Link>
                <Typography paragraph sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  An interactive guide for wormhole exploration, covering combat, relic, and data sites.
                </Typography>

                <Link 
                  href="https://www.eveos.space/industry/prices"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ 
                    textDecoration: 'none',
                    '&:hover h6': {
                      color: '#007db2',
                    }
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 1, color: '#00b4ff' }}>
                    Price Checker
                  </Typography>
                </Link>
                <Typography paragraph sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Allows users to paste item lists and receive market prices across different regions.
                </Typography>

                <Link 
                  href="https://www.eveos.space/intel/dscan"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ 
                    textDecoration: 'none',
                    '&:hover h6': {
                      color: '#007db2',
                    }
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 1, color: '#00b4ff' }}>
                    D-Scan Analyzer
                  </Typography>
                </Link>
                <Typography paragraph sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Analyzes directional scan results to enhance situational awareness.
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Link 
                  href="https://www.eveos.space/intel/local"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ 
                    textDecoration: 'none',
                    '&:hover h6': {
                      color: '#007db2',
                    }
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 1, color: '#00b4ff' }}>
                    Local Intel Tool
                  </Typography>
                </Link>
                <Typography paragraph sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Provides real-time analysis of local chat, assessing potential threats by checking player affiliations and killboard data.
                </Typography>

                <Link 
                  href="https://www.eveos.space/industry/visualizer"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ 
                    textDecoration: 'none',
                    '&:hover h6': {
                      color: '#007db2',
                    }
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 1, color: '#00b4ff' }}>
                    Industry Visualizer
                  </Typography>
                </Link>
                <Typography paragraph sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Visual tool for planning and optimizing industrial production chains.
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default About; 