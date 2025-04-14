import React, { useState } from 'react';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  IconButton, 
  Typography, 
  Divider, 
  useTheme, 
  useMediaQuery,
  Menu,
  MenuItem,
  Button
} from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Fab } from '@mui/material';

interface MailLayoutProps {
  children: React.ReactNode;
  onFolderSelect: (folder: string) => void;
  selectedFolder: string;
  onComposeClick: () => void;
}

const MailLayout: React.FC<MailLayoutProps> = ({
  children,
  onFolderSelect,
  selectedFolder,
  onComposeClick,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleFolderClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFolderClose = () => {
    setAnchorEl(null);
  };

  const handleFolderSelect = (folder: string) => {
    onFolderSelect(folder);
    handleFolderClose();
  };

  const getFolderIcon = (folder: string) => {
    switch (folder) {
      case 'inbox':
        return <InboxIcon />;
      case 'sent':
        return <SendIcon />;
      case 'trash':
        return <DeleteIcon />;
      default:
        return <InboxIcon />;
    }
  };

  const getFolderName = (folder: string) => {
    return folder.charAt(0).toUpperCase() + folder.slice(1);
  };

  const drawer = (
    <Box sx={{ 
      height: '100%', 
      bgcolor: '#1a1a2e',
      color: 'rgba(255, 255, 255, 0.9)'
    }}>
      <Box sx={{ p: 2 }}>
        <Button
          onClick={handleFolderClick}
          endIcon={<ArrowDropDownIcon />}
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            textTransform: 'none',
            fontSize: '1rem',
            justifyContent: 'flex-start',
            width: '100%',
            pl: 2,
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          {getFolderIcon(selectedFolder)}
          <Box sx={{ ml: 1 }}>{getFolderName(selectedFolder)}</Box>
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleFolderClose}
          PaperProps={{
            sx: {
              bgcolor: '#1a1a2e',
              color: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              '& .MuiMenuItem-root': {
                px: 2,
                py: 1,
                '&:hover': {
                  bgcolor: 'rgba(0, 180, 255, 0.1)'
                }
              }
            }
          }}
        >
          {['inbox', 'sent', 'trash'].map((folder) => (
            <MenuItem 
              key={folder} 
              onClick={() => handleFolderSelect(folder)}
              selected={selectedFolder === folder}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: 'rgba(255, 255, 255, 0.9)',
                bgcolor: selectedFolder === folder ? 'rgba(0, 180, 255, 0.1)' : 'transparent',
                '&:hover': {
                  bgcolor: 'rgba(0, 180, 255, 0.05)'
                }
              }}
            >
              {getFolderIcon(folder)}
              {getFolderName(folder)}
            </MenuItem>
          ))}
        </Menu>
      </Box>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#1a1a2e' }}>
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ position: 'absolute', top: 8, left: 8, zIndex: 1100 }}
        >
          <MenuIcon />
        </IconButton>
      )}

      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            backgroundColor: '#1a1a2e',
            borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        {drawer}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - 240px)` },
          height: '100vh',
          overflow: 'hidden',
          bgcolor: '#2a2a3e'
        }}
      >
        {children}
      </Box>

      <Fab
        color="primary"
        aria-label="compose"
        onClick={onComposeClick}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          bgcolor: '#00b4ff',
          '&:hover': {
            bgcolor: '#0099ff',
          },
        }}
      >
        <EditIcon />
      </Fab>
    </Box>
  );
};

export default MailLayout; 