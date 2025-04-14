import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Typography, Divider, useTheme, useMediaQuery } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import { Fab } from '@mui/material';

interface MailLayoutProps {
  children: React.ReactNode;
  onFolderSelect: (folder: string) => void;
  selectedFolder: string;
  onComposeClick: () => void;
}

const DRAWER_WIDTH = 240;

const MailLayout: React.FC<MailLayoutProps> = ({
  children,
  onFolderSelect,
  selectedFolder,
  onComposeClick
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const mailFolders = [
    { text: 'Inbox', icon: <InboxIcon />, value: 'inbox' },
    { text: 'Sent', icon: <SendIcon />, value: 'sent' },
    { text: 'Trash', icon: <DeleteIcon />, value: 'trash' },
  ];

  const drawer = (
    <Box sx={{ overflow: 'auto' }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ color: '#00b4ff' }}>
          EVE Mail
        </Typography>
      </Box>
      <Divider />
      <List>
        {mailFolders.map((folder) => (
          <ListItem
            button
            key={folder.value}
            onClick={() => {
              onFolderSelect(folder.value);
              if (isMobile) {
                setMobileOpen(false);
              }
            }}
            selected={selectedFolder === folder.value}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'rgba(0, 180, 255, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 180, 255, 0.2)',
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: selectedFolder === folder.value ? '#00b4ff' : 'inherit' }}>
              {folder.icon}
            </ListItemIcon>
            <ListItemText 
              primary={folder.text}
              sx={{
                '& .MuiListItemText-primary': {
                  color: selectedFolder === folder.value ? '#00b4ff' : 'inherit',
                },
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#121212' }}>
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
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
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
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          height: '100vh',
          overflow: 'auto',
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
          backgroundColor: '#00b4ff',
          '&:hover': {
            backgroundColor: '#007db2',
          },
        }}
      >
        <EditIcon />
      </Fab>
    </Box>
  );
};

export default MailLayout; 