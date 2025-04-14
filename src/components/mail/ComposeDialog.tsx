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
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import FormatSizeIcon from '@mui/icons-material/FormatSize';
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
  const [editorHtml, setEditorHtml] = useState('');
  const [fontSize, setFontSize] = useState('16px');
  const [validatedRecipient, setValidatedRecipient] = useState<RecipientInfo | null>(null);
  const [selectedColor, setSelectedColor] = useState('#000000');

  useEffect(() => {
    if (replyData) {
      setSubject(replyData.subject);
      setEditorHtml(replyData.content);
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
      content: editorHtml.trim()
    });
  };

  const handleEditorInput = (e: React.FormEvent<HTMLDivElement>) => {
    setEditorHtml(e.currentTarget.innerHTML);
    setContent(e.currentTarget.innerHTML);
  };

  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFontSize(e.target.value);
    handleFormat('fontSize', '7'); // Use largest, then replace with real px below
    // Replace <font size="7"> with style
    const selection = window.getSelection();
    if (selection && selection.anchorNode && selection.anchorNode.parentElement) {
      const fontTags = document.querySelectorAll('font[size="7"]');
      fontTags.forEach(tag => {
        tag.removeAttribute('size');
        tag.setAttribute('style', `font-size: ${e.target.value}`);
      });
    }
  };

  const handleClose = () => {
    setValidatedRecipient(null);
    setSubject('');
    setEditorHtml('');
    setContent('');
    setSearchQuery('');
    setOptions([]);
    setError('');
    setFontSize('16px');
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
      <DialogTitle sx={{ color: 'rgba(255,255,255,0.9)', borderBottom: '1px solid rgba(255,255,255,0.1)', bgcolor: '#23243a', display: 'flex', alignItems: 'center', gap: 2 }}>
        <img src="/EVE MAIL.png" alt="EVE Mail Icon" className="h-8 w-8 mr-2" />
        New Message
      </DialogTitle>
      <DialogContent sx={{ bgcolor: '#23243a' }}>
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
              className="p-2 rounded hover:bg-blue-900 focus:outline-none"
              onMouseDown={e => { e.preventDefault(); handleFormat('bold'); }}
            >
              <FormatBoldIcon />
            </button>
            <button
              type="button"
              aria-label="Italic"
              tabIndex={0}
              className="p-2 rounded hover:bg-blue-900 focus:outline-none"
              onMouseDown={e => { e.preventDefault(); handleFormat('italic'); }}
            >
              <FormatItalicIcon />
            </button>
            <button
              type="button"
              aria-label="Underline"
              tabIndex={0}
              className="p-2 rounded hover:bg-blue-900 focus:outline-none"
              onMouseDown={e => { e.preventDefault(); handleFormat('underline'); }}
            >
              <FormatUnderlinedIcon />
            </button>
            <button
              type="button"
              aria-label="Strikethrough"
              tabIndex={0}
              className="p-2 rounded hover:bg-blue-900 focus:outline-none"
              onMouseDown={e => { e.preventDefault(); handleFormat('strikeThrough'); }}
            >
              <StrikethroughSIcon />
            </button>
            <select
              aria-label="Font Size"
              className="p-2 rounded bg-[#23243a] text-white border border-gray-700 focus:outline-none"
              value={fontSize}
              onChange={handleFontSizeChange}
              tabIndex={0}
            >
              <option value="12px">Small</option>
              <option value="16px">Normal</option>
              <option value="20px">Large</option>
              <option value="28px">Extra Large</option>
            </select>
            <label className="flex items-center gap-1">
              <FormatColorTextIcon />
              <input
                type="color"
                aria-label="Font Color"
                value={selectedColor}
                onChange={e => { setSelectedColor(e.target.value); handleFormat('foreColor', e.target.value); }}
                className="w-7 h-7 border-none bg-[#23243a] cursor-pointer"
                tabIndex={0}
              />
            </label>
          </div>
          <div
            contentEditable
            aria-label="Message editor"
            tabIndex={0}
            className="min-h-[200px] max-h-[400px] overflow-y-auto rounded border border-gray-700 bg-[#23243a] text-white p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ fontSize }}
            onInput={handleEditorInput}
            dangerouslySetInnerHTML={{ __html: editorHtml }}
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
          disabled={!validatedRecipient || !subject || !editorHtml}
          sx={{ bgcolor: '#00b4ff', color: '#fff', '&:hover': { bgcolor: '#0099ff' } }}
        >
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ComposeDialog; 