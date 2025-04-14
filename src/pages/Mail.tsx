import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Resizable, ResizeCallback } from 're-resizable';
import MailLayout from '../components/mail/MailLayout';
import MailList from '../components/mail/MailList';
import MailView from '../components/mail/MailView';
import ComposeDialog, { type ReplyData } from '../components/mail/ComposeDialog';
import { useAuth } from '../contexts/AuthContext';
import { eveMailService } from '../services/eveMailService';
import { logEvent } from '../utils/analytics';

// Add helper function to strip HTML and handle line breaks
const formatPreview = (html: string): string => {
  // Replace <br>, <br/>, <br /> with newlines
  const withLineBreaks = html.replace(/<br\s*\/?>/gi, '\n');
  // Strip remaining HTML tags
  const withoutTags = withLineBreaks.replace(/<[^>]+>/g, '');
  // Normalize whitespace and trim
  return withoutTags.replace(/\s+/g, ' ').trim();
};

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
  const [replyData, setReplyData] = useState<ReplyData | undefined>(undefined);
  const [mailListWidth, setMailListWidth] = useState(400);
  const [sidebarWidth, setSidebarWidth] = useState(240);

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

            const isFromMe = header.from === Number(auth.characterId);

            // For sent mails, we need to look up the recipient's name
            let recipientName = auth.characterName || 'Me';
            if (isFromMe && header.recipient_id) {
              try {
                const recipientInfo = await eveMailService.getCharacterInfo(header.recipient_id, auth.accessToken!);
                recipientName = recipientInfo.name;
              } catch (error) {
                console.error(`Failed to fetch recipient info for ID ${header.recipient_id}:`, error);
                recipientName = `Character #${header.recipient_id}`;
              }
            }

            return {
              id: header.mail_id.toString(),
              from: characterNames.get(header.from) || `Character #${header.from}`,
              subject: header.subject,
              preview: formatPreview(content.body).substring(0, 100) + '...',
              content: content.body,
              date: header.timestamp,
              isRead: header.is_read,
              isStarred: false,
              to: isFromMe ? recipientName : auth.characterName || 'Me',
              type: isFromMe ? 'sent' : 'inbox'
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
      logEvent('delete_mail', 'mail', 'Mail moved to trash');
    } catch (error) {
      console.error('Failed to delete mail:', error);
      logEvent('delete_mail_error', 'mail', 'Failed to delete mail');
    }
  };

  const handleReply = async (id: string) => {
    const mail = mails.find(m => m.id === id);
    if (!mail) return;

    try {
      const searchResults = await eveMailService.searchCharacters(mail.from);
      const recipientInfo = searchResults.find(char => char.name.toLowerCase() === mail.from.toLowerCase());
      
      if (recipientInfo) {
        const formattedDate = new Date(mail.date).toLocaleString();
        const replyContent = `\n\n-------- Original Message --------\nFrom: ${mail.from}\nDate: ${formattedDate}\nSubject: ${mail.subject}\n\n${mail.content}`;
        
        setReplyData({
          to: recipientInfo.name,
          subject: `Re: ${mail.subject}`,
          content: replyContent,
          recipientInfo: {
            id: recipientInfo.character_id,
            name: recipientInfo.name,
            portrait: recipientInfo.portrait_url
          }
        });
        setIsComposeOpen(true);
        logEvent('reply_mail', 'mail', 'Reply mail dialog opened');
      } else {
        console.error('Could not find character info for:', mail.from);
        logEvent('reply_mail_error', 'mail', 'Could not find recipient');
        alert('Could not find the character to reply to. Please try again.');
      }
    } catch (error) {
      console.error('Failed to get character info:', error);
      logEvent('reply_mail_error', 'mail', 'Failed to prepare reply');
      alert('Failed to prepare reply. Please try again.');
    }
  };

  const handleForward = (id: string) => {
    const mail = mails.find(m => m.id === id);
    if (!mail) return;

    const formattedDate = new Date(mail.date).toLocaleString();
    const forwardContent = `\n\n-------- Forwarded Message --------\nFrom: ${mail.from}\nDate: ${formattedDate}\nSubject: ${mail.subject}\nTo: ${mail.to}\n\n${mail.content}`;
    
    setReplyData({
      to: '',
      subject: `Fwd: ${mail.subject}`,
      content: forwardContent
    });
    setIsComposeOpen(true);
    logEvent('forward_mail', 'mail', 'Forward mail dialog opened');
  };

  const handleSendMail = async (data: { to: string; subject: string; content: string }) => {
    if (!auth.characterId || !auth.accessToken) {
      alert('You must be logged in to send mail.');
      return;
    }

    try {
      // Get recipient ID from character search
      const searchResults = await eveMailService.searchCharacters(data.to);
      const recipient = searchResults.find(char => char.name.toLowerCase() === data.to.toLowerCase());
      
      if (!recipient) {
        throw new Error('Recipient not found');
      }

      await eveMailService.sendMail(
        auth.characterId,
        auth.accessToken,
        data.subject,
        data.content,
        [{ recipient_id: recipient.character_id, recipient_type: 'character' }]
      );

      // Log successful mail send
      logEvent('send_mail', 'mail', 'Mail sent successfully');
      
      // Add the sent mail to the local state
      const newMail = {
        id: `temp_${Date.now()}`, // Temporary ID until we refresh
        from: auth.characterName || 'Me',
        to: recipient.name,
        subject: data.subject,
        content: data.content,
        preview: formatPreview(data.content).substring(0, 100) + '...',
        date: new Date().toISOString(),
        isRead: true,
        isStarred: false,
        type: 'sent' as const
      };
      
      setMails(prevMails => [...prevMails, newMail]);
      setIsComposeOpen(false);
      setReplyData(undefined);
      
      // If we're not in the sent folder, show a success message
      if (selectedFolder !== 'sent') {
        // You might want to add a toast/snackbar notification here
        console.log('Mail sent successfully');
      }
    } catch (error) {
      console.error('Failed to send mail:', error);
      logEvent('send_mail_error', 'mail', 'Failed to send mail');
      alert('Failed to send mail. Please make sure the recipient exists and try again.');
    }
  };

  const selectedMailData = selectedMail 
    ? mails.find(mail => mail.id === selectedMail) || null
    : null;

  const filteredMails = mails.filter(mail => {
    const isFromMe = Number(mail.from) === Number(auth.characterId) || mail.from === auth.characterName;
    
    switch (selectedFolder) {
      case 'sent':
        return isFromMe;
      case 'inbox':
        return !isFromMe && mail.type !== 'trash';
      case 'trash':
        return mail.type === 'trash';
      default:
        return false;
    }
  });

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
      bgcolor: '#1a1a2e', // Deep EVE blue
      display: 'flex',
    }}>
      <MailLayout
        selectedFolder={selectedFolder}
        onFolderSelect={setSelectedFolder}
        onComposeClick={() => {
          setReplyData(undefined);  // Clear any reply/forward data
          setIsComposeOpen(true);
        }}
        sidebarWidth={sidebarWidth}
        onSidebarResize={(width: number) => setSidebarWidth(width)}
      >
        <Box sx={{ 
          display: 'flex',
          height: '100%',
          borderLeft: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <Resizable
            size={{ width: mailListWidth, height: '100%' }}
            onResizeStop={(_e: MouseEvent | TouchEvent, _direction: string, _ref: HTMLElement, d: { width: number; height: number }) => {
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
                      backgroundColor: '#00b4ff',
                    },
                  }}
                />
              ),
            }}
          >
            <Box sx={{ 
              height: '100%',
              borderRight: '1px solid rgba(255, 255, 255, 0.1)',
              bgcolor: '#1a1a2e', // Deep EVE blue
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
          <Box sx={{ flexGrow: 1, overflow: 'auto', bgcolor: '#2a2a3e' /* Darker grey for main content */ }}>
            <MailView
              mail={selectedMailData}
              onReply={handleReply}
              onForward={handleForward}
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
        onClose={() => {
          setIsComposeOpen(false);
          setReplyData(undefined);  // Clear reply/forward data when closing
        }}
        onSend={handleSendMail}
        replyData={replyData}
      />
    </Box>
  );
};

export default Mail; 