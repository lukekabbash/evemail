import React, { useEffect, useState } from 'react';
import { Box, Typography, InputBase, Avatar, IconButton, Button, Autocomplete, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from '../../contexts/AuthContext';
import PersonIcon from '@mui/icons-material/Person';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import styles from './MailHeader.module.css';

interface MailHeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onContactsClick?: () => void;
  contacts: { contact_id: number; name: string; portrait: string }[];
  onContactSelect: (contact: { contact_id: number; name: string; portrait: string }) => void;
}

const MailHeader: React.FC<MailHeaderProps> = ({ searchValue, onSearchChange, onContactsClick, contacts, onContactSelect }) => {
  const navigate = useNavigate();
  const { auth, logout, login } = useAuth();
  const [profileModalOpen, setProfileModalOpen] = React.useState(false);
  const [portraitUrl, setPortraitUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (auth.characterId) {
      const url = `https://images.evetech.net/characters/${auth.characterId}/portrait?size=64`;
      setPortraitUrl(url);
      // Optionally, check if the image loads
      const img = new window.Image();
      img.onload = () => setPortraitUrl(url);
      img.onerror = () => setPortraitUrl(undefined);
      img.src = url;
    } else {
      setPortraitUrl(undefined);
    }
  }, [auth.characterId]);

  return (
    <div className={styles.header}>
      {/* Left: Logo/Text */}
      <div className={styles.left} onClick={() => navigate('/')} tabIndex={0} aria-label="Go to home" onKeyDown={e => { if (e.key === 'Enter') navigate('/'); }}>
        <img src="/EVE MAIL.png" alt="EVE Mail Logo" className={styles.logo} />
        <Typography variant="h6" className={styles.title}>EVE OS Mail</Typography>
      </div>
      {/* Center: Search */}
      <div className={styles.center}>
        <div className={styles.searchBox}>
          <SearchIcon className={styles.searchIcon} />
          <InputBase
            placeholder="Search mail..."
            value={searchValue}
            onChange={e => onSearchChange(e.target.value)}
            className={styles.searchInput}
            inputProps={{ 'aria-label': 'search mail' }}
          />
        </div>
      </div>
      {/* Right: Buttons + Profile */}
      <div className={styles.right}>
        <button
          type="button"
          onClick={onContactsClick}
          className={styles.button}
          aria-label="Open contacts modal"
        >
          <PersonIcon className={styles.buttonIcon} />
          <span>Contacts</span>
        </button>
        <button
          type="button"
          className={styles.button}
          aria-label="Return to EVE OS"
          tabIndex={0}
          onClick={() => window.open('https://www.eveos.space', '_blank', 'noopener,noreferrer')}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              window.open('https://www.eveos.space', '_blank', 'noopener,noreferrer');
            }
          }}
        >
          <OpenInNewIcon className={styles.buttonIcon} />
          <span>Return to EVE OS</span>
        </button>
        <div className={styles.profile} onClick={() => setProfileModalOpen(true)} tabIndex={0} aria-label="Open profile modal" onKeyDown={e => { if (e.key === 'Enter') setProfileModalOpen(true); }}>
          <Avatar
            src={portraitUrl}
            alt={auth.characterName || 'Profile'}
            sx={{ width: 36, height: 36, bgcolor: '#00b4ff', color: '#fff', fontWeight: 700 }}
          >
            {auth.characterName ? auth.characterName[0] : '?'}
          </Avatar>
        </div>
      </div>
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
          <Button variant="contained" sx={{ bgcolor: '#00b4ff', color: 'white', mr: 2, '&:hover': { bgcolor: '#0099ff' } }} onClick={() => { logout(); setTimeout(() => login(), 100); }}>
            Change character
          </Button>
          <Button variant="outlined" sx={{ color: 'white', borderColor: '#00b4ff', '&:hover': { borderColor: '#0099ff', color: '#00b4ff' } }} onClick={logout}>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MailHeader; 