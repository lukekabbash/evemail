import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Avatar, TextField, Box, Typography, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export interface Contact {
  contact_id: number;
  name: string;
  portrait: string;
}

interface ContactsModalProps {
  open: boolean;
  onClose: () => void;
  contacts: Contact[];
  onMailClick: (contact: Contact) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  loading: boolean;
  error: string | null;
}

const ContactsModal: React.FC<ContactsModalProps> = ({ open, onClose, contacts, onMailClick, searchValue, onSearchChange, loading, error }) => {
  // Filter and sort contacts
  const filteredContacts = contacts
    .filter(c => c.name.toLowerCase().includes(searchValue.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#23243a', color: 'white', pb: 1 }}>
        <span>Contacts</span>
        <IconButton onClick={onClose} aria-label="Close contacts modal" size="small" sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ bgcolor: '#23243a', color: 'white', pt: 1 }}>
        <TextField
          value={searchValue}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search contacts..."
          size="small"
          fullWidth
          sx={{ mb: 2, bgcolor: '#23243a', input: { color: 'white' } }}
        />
        {loading && <Typography sx={{ color: 'white', mb: 2 }}>Loading contacts...</Typography>}
        {error && <Typography sx={{ color: 'red', mb: 2 }}>{error}</Typography>}
        {!loading && !error && filteredContacts.length === 0 && (
          <Typography sx={{ color: 'white', mb: 2 }}>No contacts found.</Typography>
        )}
        <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
          {filteredContacts.map(contact => (
            <Box key={contact.contact_id} className="flex items-center gap-3 bg-[#1a1a2e] rounded px-3 py-2 mb-2">
              <Avatar src={contact.portrait} alt={contact.name} sx={{ width: 32, height: 32, mr: 2 }} />
              <span className="flex-1 text-white/90 text-sm font-medium">{contact.name}</span>
              <Button
                variant="contained"
                size="small"
                sx={{ bgcolor: '#00b4ff', color: 'white', minWidth: 0, px: 2, py: 0.5, fontSize: '0.85rem', '&:hover': { bgcolor: '#0099ff' } }}
                onClick={() => onMailClick(contact)}
                aria-label={`Compose mail to ${contact.name}`}
              >
                Mail
              </Button>
            </Box>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ContactsModal; 