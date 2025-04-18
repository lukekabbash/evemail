import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography, useTheme, useMediaQuery, IconButton, Fab } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Resizable, ResizeCallback } from 're-resizable';
import MailLayout from '../components/mail/MailLayout';
import MailList from '../components/mail/MailList';
import MailView from '../components/mail/MailView';
import ComposeDialog, { type ReplyData } from '../components/mail/ComposeDialog';
import { useAuth } from '../contexts/AuthContext';
import { eveMailService } from '../services/eveMailService';
import { logEvent } from '../utils/analytics';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import MailHeader from '../components/mail/MailHeader';
import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ContactsModal, { Contact } from '../components/mail/ContactsModal';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

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
  fromId: number;
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchValue, setSearchValue] = useState('');
  const [contactsModalOpen, setContactsModalOpen] = useState(false);
  const [contactsSearchValue, setContactsSearchValue] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactsLoading, setContactsLoading] = useState(true);
  const [contactsError, setContactsError] = useState<string | null>(null);
  const [draftsModalOpen, setDraftsModalOpen] = useState(false);
  const [drafts, setDrafts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('mailDrafts') || '[]');
    } catch {
      return [];
    }
  });

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
              fromId: header.from,
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

  const handleSendMail = async (data: { to: string; subject: string; content: string; recipients: { recipient_id: number; recipient_type: string }[] }) => {
    if (!auth.characterId || !auth.accessToken) {
      alert('You must be logged in to send mail.');
      return;
    }

    try {
      if (!data.recipients || data.recipients.length === 0) {
        throw new Error('No recipients provided');
      }
      await eveMailService.sendMail(
        auth.characterId,
        auth.accessToken,
        data.subject,
        data.content,
        data.recipients
      );

      // Log successful mail send
      logEvent('send_mail', 'mail', 'Mail sent successfully');
      // Add the sent mail to the local state (show only first recipient for preview)
      const newMail = {
        id: `temp_${Date.now()}`,
        from: auth.characterName || 'Me',
        fromId: Number(auth.characterId),
        to: data.to,
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
      if (selectedFolder !== 'sent') {
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

  // Filter mails by search value (subject, from, to, preview)
  const filteredMails = mails.filter(mail => {
    const isFromMe = Number(mail.from) === Number(auth.characterId) || mail.from === auth.characterName;
    const search = searchValue.toLowerCase();
    const matches =
      mail.subject.toLowerCase().includes(search) ||
      mail.from.toLowerCase().includes(search) ||
      mail.to.toLowerCase().includes(search) ||
      mail.preview.toLowerCase().includes(search);
    switch (selectedFolder) {
      case 'sent':
        return isFromMe && matches;
      case 'inbox':
        return !isFromMe && mail.type !== 'trash' && matches;
      case 'trash':
        return mail.type === 'trash' && matches;
      default:
        return false;
    }
  });

  // Set sidebar width: 30% of viewport width on desktop, fallback to 312px, min 260, max 400
  const computedSidebarWidth = isMobile ? 320 : 312;

  useEffect(() => {
    if (!contactsModalOpen) return;
    if (!auth.isAuthenticated || !auth.accessToken || !auth.characterId) return;
    if (contacts.length > 0 && !contactsError) return;
    const fetchContacts = async () => {
      setContactsLoading(true);
      setContactsError(null);
      try {
        const data = await eveMailService.getContacts(auth.characterId, auth.accessToken);
        const contactsWithNames = await Promise.all(
          data.map(async (contact: any) => {
            try {
              const info = await eveMailService.getCharacterInfo(contact.contact_id, auth.accessToken);
              return {
                contact_id: contact.contact_id,
                name: info.name,
                portrait: `https://images.evetech.net/characters/${contact.contact_id}/portrait?size=32`,
              };
            } catch {
              return {
                contact_id: contact.contact_id,
                name: String(contact.contact_id),
                portrait: `https://images.evetech.net/characters/${contact.contact_id}/portrait?size=32`,
              };
            }
          })
        );
        contactsWithNames.sort((a, b) => a.name.localeCompare(b.name));
        setContacts(contactsWithNames);
      } catch (err) {
        setContactsError('Failed to load contacts');
      } finally {
        setContactsLoading(false);
      }
    };
    fetchContacts();
  }, [contactsModalOpen, auth.characterId, auth.accessToken]);

  // Helper to refresh drafts from localStorage
  const refreshDrafts = () => {
    setDrafts(JSON.parse(localStorage.getItem('mailDrafts') || '[]'));
  };

  // Open draft in compose dialog
  const handleOpenDraft = (draft: any, idx: number) => {
    setReplyData({
      to: draft.to,
      subject: draft.subject,
      content: draft.content,
      recipientInfo: draft.recipients && draft.recipients[0] ? draft.recipients[0] : undefined,
    });
    setIsComposeOpen(true);
    setDraftsModalOpen(false);
    // Remove draft from storage (optional: or keep until sent)
    // handleDeleteDraft(idx);
  };

  // Delete draft
  const handleDeleteDraft = (idx: number) => {
    const newDrafts = drafts.slice();
    newDrafts.splice(idx, 1);
    setDrafts(newDrafts);
    localStorage.setItem('mailDrafts', JSON.stringify(newDrafts));
  };

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

  // Mobile layout logic
  if (isMobile) {
    if (!selectedMail) {
      // Show only sidebar
      return (
        <Box sx={{ height: '100vh', bgcolor: '#1a1a2e', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <div className="w-full bg-[#23243a] px-2 pt-2 pb-1">
              <div className="relative">
                <select
                  id="folder-select"
                  value={selectedFolder}
                  onChange={e => setSelectedFolder(e.target.value)}
                  className="block w-full appearance-none bg-[#23243a] text-white/90 border border-white/20 rounded-md py-3 px-4 focus:outline-none focus:border-[#00b4ff] transition-colors peer"
                  aria-label="Select folder"
                  tabIndex={0}
                >
                  <option value="inbox">Inbox</option>
                  <option value="sent">Sent</option>
                  <option value="trash">Trash</option>
                </select>
                <label
                  htmlFor="folder-select"
                  className={
                    `absolute left-4 top-1/2 -translate-y-1/2 bg-[#23243a] px-1 text-white/70 pointer-events-none transition-all duration-200 ` +
                    (selectedFolder !== '' ? 'text-xs -top-2.5 left-2 bg-[#23243a] px-1' : 'text-base')
                  }
                >
                  Folder
                </label>
                <svg className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00b4ff]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto', '::-webkit-scrollbar': { width: 8 }, '::-webkit-scrollbar-thumb': { bgcolor: '#888', borderRadius: 4 }, '::-webkit-scrollbar-track': { bgcolor: '#23243a' } }}>
              <MailList
                mails={filteredMails}
                selectedMail={selectedMail}
                onMailSelect={handleMailSelect}
                onMailStar={id => setMails(mails.map(mail => mail.id === id ? { ...mail, isStarred: !mail.isStarred } : mail))}
                onMailDelete={handleMailDelete}
              />
            </Box>
          </Box>
          <Fab
            color="primary"
            aria-label="compose"
            onClick={() => {
              setReplyData(undefined);
              setIsComposeOpen(true);
            }}
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              bgcolor: '#00b4ff',
              '&:hover': {
                bgcolor: '#0099ff',
              },
            }}
          >
            <EditIcon />
          </Fab>
          <ComposeDialog
            open={isComposeOpen}
            onClose={() => {
              setIsComposeOpen(false);
              setReplyData(undefined);
            }}
            onSend={handleSendMail}
            replyData={replyData}
          />
        </Box>
      );
    } else {
      // Show only main view with back button
      return (
        <Box sx={{ height: '100vh', bgcolor: '#2a2a3e', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 1, bgcolor: '#23243a', display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => setSelectedMail(null)} sx={{ color: '#00b4ff', mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>
              Mail
            </Typography>
          </Box>
          <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', bgcolor: '#2a2a3e' }}>
            <MailView
              mail={selectedMailData}
              onReply={handleReply}
              onForward={handleForward}
              onDelete={handleMailDelete}
              onStar={id => setMails(mails.map(mail => mail.id === id ? { ...mail, isStarred: !mail.isStarred } : mail))}
            />
          </Box>
          <ComposeDialog
            open={isComposeOpen}
            onClose={() => {
              setIsComposeOpen(false);
              setReplyData(undefined);
            }}
            onSend={handleSendMail}
            replyData={replyData}
          />
        </Box>
      );
    }
  }

  if (!isMobile) {
    return (
      <>
        <MailHeader
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onContactsClick={() => setContactsModalOpen(true)}
          contacts={contacts}
          onContactSelect={(contact) => {
            setReplyData({
              to: contact.name,
              subject: '',
              content: '',
              recipientInfo: {
                id: contact.contact_id,
                name: contact.name,
                portrait: contact.portrait,
              },
            });
            setIsComposeOpen(true);
          }}
          onDraftsClick={() => setDraftsModalOpen(true)}
        />
        <MailLayout
          sidebarWidth={computedSidebarWidth}
          onComposeClick={() => {
            setReplyData(undefined);
            setIsComposeOpen(true);
          }}
          sidebar={
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100vh' }}>
              <div className="w-full bg-[#23243a] px-2 pt-2 pb-1">
                <div className="relative">
                  <select
                    id="folder-select"
                    value={selectedFolder}
                    onChange={e => setSelectedFolder(e.target.value)}
                    className="block w-full appearance-none bg-[#23243a] text-white/90 border border-white/20 rounded-md py-3 px-4 focus:outline-none focus:border-[#00b4ff] transition-colors peer"
                    aria-label="Select folder"
                    tabIndex={0}
                  >
                    <option value="inbox">Inbox</option>
                    <option value="sent">Sent</option>
                    <option value="trash">Trash</option>
                  </select>
                  <label
                    htmlFor="folder-select"
                    className={
                      `absolute left-4 top-1/2 -translate-y-1/2 bg-[#23243a] px-1 text-white/70 pointer-events-none transition-all duration-200 ` +
                      (selectedFolder !== '' ? 'text-xs -top-2.5 left-2 bg-[#23243a] px-1' : 'text-base')
                    }
                  >
                    Folder
                  </label>
                  <svg className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00b4ff]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto', '::-webkit-scrollbar': { width: 8 }, '::-webkit-scrollbar-thumb': { bgcolor: '#888', borderRadius: 4 }, '::-webkit-scrollbar-track': { bgcolor: '#23243a' } }}>
                <MailList
                  mails={filteredMails}
                  selectedMail={selectedMail}
                  onMailSelect={handleMailSelect}
                  onMailStar={id => setMails(mails.map(mail => mail.id === id ? { ...mail, isStarred: !mail.isStarred } : mail))}
                  onMailDelete={handleMailDelete}
                />
              </Box>
            </Box>
          }
          main={
            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                display: 'flex',
                flexDirection: 'column',
                bgcolor: '#2a2a3e',
                ...(selectedMailData === null && {
                  alignItems: 'center',
                  justifyContent: 'center',
                }),
              }}
            >
              <MailView
                mail={selectedMailData}
                onReply={handleReply}
                onForward={handleForward}
                onDelete={handleMailDelete}
                onStar={id => setMails(mails.map(mail => mail.id === id ? { ...mail, isStarred: !mail.isStarred } : mail))}
              />
            </Box>
          }
        />
        <ComposeDialog
          open={isComposeOpen}
          onClose={() => {
            setIsComposeOpen(false);
            setReplyData(undefined);
          }}
          onSend={handleSendMail}
          replyData={replyData}
          onDraftSave={refreshDrafts}
        />
        <ContactsModal
          open={contactsModalOpen}
          onClose={() => setContactsModalOpen(false)}
          contacts={contacts}
          onMailClick={(contact: Contact) => {
            setReplyData({
              to: contact.name,
              subject: '',
              content: '',
              recipientInfo: {
                id: contact.contact_id,
                name: contact.name,
                portrait: contact.portrait,
              },
            });
            setIsComposeOpen(true);
            setContactsModalOpen(false);
          }}
          searchValue={contactsSearchValue}
          onSearchChange={setContactsSearchValue}
          loading={contactsLoading}
          error={contactsError}
        />
        <Dialog open={draftsModalOpen} onClose={() => setDraftsModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ bgcolor: '#23243a', color: 'white' }}>Drafts</DialogTitle>
          <DialogContent sx={{ bgcolor: '#23243a', color: 'white' }}>
            {drafts.length === 0 ? (
              <Typography sx={{ color: 'white', textAlign: 'center', py: 4 }}>No drafts saved.</Typography>
            ) : (
              drafts.map((draft: any, idx: number) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, mb: 1, bgcolor: '#1a1a2e', borderRadius: 2 }}>
                  <Box sx={{ flex: 1, cursor: 'pointer' }} onClick={() => handleOpenDraft(draft, idx)}>
                    <Typography sx={{ fontWeight: 600 }}>{draft.subject || <span style={{ color: '#888' }}>(No subject)</span>}</Typography>
                    <Typography sx={{ fontSize: 14, color: '#bbb' }}>{draft.to || '(No recipients)'}</Typography>
                    <Typography sx={{ fontSize: 12, color: '#888' }}>{new Date(draft.date).toLocaleString()}</Typography>
                  </Box>
                  <Button onClick={() => handleDeleteDraft(idx)} sx={{ color: '#ff5555', ml: 2 }}>Delete</Button>
                </Box>
              ))
            )}
          </DialogContent>
          <DialogActions sx={{ bgcolor: '#23243a' }}>
            <Button onClick={() => setDraftsModalOpen(false)} sx={{ color: 'white' }}>Close</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <MailLayout
        sidebarWidth={computedSidebarWidth}
        onComposeClick={() => {
          setReplyData(undefined);
          setIsComposeOpen(true);
        }}
        sidebar={
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <div className="w-full bg-[#23243a] px-2 pt-2 pb-1">
              <div className="relative">
                <select
                  id="folder-select"
                  value={selectedFolder}
                  onChange={e => setSelectedFolder(e.target.value)}
                  className="block w-full appearance-none bg-[#23243a] text-white/90 border border-white/20 rounded-md py-3 px-4 focus:outline-none focus:border-[#00b4ff] transition-colors peer"
                  aria-label="Select folder"
                  tabIndex={0}
                >
                  <option value="inbox">Inbox</option>
                  <option value="sent">Sent</option>
                  <option value="trash">Trash</option>
                </select>
                <label
                  htmlFor="folder-select"
                  className={
                    `absolute left-4 top-1/2 -translate-y-1/2 bg-[#23243a] px-1 text-white/70 pointer-events-none transition-all duration-200 ` +
                    (selectedFolder !== '' ? 'text-xs -top-2.5 left-2 bg-[#23243a] px-1' : 'text-base')
                  }
                >
                  Folder
                </label>
                <svg className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00b4ff]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto', '::-webkit-scrollbar': { width: 8 }, '::-webkit-scrollbar-thumb': { bgcolor: '#888', borderRadius: 4 }, '::-webkit-scrollbar-track': { bgcolor: '#23243a' } }}>
              <MailList
                mails={filteredMails}
                selectedMail={selectedMail}
                onMailSelect={handleMailSelect}
                onMailStar={id => setMails(mails.map(mail => mail.id === id ? { ...mail, isStarred: !mail.isStarred } : mail))}
                onMailDelete={handleMailDelete}
              />
            </Box>
          </Box>
        }
        main={
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
              bgcolor: '#2a2a3e',
              ...(selectedMailData === null && {
                alignItems: 'center',
                justifyContent: 'center',
              }),
            }}
          >
            <MailView
              mail={selectedMailData}
              onReply={handleReply}
              onForward={handleForward}
              onDelete={handleMailDelete}
              onStar={id => setMails(mails.map(mail => mail.id === id ? { ...mail, isStarred: !mail.isStarred } : mail))}
            />
          </Box>
        }
      />
      <ComposeDialog
        open={isComposeOpen}
        onClose={() => {
          setIsComposeOpen(false);
          setReplyData(undefined);
        }}
        onSend={handleSendMail}
        replyData={replyData}
        onDraftSave={refreshDrafts}
      />
      <ContactsModal
        open={contactsModalOpen}
        onClose={() => setContactsModalOpen(false)}
        contacts={contacts}
        onMailClick={(contact: Contact) => {
          setReplyData({
            to: contact.name,
            subject: '',
            content: '',
            recipientInfo: {
              id: contact.contact_id,
              name: contact.name,
              portrait: contact.portrait,
            },
          });
          setIsComposeOpen(true);
          setContactsModalOpen(false);
        }}
        searchValue={contactsSearchValue}
        onSearchChange={setContactsSearchValue}
        loading={contactsLoading}
        error={contactsError}
      />
    </>
  );
};

export default Mail; 