import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Checkbox,
  IconButton,
  Tooltip,
  Avatar,
} from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import DeleteIcon from '@mui/icons-material/Delete';

export interface MailItem {
  id: string;
  from: string;
  fromId: number;
  to: string;
  subject: string;
  preview: string;
  date: string;
  isRead: boolean;
  isStarred: boolean;
}

interface MailListProps {
  mails: MailItem[];
  selectedMail: string | null;
  onMailSelect: (id: string) => void;
  onMailStar: (id: string) => void;
  onMailDelete: (id: string) => void;
}

const MailList: React.FC<MailListProps> = ({
  mails,
  selectedMail,
  onMailSelect,
  onMailStar,
  onMailDelete,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  return (
    <List sx={{ p: 0, bgcolor: '#1a1a2e', pt: 2, height: '100%', overflow: 'auto', '::-webkit-scrollbar': { width: 8 }, '::-webkit-scrollbar-thumb': { bgcolor: '#888', borderRadius: 4 }, '::-webkit-scrollbar-track': { bgcolor: '#23243a' } }}>
      {mails.map((mail) => {
        const isSent = mail.from === undefined || mail.from === null;
        return (
          <ListItem
            key={mail.id}
            sx={{
              px: 2,
              py: 1.5,
              cursor: 'pointer',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              bgcolor: selectedMail === mail.id ? 'rgba(0, 180, 255, 0.12)' : 'transparent',
              '&:hover': {
                bgcolor: 'rgba(0, 180, 255, 0.07)',
              },
              display: 'flex',
              alignItems: 'stretch',
              gap: 1,
              minHeight: 64,
            }}
            onClick={() => onMailSelect(mail.id)}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
              {mail.fromId ? (
                <Avatar
                  src={`https://images.evetech.net/characters/${mail.fromId}/portrait?size=32`}
                  alt={mail.from}
                  sx={{ width: 32, height: 32, bgcolor: '#23243a', fontSize: 16 }}
                />
              ) : (
                <Avatar sx={{ width: 32, height: 32, bgcolor: '#23243a', fontSize: 16 }}>
                  {mail.from?.charAt(0).toUpperCase()}
                </Avatar>
              )}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography
                sx={{
                  fontWeight: mail.isRead ? 400 : 700,
                  color: mail.isRead ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 1)',
                  fontSize: '0.98rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  mb: 0.2,
                }}
              >
                {mail.subject}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.65)',
                  fontSize: '0.82rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  mb: 0.2,
                }}
              >
                {isSent ? mail.to : mail.from}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontSize: '0.78rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '95%',
                }}
              >
                {mail.preview}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', ml: 1, minWidth: 32 }}>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onMailStar(mail.id);
                }}
                size="small"
                sx={{ 
                  color: mail.isStarred ? '#00b4ff' : 'rgba(255, 255, 255, 0.5)',
                  mb: 0.5,
                  p: 0.5,
                  fontSize: 18,
                  '&:hover': {
                    color: mail.isStarred ? '#0099ff' : '#00b4ff',
                  }
                }}
              >
                {mail.isStarred ? <StarIcon fontSize="inherit" /> : <StarBorderIcon fontSize="inherit" />}
              </IconButton>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onMailDelete(mail.id);
                }}
                size="small"
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.5)',
                  p: 0.5,
                  fontSize: 18,
                  '&:hover': {
                    color: '#ff4444',
                  }
                }}
              >
                <DeleteIcon fontSize="inherit" />
              </IconButton>
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255,255,255,0.45)',
                  fontSize: '0.72rem',
                  mt: 0.5,
                  textAlign: 'right',
                  minWidth: 40,
                }}
              >
                {formatDate(mail.date)}
              </Typography>
            </Box>
          </ListItem>
        );
      })}
    </List>
  );
};

export default MailList;