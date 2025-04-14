import React from 'react';
import { Box, Typography, InputBase, Avatar, IconButton, Button, Autocomplete, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from '../../contexts/AuthContext';
import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

interface MailHeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onContactsClick?: () => void;
  contacts: { contact_id: number; name: string; portrait: string }[];
  onContactSelect: (contact: { contact_id: number; name: string; portrait: string }) => void;
}

const MailHeader: React.FC<MailHeaderProps> = ({ searchValue, onSearchChange, onContactsClick, contacts, onContactSelect }) => {
  const navigate = useNavigate();
  const { auth, logout } = useAuth();
  const [profileModalOpen, setProfileModalOpen] = React.useState(false);

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
        <img
          src="/EVE MAIL.png"
          alt="EVE Mail Logo"
          style={{ height: '28px', marginRight: '10px', verticalAlign: 'middle' }}
        />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            color: '#fff',
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
      {/* Right: Contacts Button + PFP */}
      <Box className="flex items-center gap-2">
        <button
          type="button"
          onClick={onContactsClick}
          className="hidden sm:flex items-center gap-1 px-3 py-1 rounded bg-blue-900 text-white hover:bg-blue-800 transition"
          aria-label="Open contacts modal"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <PersonIcon sx={{ verticalAlign: 'middle', fontSize: 22 }} />
          <span style={{ display: 'inline-flex', alignItems: 'center', lineHeight: 1 }}>Contacts</span>
        </button>
        <Box sx={{ ml: 2, p: 0.5, borderRadius: '50%', border: '2px solid #00b4ff', bgcolor: 'rgba(0,180,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          onClick={() => setProfileModalOpen(true)}
          tabIndex={0}
          aria-label="Open profile modal"
          onKeyDown={e => { if (e.key === 'Enter') setProfileModalOpen(true); }}
        >
          <Avatar
            src={auth.characterId ? `https://images.evetech.net/characters/${auth.characterId}/portrait?size=64` : undefined}
            alt={auth.characterName || 'Profile'}
            sx={{ width: 36, height: 36, bgcolor: '#00b4ff', color: '#fff', fontWeight: 700 }}
            imgProps={{
              onError: (e: any) => { e.target.onerror = null; e.target.src = undefined; },
            }}
          >
            {auth.characterName ? auth.characterName[0] : '?'}
          </Avatar>
        </Box>
      </Box>
      <Dialog open={profileModalOpen} onClose={() => setProfileModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ bgcolor: '#23243a', color: 'white', textAlign: 'center', pb: 1 }}>Account</DialogTitle>
        <DialogContent sx={{ bgcolor: '#23243a', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 2 }}>
          <Avatar
            src={auth.characterId ? `https://images.evetech.net/characters/${auth.characterId}/portrait?size=128` : undefined}
            alt={auth.characterName || 'Profile'}
            sx={{ width: 80, height: 80, bgcolor: '#00b4ff', color: '#fff', fontWeight: 700, mb: 2 }}
          >
            {auth.characterName ? auth.characterName[0] : '?'}
          </Avatar>
          <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>{auth.characterName || 'Unknown Character'}</Typography>
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#23243a', justifyContent: 'center', pb: 2 }}>
          <Button variant="contained" sx={{ bgcolor: '#00b4ff', color: 'white', mr: 2, '&:hover': { bgcolor: '#0099ff' } }} onClick={() => { window.location.href = '/'; }}>
            Change character
          </Button>
          <Button variant="outlined" sx={{ color: 'white', borderColor: '#00b4ff', '&:hover': { borderColor: '#0099ff', color: '#00b4ff' } }} onClick={logout}>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MailHeader; 