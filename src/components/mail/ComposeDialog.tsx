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
  onSend: (data: { to: string; subject: string; content: string; recipients: { recipient_id: number; recipient_type: string }[] }) => void;
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
  const [validatedRecipients, setValidatedRecipients] = useState<RecipientInfo[]>([]);
  const [selectedColor, setSelectedColor] = useState('#000000');

  useEffect(() => {
    if (replyData) {
      setSubject(replyData.subject);
      setContent(replyData.content);
      
      if (replyData.recipientInfo) {
        setValidatedRecipients([replyData.recipientInfo]);
        setSearchQuery('');
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
        setValidatedRecipients([exactMatch]);
        setOptions([exactMatch]);
        setError('');
      } else {
        setValidatedRecipients([]);
        setOptions(mappedResults);
        setError('Please select a valid character');
      }
    } catch (err) {
      setError('Failed to validate character');
      setValidatedRecipients([]);
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
    setError('');
    handleCharacterSearch(value);
  };

  const handleOptionSelect = (recipient: RecipientInfo) => {
    if (!validatedRecipients.some(r => r.id === recipient.id)) {
      setValidatedRecipients([...validatedRecipients, recipient]);
      setSearchQuery('');
      setError('');
    }
  };

  const handleKeyDown = async (event: React.KeyboardEvent) => {
    if ((event.key === 'Tab' || event.key === ',' || event.key === 'Enter') && searchQuery) {
      event.preventDefault();
      await addRecipientsFromInput(searchQuery);
    } else if (event.key === 'Backspace' && !searchQuery && validatedRecipients.length) {
      setValidatedRecipients(validatedRecipients.slice(0, -1));
    }
  };

  const handleBlur = async () => {
    if (searchQuery) {
      await addRecipientsFromInput(searchQuery);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validatedRecipients.length) {
      setError('Please select at least one valid recipient');
      return;
    }

    if (!subject.trim()) {
      setError('Subject is required');
      return;
    }

    onSend({
      to: validatedRecipients.map(r => r.name).join(', '),
      subject: subject.trim(),
      content: content.trim(),
      recipients: validatedRecipients.map(r => ({ recipient_id: r.id, recipient_type: 'character' }))
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
    setValidatedRecipients([]);
    setSubject('');
    setContent('');
    setSearchQuery('');
    setOptions([]);
    setError('');
    onClose();
  };

  const addRecipientsFromInput = async (input: string) => {
    const names = input.split(',').map(n => n.trim()).filter(Boolean);
    let newRecipients: RecipientInfo[] = [];
    for (const name of names) {
      const results = await eveMailService.searchCharacters(name);
      const mappedResults: RecipientInfo[] = results.map(char => ({
        id: char.character_id,
        name: char.name,
        portrait: char.portrait_url
      }));
      const exactMatch = mappedResults.find(
        (char) => char.name.toLowerCase() === name.toLowerCase()
      );
      if (exactMatch && !validatedRecipients.some(r => r.id === exactMatch.id)) {
        newRecipients.push(exactMatch);
      }
    }
    if (newRecipients.length) {
      setValidatedRecipients([...validatedRecipients, ...newRecipients]);
      setSearchQuery('');
      setError('');
    } else if (names.length) {
      setError('Please select valid character(s)');
    }
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
          backgroundColor: '#23243a',
          backgroundImage: 'none',
          color: 'rgba(255,255,255,0.9)',
        }
      }}
    >
      <DialogTitle sx={{ color: 'rgba(255,255,255,0.9)', borderBottom: '1px solid rgba(255,255,255,0.1)', bgcolor: '#23243a' }}>
        New Message
      </DialogTitle>
      <DialogContent sx={{ bgcolor: '#23243a' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <Autocomplete
            freeSolo
            inputValue={searchQuery}
            onInputChange={handleSearchChange}
            options={options}
            loading={loading}
            getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
            isOptionEqualToValue={(option, value) => {
              if (typeof option === 'string' || typeof value === 'string') {
                return option === value;
              }
              return option.name === value.name;
            }}
            onChange={(_, newValue) => {
              if (newValue) handleOptionSelect(newValue as RecipientInfo);
            }}
            renderOption={(props, option) => (
              <Box component="li" {...props} sx={{ '&:hover': { backgroundColor: 'rgba(0, 180, 255, 0.1)' }, bgcolor: '#23243a' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar
                    src={option.portrait}
                    alt={option.name}
                    sx={{ width: 32, height: 32 }}
                  />
                  <Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>{option.name}</Typography>
                </Box>
              </Box>
            )}
            renderInput={(params) => {
              return (
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
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                    '& .MuiInputBase-input': { color: 'rgba(255,255,255,0.9)' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                      '&:hover fieldset': { borderColor: '#00b4ff' },
                      '&.Mui-focused fieldset': { borderColor: '#00b4ff' }
                    },
                    bgcolor: '#23243a',
                  }}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <Box className="flex items-center gap-x-2">
                        {validatedRecipients.map((recipient) => (
                          <span
                            key={recipient.id}
                            className="flex items-center bg-blue-900 text-white rounded-full px-3 py-1 text-sm mr-2 shadow"
                          >
                            <Avatar src={recipient.portrait} alt={recipient.name} sx={{ width: 20, height: 20, mr: 1 }} />
                            {recipient.name}
                            <button
                              type="button"
                              className="flex items-center justify-center w-5 h-5 rounded-full bg-red-800 hover:bg-red-900 text-white ml-1 focus:outline-none"
                              aria-label={`Remove ${recipient.name}`}
                              tabIndex={0}
                              onClick={() => setValidatedRecipients(validatedRecipients.filter(r => r.id !== recipient.id))}
                              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setValidatedRecipients(validatedRecipients.filter(r => r.id !== recipient.id))}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </Box>
                    ),
                  }}
                />
              );
            }}
          />
          <TextField
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
            sx={{
              '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
              '& .MuiInputBase-input': { color: 'rgba(255,255,255,0.9)' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                '&:hover fieldset': { borderColor: '#00b4ff' },
                '&.Mui-focused fieldset': { borderColor: '#00b4ff' }
              },
              bgcolor: '#23243a',
            }}
          />
          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <Tooltip title="Bold">
              <IconButton onClick={() => formatText('bold')} sx={{ color: 'rgba(255,255,255,0.9)' }}>
                <FormatBoldIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Italic">
              <IconButton onClick={() => formatText('italic')} sx={{ color: 'rgba(255,255,255,0.9)' }}>
                <FormatItalicIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Text Color">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={() => formatText('color')} sx={{ color: 'rgba(255,255,255,0.9)' }}>
                  <FormatColorTextIcon />
                </IconButton>
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  style={{ width: 30, height: 30, padding: 0, border: 'none', background: '#23243a' }}
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
              '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
              '& .MuiInputBase-input': { color: 'rgba(255,255,255,0.9)' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                '&:hover fieldset': { borderColor: '#00b4ff' },
                '&.Mui-focused fieldset': { borderColor: '#00b4ff' }
              },
              bgcolor: '#23243a',
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ 
        p: 2,
        borderTop: '1px solid rgba(255,255,255,0.1)',
        bgcolor: '#23243a'
      }}>
        <Button onClick={handleClose} sx={{ color: 'rgba(255,255,255,0.7)' }}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={!validatedRecipients.length || !subject || !content}
          sx={{ bgcolor: '#00b4ff', color: '#fff', '&:hover': { bgcolor: '#0099ff' } }}
        >
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ComposeDialog; 