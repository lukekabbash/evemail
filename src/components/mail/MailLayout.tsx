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
  children: React.ReactNode;
  onFolderSelect: (folder: string) => void;
  selectedFolder: string;
  onComposeClick: () => void;
  sidebarWidth: number;
  onSidebarResize: (width: number) => void;
}

const MailLayout: React.FC<MailLayoutProps> = ({
  children,
  onFolderSelect,
  selectedFolder,
  onComposeClick,
  sidebarWidth,
  onSidebarResize
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
    <Resizable
      size={{ width: sidebarWidth, height: '100%' }}
      onResizeStop={(_e: MouseEvent | TouchEvent, _direction: string, _ref: HTMLElement, d: ResizeData) => {
        onSidebarResize(sidebarWidth + d.width);
      }}
      minWidth={200}
      maxWidth={400}
      enable={{ right: true }}
      handleComponent={{
        right: (
          <Box
            sx={{
              width: '4px',
              height: '100%',
              position: 'absolute',
              right: '-2px',
              cursor: 'col-resize',
              backgroundColor: 'transparent',
              transition: 'background-color 0.2s',
              '&:hover': {
                backgroundColor: '#1976d2',
              },
              zIndex: 1300,
            }}
          />
        ),
      }}
    >
      <Box sx={{ overflow: 'auto', height: '100%', bgcolor: '#f8f9fa' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600 }}>
            Mail
          </Typography>
        </Box>
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
                borderRadius: '8px',
                mb: 0.5,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.12)',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <ListItemIcon sx={{ 
                color: selectedFolder === folder.value ? '#1976d2' : 'rgba(0, 0, 0, 0.54)',
                minWidth: '40px'
              }}>
                {folder.icon}
              </ListItemIcon>
              <ListItemText 
                primary={folder.text}
                sx={{
                  '& .MuiListItemText-primary': {
                    color: selectedFolder === folder.value ? '#1976d2' : 'rgba(0, 0, 0, 0.87)',
                    fontWeight: selectedFolder === folder.value ? 600 : 400,
                  },
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Resizable>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#ffffff' }}>
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
          width: sidebarWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: sidebarWidth,
            boxSizing: 'border-box',
            backgroundColor: '#ffffff',
            borderRight: '1px solid #e0e0e0',
          },
        }}
      >
        {drawer}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${sidebarWidth}px)` },
          height: '100vh',
          overflow: 'hidden',
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
          bgcolor: '#1976d2',
          '&:hover': {
            bgcolor: '#1565c0',
          },
        }}
      >
        <EditIcon />
      </Fab>
    </Box>
  );
};

export default MailLayout; 