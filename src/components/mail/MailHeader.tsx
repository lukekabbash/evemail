import React from 'react';
import { Box, Typography, InputBase, Avatar, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from '../../contexts/AuthContext';

interface MailHeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

const MailHeader: React.FC<MailHeaderProps> = ({ searchValue, onSearchChange }) => {
  const navigate = useNavigate();
  const { auth } = useAuth();

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 2, sm: 3 },
        py: 1.5,
        bgcolor: '#23243a',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        gap: 2,
      }}
    >
      {/* Left: Logo/Text */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          mr: 2,
        }}
        onClick={() => navigate('/')}
        tabIndex={0}
        aria-label="Go to home"
        onKeyDown={e => { if (e.key === 'Enter') navigate('/'); }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            color: '#00b4ff',
            letterSpacing: 1,
            fontSize: { xs: '1.1rem', sm: '1.3rem' },
            userSelect: 'none',
          }}
        >
          EVE OS Mail
        </Typography>
      </Box>

      {/* Center/Right: Search */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', mx: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: 'rgba(0,0,0,0.18)',
            borderRadius: 2,
            px: 1.5,
            py: 0.5,
            width: { xs: '100%', sm: 320, md: 400 },
            maxWidth: '100%',
          }}
        >
          <SearchIcon sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 20, mr: 1 }} />
          <InputBase
            placeholder="Search mail..."
            value={searchValue}
            onChange={e => onSearchChange(e.target.value)}
            sx={{
              color: 'rgba(255,255,255,0.9)',
              width: '100%',
              fontSize: '1rem',
              '& input': { p: 0 },
            }}
            inputProps={{ 'aria-label': 'search mail' }}
          />
        </Box>
      </Box>

      {/* Right: PFP */}
      <IconButton
        onClick={() => navigate('/login')}
        sx={{ ml: 2, p: 0.5, borderRadius: '50%', border: '2px solid #00b4ff', bgcolor: 'rgba(0,180,255,0.08)' }}
        aria-label="SSO management"
      >
        <Avatar
          src={`https://images.evetech.net/characters/${auth.characterId}/portrait?size=64`}
          alt={auth.characterName || 'Profile'}
          sx={{ width: 36, height: 36, bgcolor: '#00b4ff', color: '#fff', fontWeight: 700 }}
        >
          {auth.characterName ? auth.characterName[0] : '?'}
        </Avatar>
      </IconButton>
    </Box>
  );
};

export default MailHeader; 