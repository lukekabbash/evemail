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
} from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import DeleteIcon from '@mui/icons-material/Delete';

export interface MailItem {
  id: string;
  from: string;
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
              py: 1,
              cursor: 'pointer',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              bgcolor: selectedMail === mail.id ? 'rgba(0, 180, 255, 0.1)' : 'transparent',
              '&:hover': {
                bgcolor: 'rgba(0, 180, 255, 0.05)',
              },
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1,
            }}
            onClick={() => onMailSelect(mail.id)}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
                <Typography
                  sx={{
                    fontWeight: mail.isRead ? 400 : 700,
                    color: mail.isRead ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.95)',
                    fontSize: '0.95rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flex: 1,
                  }}
                >
                  {mail.subject}
                </Typography>
                <Typography
                  sx={{
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '0.75rem',
                    flexShrink: 0,
                    ml: 2,
                    minWidth: 70,
                    textAlign: 'right',
                  }}
                >
                  {formatDate(mail.date)}
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '0.82rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  mt: 0.25,
                }}
              >
                {isSent ? mail.to : mail.from}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
              <Tooltip title={mail.isStarred ? "Unstar" : "Star"}>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onMailStar(mail.id);
                  }}
                  size="small"
                  sx={{ 
                    color: mail.isStarred ? '#00b4ff' : 'rgba(255, 255, 255, 0.5)',
                    '&:hover': {
                      color: mail.isStarred ? '#0099ff' : '#00b4ff',
                    }
                  }}
                >
                  {mail.isStarred ? <StarIcon /> : <StarBorderIcon />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onMailDelete(mail.id);
                  }}
                  size="small"
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.5)',
                    '&:hover': {
                      color: '#ff4444',
                    }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </ListItem>
        );
      })}
    </List>
  );
};

export default MailList;