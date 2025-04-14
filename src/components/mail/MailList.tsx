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
    <List sx={{ p: 0, bgcolor: '#1a1a2e' }}>
      {mails.map((mail) => (
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
          }}
          onClick={() => onMailSelect(mail.id)}
        >
          <ListItemText
            primary={
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              }}>
                <Typography
                  sx={{
                    fontWeight: mail.isRead ? 400 : 600,
                    color: mail.isRead ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.9)',
                    fontSize: '0.875rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {mail.from}
                </Typography>
                <Typography
                  sx={{
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '0.75rem',
                    flexShrink: 0,
                    ml: 2,
                  }}
                >
                  {new Date(mail.date).toLocaleDateString()}
                </Typography>
              </Box>
            }
            secondary={
              <Box sx={{ mt: 0.5 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  width: '100%',
                  pr: '160px',
                }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: mail.isRead ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.9)',
                      fontSize: '0.875rem',
                      mb: 0.5,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      width: '100%',
                    }}
                  >
                    {mail.subject}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.5)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'pre-line',
                    fontSize: '0.815rem',
                    lineHeight: 1.4,
                    pr: '160px',
                    maxHeight: '2.8em',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {mail.preview.replace(/\n{2,}/g, '\n').replace(/\s+/g, ' ').trim()}
                </Typography>
              </Box>
            }
          />
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            ml: 2,
          }}>
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
      ))}
    </List>
  );
};

export default MailList;