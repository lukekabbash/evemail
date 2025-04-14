import React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box, IconButton } from '@mui/material';

export interface Contact {
  contact_id: number;
  name: string;
  portrait: string;
}

interface ContactsSidebarProps {
  open: boolean;
  onClose: () => void;
  contacts: Contact[];
  loading: boolean;
  error: string | null;
  onMailClick: (contact: Contact) => void;
}

const ContactsSidebar: React.FC<ContactsSidebarProps> = ({ open, onClose, contacts, loading, error, onMailClick }) => (
  <div
    className={`fixed top-0 right-0 h-full w-80 bg-[#23243a] shadow-lg z-50 transform transition-transform duration-300 ease-in-out hidden sm:block ${open ? 'translate-x-0' : 'translate-x-full'}`}
    style={{ minWidth: 320, maxWidth: 400 }}
    aria-label="Contacts sidebar"
    tabIndex={open ? 0 : -1}
  >
    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
      <span className="flex items-center gap-2 text-white text-lg font-semibold">
        <PersonIcon /> Contacts
      </span>
      <IconButton
        className="text-white hover:text-blue-400 focus:outline-none"
        aria-label="Close contacts sidebar"
        onClick={onClose}
        size="small"
      >
        <ArrowForwardIosIcon className="rotate-180" />
      </IconButton>
    </div>
    <div className="p-4 overflow-y-auto h-[calc(100%-56px)]">
      {loading && <div className="text-white/70">Loading contacts...</div>}
      {error && <div className="text-red-400">{error}</div>}
      {!loading && !error && contacts.length === 0 && (
        <div className="text-white/60">No contacts found.</div>
      )}
      <ul className="space-y-3">
        {contacts.map((contact) => (
          <li key={contact.contact_id} className="flex items-center gap-3 bg-[#1a1a2e] rounded px-3 py-2">
            <img
              src={contact.portrait}
              alt={contact.name}
              className="w-8 h-8 rounded-full"
            />
            <span className="flex-1 text-white/90 text-sm font-medium">{contact.name}</span>
            <button
              className="bg-blue-700 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
              aria-label={`Compose mail to contact ${contact.name}`}
              onClick={() => onMailClick(contact)}
            >
              Mail
            </button>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default ContactsSidebar; 