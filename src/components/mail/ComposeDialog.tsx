import React, { useState, useEffect, useRef } from 'react';
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
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (replyData) {
      setSubject(replyData.subject);
      setContent(replyData.content);
      if (editorRef.current) {
        editorRef.current.innerHTML = replyData.content || '';
      }
      
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

  const handleEditorInput = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const handleFormat = (command: 'bold' | 'italic' | 'foreColor') => {
    if (editorRef.current) {
      editorRef.current.focus();
      if (command === 'foreColor') {
        document.execCommand(command, false, selectedColor);
      } else {
        document.execCommand(command, false);
      }
      setContent(editorRef.current.innerHTML);
    }
  };

  const handleEditorKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.ctrlKey) {
      if (event.key === 'b' || event.key === 'B') {
        event.preventDefault();
        handleFormat('bold');
      }
      if (event.key === 'i' || event.key === 'I') {
        event.preventDefault();
        handleFormat('italic');
      }
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
        <Box className="flex flex-col gap-2 mt-1">
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
              <Box component="li" {...props} className="hover:bg-cyan-900 bg-[#23243a]">
                <Box className="flex items-center gap-1">
                  <Avatar src={option.portrait} alt={option.name} sx={{ width: 32, height: 32 }} />
                  <Typography className="text-white">{option.name}</Typography>
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
          <div className="flex gap-2 mb-2">
            <button
              type="button"
              aria-label="Bold"
              tabIndex={0}
              className="rounded p-2 hover:bg-cyan-900 text-white focus:outline-none"
              onClick={() => handleFormat('bold')}
            >
              <FormatBoldIcon />
            </button>
            <button
              type="button"
              aria-label="Italic"
              tabIndex={0}
              className="rounded p-2 hover:bg-cyan-900 text-white focus:outline-none"
              onClick={() => handleFormat('italic')}
            >
              <FormatItalicIcon />
            </button>
            <label className="flex items-center cursor-pointer">
              <span className="rounded p-2 hover:bg-cyan-900 text-white focus:outline-none" aria-label="Text Color" tabIndex={0}>
                <FormatColorTextIcon onClick={() => handleFormat('foreColor')} />
              </span>
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-6 h-6 ml-2 border-none bg-[#23243a] cursor-pointer"
                aria-label="Choose text color"
                tabIndex={0}
              />
            </label>
          </div>
          <div
            ref={editorRef}
            contentEditable
            tabIndex={0}
            aria-label="Message editor"
            className="min-h-[300px] max-h-[400px] overflow-y-auto rounded border border-gray-700 bg-[#23243a] text-white p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            onInput={handleEditorInput}
            onKeyDown={handleEditorKeyDown}
            suppressContentEditableWarning={true}
            dangerouslySetInnerHTML={{ __html: content }}
            role="textbox"
            spellCheck={true}
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
          disabled={!validatedRecipient || !subject || !content}
          sx={{ bgcolor: '#00b4ff', color: '#fff', '&:hover': { bgcolor: '#0099ff' } }}
        >
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ComposeDialog; 