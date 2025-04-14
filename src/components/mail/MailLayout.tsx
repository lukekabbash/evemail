import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Typography, Divider, useTheme, useMediaQuery } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import { Fab } from '@mui/material';
import { Resizable } from 're-resizable';

interface ResizeData {
  width: number;
  height: number;
}

interface ResizeCallbackData {
  size: ResizeData;
  handle: string;
  delta: ResizeData;
  direction: string;
}

interface MailLayoutProps {
  sidebar: React.ReactNode;
  main: React.ReactNode;
  onComposeClick: () => void;
  sidebarWidth: number;
}

const MailLayout: React.FC<MailLayoutProps> = ({
  sidebar,
  main,
  onComposeClick,
  sidebarWidth,
}) => {
  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#1a1a2e' }}>
      <Box sx={{ width: sidebarWidth, bgcolor: '#1a1a2e', display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {sidebar}
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          minWidth: 0,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#2a2a3e',
        }}
      >
        {main}
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