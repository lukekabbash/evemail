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
    <List sx={{ width: '100%', bgcolor: '#ffffff', p: 0 }}>
      {mails.map((mail) => (
        <ListItem
          key={mail.id}
          sx={{
            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            backgroundColor: selectedMail === mail.id ? 'rgba(0, 180, 255, 0.1)' : 'transparent',
            '&:hover': {
              backgroundColor: 'rgba(0, 180, 255, 0.05)',
            },
          }}
          secondaryAction={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(0, 0, 0, 0.7)',
                  mr: 1,
                  minWidth: '70px',
                  textAlign: 'right',
                }}
              >
                {formatDate(mail.date)}
              </Typography>
              <Tooltip title="Star">
                <IconButton
                  edge="end"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMailStar(mail.id);
                  }}
                  sx={{ 
                    color: mail.isStarred ? '#00b4ff' : 'rgba(0, 0, 0, 0.7)',
                    '&:hover': {
                      color: '#00b4ff',
                    },
                  }}
                >
                  {mail.isStarred ? <StarIcon /> : <StarBorderIcon />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  edge="end"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMailDelete(mail.id);
                  }}
                  sx={{ 
                    color: 'rgba(0, 0, 0, 0.7)',
                    '&:hover': {
                      color: '#ff4444',
                    },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          }
          onClick={() => onMailSelect(mail.id)}
        >
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: mail.isRead ? 'normal' : 'bold',
                    color: mail.isRead ? 'rgba(0, 0, 0, 0.7)' : '#000000',
                  }}
                >
                  {mail.from}
                </Typography>
              </Box>
            }
            secondary={
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: mail.isRead ? 'normal' : 'bold',
                    color: mail.isRead ? 'rgba(0, 0, 0, 0.7)' : '#000000',
                  }}
                >
                  {mail.subject}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(0, 0, 0, 0.5)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {mail.preview}
                </Typography>
              </Box>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default MailList;