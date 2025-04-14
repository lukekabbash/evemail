import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Resizable, ResizeCallback } from 're-resizable';
import MailLayout from '../components/mail/MailLayout';
import MailList from '../components/mail/MailList';
import MailView from '../components/mail/MailView';
import ComposeDialog from '../components/mail/ComposeDialog';
import { useAuth } from '../contexts/AuthContext';
import { eveMailService } from '../services/eveMailService';

// Temporary interface until we integrate with EVE API
interface Mail {
  id: string;
  from: string;
  subject: string;
  preview: string;
  content: string;
  date: string;
  isRead: boolean;
  isStarred: boolean;
  to: string;
  type: 'inbox' | 'sent' | 'trash';  // Add type field to track folder
}

const Mail: React.FC = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [selectedFolder, setSelectedFolder] = useState('inbox');
  const [selectedMail, setSelectedMail] = useState<string | null>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [mails, setMails] = useState<Mail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyData, setReplyData] = useState<{ to: string; subject: string; content: string; recipientInfo?: any } | null>(null);
  const [mailListWidth, setMailListWidth] = useState(400);
  const [sidebarWidth, setSidebarWidth] = useState(240);  // Add state for sidebar width

  useEffect(() => {
    if (!auth.isAuthenticated || !auth.accessToken || !auth.characterId) {
      navigate('/');
      return;
    }

    const fetchMails = async () => {
      try {
        setLoading(true);
        setError(null);

        const headers = await eveMailService.getMailHeaders(auth.characterId, auth.accessToken);
        
        const characterIds = new Set<number>();
        headers.forEach(header => characterIds.add(header.from));
        
        const characterNames = new Map<number, string>();
        await Promise.all(
          Array.from(characterIds).map(async (id) => {
            try {
              const info = await eveMailService.getCharacterInfo(id, auth.accessToken!);
              characterNames.set(id, info.name);
            } catch (error) {
              console.error(`Failed to fetch character info for ID ${id}:`, error);
              characterNames.set(id, `Character #${id}`);
            }
          })
        );

        const mailPromises = headers.map(async (header) => {
          try {
            const content = await eveMailService.getMailContent(
              auth.characterId!,
              header.mail_id,
              auth.accessToken!
            );

            return {
              id: header.mail_id.toString(),
              from: characterNames.get(header.from) || `Character #${header.from}`,
              subject: header.subject,
              preview: content.body.substring(0, 100) + '...',
              content: content.body,
              date: header.timestamp,
              isRead: header.is_read,
              isStarred: false,
              to: auth.characterName || 'Me',
              type: header.from === Number(auth.characterId) ? 'sent' : 'inbox'  // Fix type comparison
            };
          } catch (error) {
            console.error(`Failed to fetch mail content for ID ${header.mail_id}:`, error);
            return null;
          }
        });

        const fetchedMails = (await Promise.all(mailPromises)).filter((mail): mail is Mail => mail !== null);
        setMails(fetchedMails);
      } catch (error) {
        console.error('Failed to fetch mails:', error);
        setError('Failed to load your mail. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMails();
  }, [auth.characterId, auth.accessToken, auth.characterName, auth.isAuthenticated, navigate]);

  const handleMailSelect = async (id: string) => {
    if (!auth.characterId || !auth.accessToken) return;

    setSelectedMail(id);
    setMails(mails.map(mail => 
      mail.id === id ? { ...mail, isRead: true } : mail
    ));

    try {
      await eveMailService.markMailRead(auth.characterId, parseInt(id), auth.accessToken);
    } catch (error) {
      console.error('Failed to mark mail as read:', error);
    }
  };

  const handleMailDelete = async (id: string) => {
    if (!auth.characterId || !auth.accessToken) return;

    try {
      await eveMailService.deleteMail(auth.characterId, parseInt(id), auth.accessToken);
      setMails(mails.map(mail => 
        mail.id === id ? { ...mail, type: 'trash' } : mail
      ));
      if (selectedMail === id) {
        setSelectedMail(null);
      }
    } catch (error) {
      console.error('Failed to delete mail:', error);
    }
  };

  const handleReply = async (id: string) => {
    const mail = mails.find(m => m.id === id);
    if (mail) {
      try {
        // Search for the character to get their ID and portrait
        const searchResults = await eveMailService.searchCharacters(mail.from);
        const recipientInfo = searchResults.find(char => char.name === mail.from);
        
        if (recipientInfo) {
          setReplyData({
            to: mail.from,
            subject: `Re: ${mail.subject}`,
            content: `\n\n-------- Original Message --------\nFrom: ${mail.from}\nDate: ${new Date(mail.date).toLocaleString()}\nSubject: ${mail.subject}\n\n${mail.content}`,
            recipientInfo: recipientInfo
          });
        } else {
          console.error('Could not find character info for:', mail.from);
        }
      } catch (error) {
        console.error('Failed to get character info:', error);
      }
      setIsComposeOpen(true);
    }
  };

  const handleSendMail = async (data: { to: string; subject: string; content: string }) => {
    if (!auth.characterId || !auth.accessToken) return;

    try {
      await eveMailService.sendMail(
        auth.characterId,
        auth.accessToken,
        data.subject,
        data.content,
        [{ recipient_id: parseInt(data.to), recipient_type: 'character' }]
      );
      setIsComposeOpen(false);
      // Refresh mail list
      window.location.reload();
    } catch (error) {
      console.error('Failed to send mail:', error);
    }
  };

  const selectedMailData = selectedMail 
    ? mails.find(mail => mail.id === selectedMail) || null
    : null;

  const filteredMails = mails.filter(mail => mail.type === selectedFolder);

  if (!auth.isAuthenticated || !auth.accessToken || !auth.characterId) {
    return (
      <Box sx={{ 
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}>
        <Typography>Please log in to view your mail.</Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ 
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}>
        <CircularProgress size={40} />
        <Typography>Loading your mail...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      height: '100vh',
      bgcolor: '#ffffff',
      display: 'flex',
    }}>
      <MailLayout
        selectedFolder={selectedFolder}
        onFolderSelect={setSelectedFolder}
        onComposeClick={() => setIsComposeOpen(true)}
        sidebarWidth={sidebarWidth}
        onSidebarResize={(width: number) => setSidebarWidth(width)}
      >
        <Box sx={{ 
          display: 'flex',
          height: '100%',
          borderLeft: '1px solid #e0e0e0'
        }}>
          <Resizable
            size={{ width: mailListWidth, height: '100%' }}
            onResizeStop={(e: MouseEvent | TouchEvent, direction: string, ref: HTMLElement, d: { width: number; height: number }) => {
              setMailListWidth(mailListWidth + d.width);
            }}
            minWidth={300}
            maxWidth={600}
            enable={{ right: true }}
            handleComponent={{
              right: (
                <Box
                  sx={{
                    width: '4px',
                    height: '100%',
                    position: 'absolute',
                    right: '-2px',
                    cursor: 'col-resize',
                    backgroundColor: 'transparent',
                    transition: 'background-color 0.2s',
                    '&:hover': {
                      backgroundColor: '#1976d2',
                    },
                  }}
                />
              ),
            }}
          >
            <Box sx={{ 
              height: '100%',
              borderRight: '1px solid #e0e0e0',
              overflow: 'auto'
            }}>
              <MailList
                mails={filteredMails}
                selectedMail={selectedMail}
                onMailSelect={handleMailSelect}
                onMailStar={(id) => {
                  setMails(mails.map(mail =>
                    mail.id === id ? { ...mail, isStarred: !mail.isStarred } : mail
                  ));
                }}
                onMailDelete={handleMailDelete}
              />
            </Box>
          </Resizable>
          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            <MailView
              mail={selectedMailData}
              onReply={handleReply}
              onForward={(id) => {
                const mail = mails.find(m => m.id === id);
                if (mail) {
                  setIsComposeOpen(true);
                }
              }}
              onDelete={handleMailDelete}
              onStar={(id) => {
                setMails(mails.map(mail =>
                  mail.id === id ? { ...mail, isStarred: !mail.isStarred } : mail
                ));
              }}
            />
          </Box>
        </Box>
      </MailLayout>
      <ComposeDialog
        open={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        onSend={handleSendMail}
        replyData={replyData}
      />
    </Box>
  );
};

export default Mail; 