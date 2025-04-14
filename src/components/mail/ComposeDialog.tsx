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
  replyData?: { 
    to: string; 
    subject: string; 
    content: string; 
    recipientInfo?: CharacterOption;
  } | null;
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
  const [recipientError, setRecipientError] = useState(false);
  const [recipientValidated, setRecipientValidated] = useState(false);

  useEffect(() => {
    if (replyData) {
      setSearchQuery(replyData.to);
      setSubject(replyData.subject);
      setContent(replyData.content);
      if (replyData.recipientInfo) {
        setRecipient(replyData.recipientInfo);
        setRecipientValidated(true);
        setRecipientError(false);
      } else {
        validateAndSearchCharacter(replyData.to);
      }
    }
  }, [replyData]);

  const validateAndSearchCharacter = async (name: string) => {
    if (!name) return;
    
    setLoading(true);
    try {
      const results = await eveMailService.searchCharacters(name);
      const exactMatch = results.find(char => char.name.toLowerCase() === name.toLowerCase());
      
      if (exactMatch) {
        setRecipient(exactMatch);
        setRecipientValidated(true);
        setRecipientError(false);
      } else {
        setRecipient(null);
        setRecipientValidated(false);
        setRecipientError(true);
      }
    } catch (error) {
      console.error('Failed to validate character:', error);
      setRecipientError(true);
      setRecipientValidated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRecipientKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab' && searchQuery) {
      event.preventDefault();
      validateAndSearchCharacter(searchQuery);
    }
  };

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
            onChange={(_, newValue) => {
              setRecipient(newValue);
              setRecipientValidated(!!newValue);
              setRecipientError(!newValue);
            }}
            onInputChange={(_, newInputValue) => {
              setSearchQuery(newInputValue);
              setRecipientValidated(false);
              setRecipientError(false);
            }}
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
                onKeyDown={handleRecipientKeyDown}
                error={recipientError}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: recipient && (
                    <Avatar
                      src={recipient.portrait_url}
                      alt={recipient.name}
                      sx={{ width: 24, height: 24, mr: 1 }}
                    />
                  ),
                  sx: {
                    color: recipientValidated ? '#2e7d32' : (recipientError ? '#d32f2f' : '#000000'),
                    '& input': {
                      color: recipientValidated ? '#2e7d32' : (recipientError ? '#d32f2f' : '#000000'),
                    },
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#ffffff',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: recipientValidated ? '#2e7d32' : (recipientError ? '#d32f2f' : 'rgba(0, 180, 255, 0.5)'),
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: recipientValidated ? '#2e7d32' : (recipientError ? '#d32f2f' : '#00b4ff'),
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
            InputProps={{
              sx: {
                color: '#000000',
                '& input': {
                  color: '#000000',
                },
              },
            }}
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
            InputProps={{
              sx: {
                color: '#000000',
                '& textarea': {
                  color: '#000000',
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                },
              },
            }}
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