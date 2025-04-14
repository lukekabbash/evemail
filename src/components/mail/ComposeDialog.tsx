import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Autocomplete,
  Avatar,
  Typography,
  Paper,
} from '@mui/material';
import { eveMailService } from '../../services/eveMailService';
import debounce from 'lodash/debounce';

interface ComposeDialogProps {
  open: boolean;
  onClose: () => void;
  onSend: (data: { to: string; subject: string; content: string }) => void;
  replyData?: { to: string; subject: string; content: string } | null;
}

interface CharacterOption {
  character_id: number;
  name: string;
  portrait_url: string;
}

const ComposeDialog: React.FC<ComposeDialogProps> = ({ open, onClose, onSend, replyData }) => {
  const [recipient, setRecipient] = useState<CharacterOption | null>(null);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [options, setOptions] = useState<CharacterOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (replyData) {
      setSearchQuery(replyData.to);
      setSubject(replyData.subject);
      setContent(replyData.content);
    }
  }, [replyData]);

  const searchCharacters = debounce(async (query: string) => {
    if (!query) {
      setOptions([]);
      return;
    }

    setLoading(true);
    try {
      const results = await eveMailService.searchCharacters(query);
      setOptions(results);
    } catch (error) {
      console.error('Failed to search characters:', error);
    } finally {
      setLoading(false);
    }
  }, 300);

  useEffect(() => {
    searchCharacters(searchQuery);
    return () => {
      searchCharacters.cancel();
    };
  }, [searchQuery]);

  const handleSend = () => {
    if (!recipient) return;
    onSend({ 
      to: recipient.character_id.toString(),
      subject,
      content
    });
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setRecipient(null);
    setSubject('');
    setContent('');
    setSearchQuery('');
    setOptions([]);
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
          backgroundColor: '#ffffff',
          backgroundImage: 'none',
        }
      }}
    >
      <DialogTitle sx={{ color: '#000000', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
        New Message
      </DialogTitle>
      <DialogContent sx={{ bgcolor: '#ffffff' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <Autocomplete
            value={recipient}
            onChange={(_, newValue) => setRecipient(newValue)}
            onInputChange={(_, newInputValue) => setSearchQuery(newInputValue)}
            options={options}
            loading={loading}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.character_id === value.character_id}
            renderOption={(props, option) => (
              <Box component="li" {...props} sx={{ 
                '&:hover': { backgroundColor: 'rgba(0, 180, 255, 0.1)' }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar
                    src={option.portrait_url}
                    alt={option.name}
                    sx={{ width: 32, height: 32 }}
                  />
                  <Typography sx={{ color: '#000000' }}>{option.name}</Typography>
                </Box>
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="To"
                placeholder="Search character name..."
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#ffffff',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 180, 255, 0.5)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#00b4ff',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(0, 0, 0, 0.7)',
                  },
                }}
              />
            )}
          />
          <TextField
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#ffffff',
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(0, 180, 255, 0.5)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#00b4ff',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(0, 0, 0, 0.7)',
              },
            }}
          />
          <TextField
            label="Message"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            fullWidth
            multiline
            rows={20}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#ffffff',
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(0, 180, 255, 0.5)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#00b4ff',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(0, 0, 0, 0.7)',
              },
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ 
        p: 2,
        borderTop: '1px solid rgba(0, 0, 0, 0.1)',
        bgcolor: '#ffffff'
      }}>
        <Button 
          onClick={handleClose}
          sx={{
            color: 'rgba(0, 0, 0, 0.7)',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
            },
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSend}
          variant="contained"
          disabled={!recipient || !subject || !content}
          sx={{
            bgcolor: '#00b4ff',
            '&:hover': {
              bgcolor: '#007db2',
            },
            '&.Mui-disabled': {
              bgcolor: 'rgba(0, 180, 255, 0.3)',
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