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
  IconButton,
  Tooltip,
} from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import { eveMailService } from '../../services/eveMailService';
import debounce from 'lodash/debounce';
import { AutocompleteInputChangeReason } from '@mui/material/Autocomplete';

export interface RecipientInfo {
  id: number;
  name: string;
  portrait?: string;
}

export interface ReplyData {
  to?: string;
  subject: string;
  content: string;
  recipientInfo?: RecipientInfo;
}

interface ComposeDialogProps {
  open: boolean;
  onClose: () => void;
  onSend: (data: { to: string; subject: string; content: string }) => void;
  replyData?: ReplyData;
}

interface CharacterOption {
  character_id: number;
  name: string;
  portrait_url: string;
}

const ComposeDialog: React.FC<ComposeDialogProps> = ({ open, onClose, onSend, replyData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [options, setOptions] = useState<RecipientInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [validatedRecipient, setValidatedRecipient] = useState<RecipientInfo | null>(null);
  const [selectedColor, setSelectedColor] = useState('#000000');

  useEffect(() => {
    if (replyData) {
      setSubject(replyData.subject);
      setContent(replyData.content);
      
      if (replyData.recipientInfo) {
        setValidatedRecipient(replyData.recipientInfo);
        setSearchQuery(replyData.recipientInfo.name);
        setOptions([replyData.recipientInfo]);
      } else if (replyData.to) {
        setSearchQuery(replyData.to);
        handleCharacterSearch(replyData.to);
      }
    }
  }, [replyData]);

  const handleCharacterSearch = debounce(async (query: string) => {
    if (!query) {
      setOptions([]);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const results = await eveMailService.searchCharacters(query);
      const mappedResults: RecipientInfo[] = results.map(char => ({
        id: char.character_id,
        name: char.name,
        portrait: char.portrait_url
      }));
      setOptions(mappedResults);
    } catch (err) {
      setError('Failed to search characters');
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, 300);

  const validateAndSearchCharacter = async (query: string) => {
    if (!query) return;
    
    try {
      setLoading(true);
      setError('');
      const results = await eveMailService.searchCharacters(query);
      const mappedResults: RecipientInfo[] = results.map(char => ({
        id: char.character_id,
        name: char.name,
        portrait: char.portrait_url
      }));
      
      const exactMatch = mappedResults.find(
        (char) => char.name.toLowerCase() === query.toLowerCase()
      );

      if (exactMatch) {
        setValidatedRecipient(exactMatch);
        setOptions([exactMatch]);
        setError('');
      } else {
        setValidatedRecipient(null);
        setOptions(mappedResults);
        setError('Please select a valid character');
      }
    } catch (err) {
      setError('Failed to validate character');
      setValidatedRecipient(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: string,
    reason: AutocompleteInputChangeReason
  ) => {
    setSearchQuery(value);
    setValidatedRecipient(null);
    setError('');
    handleCharacterSearch(value);
  };

  const handleOptionSelect = (recipient: RecipientInfo) => {
    setValidatedRecipient(recipient);
    setSearchQuery(recipient.name);
    setOptions([recipient]);
    setError('');
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab' && searchQuery && !validatedRecipient) {
      event.preventDefault();
      validateAndSearchCharacter(searchQuery);
    }
  };

  const handleBlur = () => {
    if (searchQuery && !validatedRecipient) {
      validateAndSearchCharacter(searchQuery);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validatedRecipient) {
      setError('Please select a valid recipient');
      return;
    }

    if (!subject.trim()) {
      setError('Subject is required');
      return;
    }

    onSend({
      to: validatedRecipient.name,
      subject: subject.trim(),
      content: content.trim()
    });
  };

  const formatText = (format: 'bold' | 'italic' | 'color') => {
    const textarea = document.querySelector('[name="message-content"]') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `<b>${selectedText}</b>`;
        break;
      case 'italic':
        formattedText = `<i>${selectedText}</i>`;
        break;
      case 'color':
        formattedText = `<font color="${selectedColor}">${selectedText}</font>`;
        break;
    }

    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);
  };

  const handleClose = () => {
    setValidatedRecipient(null);
    setSubject('');
    setContent('');
    setSearchQuery('');
    setOptions([]);
    setError('');
    onClose();
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
            value={validatedRecipient}
            onChange={(_, newValue) => {
              setValidatedRecipient(newValue);
            }}
            onInputChange={handleSearchChange}
            options={options}
            loading={loading}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            renderOption={(props, option) => (
              <Box component="li" {...props} sx={{ 
                '&:hover': { backgroundColor: 'rgba(0, 180, 255, 0.1)' }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar
                    src={option.portrait}
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
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                error={error !== ''}
                helperText={error}
                sx={{
                  '& .MuiInputLabel-root': { color: '#000000' },
                  '& .MuiInputBase-input': { color: '#000000' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(0, 0, 0, 0.23)' },
                    '&:hover fieldset': { borderColor: 'rgba(0, 0, 0, 0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#1976d2' }
                  }
                }}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: validatedRecipient && (
                    <Avatar
                      src={validatedRecipient.portrait}
                      alt={validatedRecipient.name}
                      sx={{ width: 24, height: 24, mr: 1 }}
                    />
                  ),
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
              '& .MuiInputLabel-root': { color: '#000000' },
              '& .MuiInputBase-input': { color: '#000000' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(0, 0, 0, 0.23)' },
                '&:hover fieldset': { borderColor: 'rgba(0, 0, 0, 0.5)' },
                '&.Mui-focused fieldset': { borderColor: '#1976d2' }
              }
            }}
          />
          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <Tooltip title="Bold">
              <IconButton onClick={() => formatText('bold')} sx={{ color: '#000000' }}>
                <FormatBoldIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Italic">
              <IconButton onClick={() => formatText('italic')} sx={{ color: '#000000' }}>
                <FormatItalicIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Text Color">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={() => formatText('color')} sx={{ color: '#000000' }}>
                  <FormatColorTextIcon />
                </IconButton>
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  style={{ width: 30, height: 30, padding: 0, border: 'none' }}
                />
              </Box>
            </Tooltip>
          </Box>
          <TextField
            name="message-content"
            label="Message"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            fullWidth
            multiline
            rows={16}
            variant="outlined"
            sx={{
              '& .MuiInputLabel-root': { color: '#000000' },
              '& .MuiInputBase-input': { color: '#000000' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(0, 0, 0, 0.23)' },
                '&:hover fieldset': { borderColor: 'rgba(0, 0, 0, 0.5)' },
                '&.Mui-focused fieldset': { borderColor: '#1976d2' }
              }
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ 
        p: 2,
        borderTop: '1px solid rgba(0, 0, 0, 0.1)',
        bgcolor: '#ffffff'
      }}>
        <Button onClick={handleClose} sx={{ color: '#000000' }}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={!validatedRecipient || !subject || !content}
        >
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ComposeDialog; 