import React from 'react';
import { Container, Typography, Box, Paper, Grid, Link } from '@mui/material';
import ParticleBackground from '../components/ParticleBackground';
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
      description: 'Built with modern web technologies for a smooth, responsive experience.',
    },
    {
      icon: <IntegrationInstructionsIcon sx={{ fontSize: 40 }} />,
      title: 'EVE OS Integration',
      description: 'Seamlessly integrated with the EVE OS platform for a complete EVE Online toolset.',
    },
  ];

  return (
    <>
      <ParticleBackground />
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
            }}
          >
            <Typography variant="body1" paragraph>
              EVE OS Mail is an integral part of the EVE OS platform, designed to streamline your
              market shopping experience in EVE Online. Our tool allows you to browse the market,
              create shopping lists, and mail them directly to your in-game character.
            </Typography>
            <Typography variant="body1" paragraph>
              Built with the EVE Online community in mind, we focus on providing a seamless
              experience while maintaining the highest standards of security and performance.
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
                    transition: 'transform 0.2s',
                    color: '#fff',
                    '&:hover': {
                      transform: 'translateY(-5px)',
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
            }}
          >
            <Typography variant="h4" component="h2" sx={{ mb: 3, color: '#fff' }}>
              How EVE OS Mail Works
            </Typography>
            <Typography variant="body1" paragraph>
              1. Log in with your EVE Online account using secure SSO authentication.
            </Typography>
            <Typography variant="body1" paragraph>
              2. Browse the complete market database with real-time pricing information.
            </Typography>
            <Typography variant="body1" paragraph>
              3. Create and manage shopping lists with custom quantities.
            </Typography>
            <Typography variant="body1" paragraph>
              4. Send your shopping lists directly to your in-game mailbox with one click.
            </Typography>
            <Typography variant="body1" sx={{ mt: 4, color: 'rgba(255, 255, 255, 0.7)' }}>
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
              About{' '}
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
                    Crafting Visualizer
                  </Typography>
                </Link>
                <Typography paragraph sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Breaks down complex manufacturing processes into a visual tree, aiding in efficient planning of production chains.
                </Typography>

                <Link 
                  href="https://www.eveos.space/industry/planetary"
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
                    PI Visualizer
                  </Typography>
                </Link>
                <Typography paragraph sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Advanced planetary interaction planning tool for optimizing PI colony layouts and production chains.
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{ textAlign: 'center', mt: 2 }}>
                <Link 
                  href="https://www.eveos.space/chat"
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
                    EVE Chat Assistant
                  </Typography>
                </Link>
                <Typography paragraph sx={{ color: 'rgba(255, 255, 255, 0.8)', maxWidth: '600px', mx: 'auto' }}>
                  An AI-powered assistant that answers questions about EVE Online or the EVE OS platform.
                </Typography>
              </Grid>
            </Grid>

            <Typography variant="h5" sx={{ mt: 4, mb: 2, color: '#fff' }}>
              Privacy and Development
            </Typography>
            <Typography paragraph sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              EVE OS emphasizes user privacy with a zero data collection policy, ensuring that your in-game data and activities 
              remain confidential. The platform is continuously evolving based on community feedback and needs, with Luke Kabbash 
              actively engaging with users to implement new features and improvements.
            </Typography>
            
            <Typography sx={{ mt: 4, color: 'rgba(255, 255, 255, 0.7)' }}>
              Explore more EVE OS tools at{' '}
              <Link 
                href="https://www.eveos.space" 
                target="_blank" 
                rel="noopener noreferrer"
                sx={{ 
                  color: '#00b4ff',
                  '&:hover': {
                    color: '#007db2',
                  }
                }}
              >
                www.eveos.space
              </Link>
            </Typography>
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default About; 