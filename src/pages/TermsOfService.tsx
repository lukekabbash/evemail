import React from 'react';
import { Container, Typography, Paper, Box, Link, useTheme } from '@mui/material';
import ParticleBackground from '../components/ParticleBackground';

const TermsOfService: React.FC = () => {
  const theme = useTheme();

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <Typography 
      variant="h5" 
      sx={{ 
        mb: 3,
        mt: 4,
        color: '#00b4ff',
        fontWeight: 600,
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
      {children}
    </Typography>
  );

  const SubSection = ({ children }: { children: React.ReactNode }) => (
    <Typography 
      paragraph 
      sx={{ 
        color: 'rgba(255, 255, 255, 0.9)',
        pl: 2,
        borderLeft: '2px solid rgba(0, 180, 255, 0.3)',
        '&:hover': {
          borderLeft: '2px solid rgba(0, 180, 255, 0.6)',
        },
        transition: 'border-left-color 0.2s ease-in-out',
      }}
    >
      {children}
    </Typography>
  );

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        position: 'relative',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,20,40,0.8) 100%)',
      }}
    >
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
            Terms of Service
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
            <SectionTitle>1. Service Description</SectionTitle>
            <SubSection>
              EVE OS Mail ("the Service") is a free web-based mail client for EVE Online, provided as part of the EVE OS platform. 
              The Service will remain free forever and does not collect or store any user mail data.
            </SubSection>

            <SectionTitle>2. Free Service Commitment</SectionTitle>
            <SubSection>2.1. The Service is and will remain completely free of charge.</SubSection>
            <SubSection>2.2. We do not offer paid subscriptions or premium features.</SubSection>
            <SubSection>2.3. We do not monetize user data or communications in any way.</SubSection>

            <SectionTitle>3. API Usage and Limitations</SectionTitle>
            <SubSection>3.1. Users must respect EVE Online's ESI API rate limits and guidelines.</SubSection>
            <SubSection>3.2. Automated scripts or excessive API calls that could constitute spam are strictly prohibited.</SubSection>
            <SubSection>3.3. Users are responsible for maintaining their EVE Online API access tokens and permissions.</SubSection>

            <SectionTitle>4. Data Handling</SectionTitle>
            <SubSection>4.1. We do not store, process, or retain any user mail data on our servers.</SubSection>
            <SubSection>4.2. All communications are handled directly between your browser and EVE Online's ESI API.</SubSection>
            <SubSection>4.3. No message content, recipient information, or mail metadata is stored by our service.</SubSection>

            <SectionTitle>5. User Responsibilities</SectionTitle>
            <SubSection>5.1. Users are responsible for maintaining the security of their EVE Online account credentials.</SubSection>
            <SubSection>5.2. Users must comply with EVE Online's Terms of Service and Developer License Agreement.</SubSection>
            <SubSection>5.3. Users should report any security concerns or bugs to the service administrators.</SubSection>

            <SectionTitle>6. Disclaimers</SectionTitle>
            <SubSection>6.1. The Service is provided "as is" without any warranties of any kind.</SubSection>
            <SubSection>6.2. We are not responsible for any loss of data or communications issues related to EVE Online's API.</SubSection>
            <SubSection>6.3. We reserve the right to modify or discontinue the service at any time.</SubSection>

            <SectionTitle>7. EVE Online Compliance</SectionTitle>
            <SubSection>7.1. EVE OS Mail complies with all EVE Online Developer License Agreement requirements.</SubSection>
            <SubSection>7.2. CCP Games retains all rights to EVE Online-related content and data.</SubSection>
            <SubSection>7.3. This service is not endorsed by or affiliated with CCP Games.</SubSection>

            <Typography 
              sx={{ 
                mt: 6, 
                color: 'rgba(255, 255, 255, 0.5)',
                textAlign: 'center',
                fontSize: '0.875rem',
                fontStyle: 'italic',
              }}
            >
              Last updated: {new Date().toLocaleDateString()}
            </Typography>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default TermsOfService; 