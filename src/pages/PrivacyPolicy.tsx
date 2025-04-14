import React from 'react';
import { Container, Typography, Paper, Box, Link, useTheme } from '@mui/material';
import ParticleBackground from '../components/ParticleBackground';

const PrivacyPolicy: React.FC = () => {
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
            Privacy Policy
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
            <SectionTitle>1. Zero Data Collection Policy</SectionTitle>
            <SubSection>1.1. EVE OS Mail does not collect, store, or process any user mail data.</SubSection>
            <SubSection>1.2. All mail operations are performed directly between your browser and EVE Online's ESI API.</SubSection>
            <SubSection>1.3. We maintain no databases or storage systems for user communications.</SubSection>

            <SectionTitle>2. Authentication</SectionTitle>
            <SubSection>2.1. Authentication is handled entirely through EVE Online's SSO system.</SubSection>
            <SubSection>2.2. We do not store your EVE Online credentials or authentication tokens.</SubSection>
            <SubSection>2.3. Access tokens are stored only in your browser's local storage and are cleared upon logout.</SubSection>

            <SectionTitle>3. Browser Storage</SectionTitle>
            <SubSection>
              3.1. We use browser local storage only for essential functionality:
              <Box 
                component="ul" 
                sx={{ 
                  mt: 2,
                  mb: 1,
                  listStyle: 'none',
                  pl: 2,
                }}
              >
                {['Authentication tokens', 'UI preferences', 'Session management'].map((item) => (
                  <Box 
                    component="li" 
                    key={item}
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      mb: 1,
                      '&::before': {
                        content: '""',
                        display: 'block',
                        width: '6px',
                        height: '6px',
                        backgroundColor: '#00b4ff',
                        borderRadius: '50%',
                        mr: 2,
                      }
                    }}
                  >
                    {item}
                  </Box>
                ))}
              </Box>
            </SubSection>
            <SubSection>3.2. No mail content or sensitive data is stored in browser storage.</SubSection>
            <SubSection>3.3. You can clear all stored data by clearing your browser data or logging out.</SubSection>

            <SectionTitle>4. Data Transmission</SectionTitle>
            <SubSection>4.1. All data transmission occurs directly between your browser and EVE Online's ESI API.</SubSection>
            <SubSection>4.2. We use HTTPS encryption for all web traffic.</SubSection>
            <SubSection>4.3. No data passes through our servers during mail operations.</SubSection>

            <SectionTitle>5. Cookies</SectionTitle>
            <SubSection>5.1. We use only essential cookies required for authentication and session management.</SubSection>
            <SubSection>5.2. No tracking or analytics cookies are used.</SubSection>
            <SubSection>5.3. You can disable cookies, but this may affect the functionality of the service.</SubSection>

            <SectionTitle>6. Third-Party Services</SectionTitle>
            <SubSection>6.1. We only interact with EVE Online's ESI API.</SubSection>
            <SubSection>6.2. No third-party analytics, tracking, or advertising services are used.</SubSection>
            <SubSection>6.3. We do not share any data with third parties as we do not collect any data.</SubSection>

            <SectionTitle>7. User Rights</SectionTitle>
            <SubSection>
              7.1. As we do not collect or store any personal data, there is no need for:
              <Box 
                component="ul" 
                sx={{ 
                  mt: 2,
                  mb: 1,
                  listStyle: 'none',
                  pl: 2,
                }}
              >
                {[
                  'Data access requests',
                  'Data deletion requests',
                  'Data correction requests'
                ].map((item) => (
                  <Box 
                    component="li" 
                    key={item}
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      mb: 1,
                      '&::before': {
                        content: '""',
                        display: 'block',
                        width: '6px',
                        height: '6px',
                        backgroundColor: '#00b4ff',
                        borderRadius: '50%',
                        mr: 2,
                      }
                    }}
                  >
                    {item}
                  </Box>
                ))}
              </Box>
            </SubSection>
            <SubSection>7.2. You can revoke access to your EVE Online account at any time through EVE Online's website.</SubSection>

            <SectionTitle>8. Contact Information</SectionTitle>
            <SubSection>For any privacy-related questions or concerns, you can contact us through the EVE OS platform.</SubSection>

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

export default PrivacyPolicy; 