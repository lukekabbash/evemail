import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Divider,
  Avatar,
  Tooltip,
  Paper,
} from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';
import ForwardIcon from '@mui/icons-material/Forward';
import DeleteIcon from '@mui/icons-material/Delete';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import EVEMailContent from './EVEMailContent';
import { eveMailService } from '../../services/eveMailService';

interface MailViewProps {
  mail: {
    id: string;
    from: string;
    fromId?: number;
    to: string;
    subject: string;
    content: string;
    date: string;
    isStarred: boolean;
    attachments?: Array<{
      name: string;
      size: string;
      type: string;
    }>;
  } | null;
  onReply: (id: string) => void;
  onForward: (id: string) => void;
  onDelete: (id: string) => void;
  onStar: (id: string) => void;
}

const MailView: React.FC<MailViewProps> = ({
  mail,
  onReply,
  onForward,
  onDelete,
  onStar,
}) => {
  const [fromPortrait, setFromPortrait] = useState<string | null>(null);

  useEffect(() => {
    const loadPortrait = async () => {
      if (mail?.fromId) {
        const portrait = await eveMailService.getCharacterPortrait(mail.fromId);
        setFromPortrait(portrait);
      }
    };

    loadPortrait();
  }, [mail?.fromId]);

  if (!mail) {
    return (
      <div
        className="flex flex-col items-center justify-center h-full w-full min-h-screen bg-[#2a2a3e]"
        role="region"
        aria-label="No mail selected"
      >
        <img
          src="/EVE MAIL.png"
          alt="EVE Mail Logo"
          className="h-12 w-12 mb-6 opacity-90 drop-shadow-lg"
        />
        <span
          className="text-center text-[1.25rem] md:text-[1.5rem] max-w-[420px] text-white/70 font-medium tracking-wide shadow-sm"
        >
          Select a message to begin
        </span>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString([], {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: '#2a2a3e',
      }}
    >
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ mb: 1, color: 'rgba(255, 255, 255, 0.9)' }}>
            {mail.subject}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar 
              src={fromPortrait || undefined}
              sx={{ 
                bgcolor: fromPortrait ? 'transparent' : '#00b4ff',
                width: 40,
                height: 40,
              }}
            >
              {!fromPortrait && mail.from.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                {mail.from}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                To: {mail.to}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                {formatDate(mail.date)}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Reply">
            <IconButton
              onClick={() => onReply(mail.id)}
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                '&:hover': {
                  color: '#00b4ff',
                },
              }}
            >
              <ReplyIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Forward">
            <IconButton
              onClick={() => onForward(mail.id)}
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                '&:hover': {
                  color: '#00b4ff',
                },
              }}
            >
              <ForwardIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Star">
            <IconButton
              onClick={() => onStar(mail.id)}
              sx={{ 
                color: mail.isStarred ? '#00b4ff' : 'rgba(255, 255, 255, 0.7)',
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
              onClick={() => onDelete(mail.id)}
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                '&:hover': {
                  color: '#ff4444',
                },
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Box sx={{ p: 2, flexGrow: 1, overflowY: 'auto' }}>
        <EVEMailContent content={mail.content} />
        {mail.attachments && mail.attachments.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: '#000000' }}>
              Attachments ({mail.attachments.length})
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {mail.attachments.map((attachment, index) => (
                <Paper
                  key={index}
                  sx={{
                    p: 2,
                    bgcolor: '#f5f5f5',
                    borderRadius: 1,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: '#e0e0e0',
                    },
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#000000' }}>
                    {attachment.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(0, 0, 0, 0.7)' }}>
                    {attachment.size} • {attachment.type}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MailView; 