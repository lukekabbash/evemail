import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from '@mui/material';

interface ComposeDialogProps {
  open: boolean;
  onClose: () => void;
  onSend: (data: { to: string; subject: string; content: string }) => void;
}

const ComposeDialog: React.FC<ComposeDialogProps> = ({ open, onClose, onSend }) => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');

  const handleSend = () => {
    onSend({ to, subject, content });
    setTo('');
    setSubject('');
    setContent('');
  };

  const handleClose = () => {
    onClose();
    setTo('');
    setSubject('');
    setContent('');
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          height: '80vh',
          maxHeight: '800px',
        }
      }}
    >
      <DialogTitle>New Message</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Character ID"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
            type="number"
            placeholder="Enter recipient's character ID"
          />
          <TextField
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
          />
          <TextField
            label="Message"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            fullWidth
            multiline
            rows={20}
            variant="outlined"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button 
          onClick={handleSend}
          variant="contained"
          disabled={!to || !subject || !content}
          sx={{
            bgcolor: '#1976d2',
            '&:hover': {
              bgcolor: '#1565c0',
            },
          }}
        >
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ComposeDialog; 