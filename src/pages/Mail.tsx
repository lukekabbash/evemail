import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useChecklist } from '../contexts/ChecklistContext';
import { mailService } from '../services/esiService';
import styles from './Mail.module.css';

const Mail: React.FC = () => {
  const { auth } = useAuth();
  const { items, totalItems } = useChecklist();
  const navigate = useNavigate();
  
  const [subject, setSubject] = useState('Shopping List');
  const [customMessage, setCustomMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Redirect to checklist if no items
  useEffect(() => {
    if (totalItems === 0) {
      navigate('/checklist');
    }
  }, [totalItems, navigate]);
  
  // Check if we have the mail permission
  const hasMailPermission = auth.scopes.includes('esi-mail.send_mail.v1');
  
  // Generate the shopping list text
  const generateShoppingList = (): string => {
    let mailBody = 'Shopping List:\n\n';
    
    items.forEach(item => {
      mailBody += `- ${item.name}: ${item.quantity.toLocaleString()}\n`;
    });
    
    if (customMessage) {
      mailBody += '\n' + customMessage;
    }
    
    return mailBody;
  };
  
  // Handle sending the mail
  const handleSendMail = async () => {
    if (!auth.characterId || !auth.accessToken) {
      setError('Authentication data missing.');
      return;
    }
    
    if (!hasMailPermission) {
      setError('You do not have permission to send mail. Please re-login with the mail scope.');
      return;
    }
    
    setIsSending(true);
    setError(null);
    
    try {
      // Create recipients array with the user's character ID
      const recipients = [{
        recipient_id: parseInt(auth.characterId),
        recipient_type: 'character'
      }];
      
      // Send the mail
      await mailService.sendMail(
        auth.characterId,
        auth.accessToken,
        subject,
        generateShoppingList(),
        recipients
      );
      
      setSuccess(true);
    } catch (error) {
      console.error('Failed to send mail:', error);
      setError('Failed to send mail. Please try again later.');
    } finally {
      setIsSending(false);
    }
  };
  
  // Handle navigation back to checklist
  const handleBackToChecklist = () => {
    navigate('/checklist');
  };
  
  return (
    <div>
      <h1 className={styles.title}>Send Shopping List as Mail</h1>
      
      {!hasMailPermission ? (
        <div className={styles.errorCard}>
          <h2 className={styles.errorTitle}>Missing Permission</h2>
          <p className={styles.errorText}>
            Your account doesn't have the required permission to send mail. Please log out and log back in with the mail permission.
          </p>
          <button 
            onClick={handleBackToChecklist}
            className={styles.backButton}
            aria-label="Return to checklist"
          >
            Return to Checklist
          </button>
        </div>
      ) : success ? (
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✓</div>
          <h2 className={styles.successTitle}>Mail Sent Successfully!</h2>
          <p className={styles.successText}>
            Your shopping list has been sent to {auth.characterName}.
          </p>
          <div className={styles.buttonGroup}>
            <button 
              onClick={handleBackToChecklist}
              className={styles.backButton}
              aria-label="Return to checklist"
            >
              Return to Checklist
            </button>
            <button 
              onClick={() => navigate('/')}
              className={styles.sendButton}
              aria-label="Return to home"
            >
              Return to Home
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className={styles.mailCard}>
            <h2 className={styles.mailTitle}>Mail Preview</h2>
            
            <div className={styles.formGroup}>
              <label htmlFor="subject" className={styles.label}>
                Subject
              </label>
              <input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={styles.input}
                aria-label="Mail subject"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="recipient" className={styles.label}>
                Recipient
              </label>
              <input
                id="recipient"
                type="text"
                value={auth.characterName || ''}
                disabled
                className={styles.inputDisabled}
                aria-label="Mail recipient"
              />
              <p className={styles.helpText}>
                Mail will be sent to your character.
              </p>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Shopping List
              </label>
              <div className={styles.shoppingList}>
                <pre>
                  {items.map((item, index) => (
                    <div key={index} className={styles.listItem}>
                      - {item.name}: {item.quantity.toLocaleString()}
                    </div>
                  ))}
                </pre>
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="customMessage" className={styles.label}>
                Additional Message (Optional)
              </label>
              <textarea
                id="customMessage"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={4}
                className={styles.input}
                placeholder="Add any notes or additional information..."
                aria-label="Additional message"
              />
            </div>
          </div>
          
          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}
          
          <div className={styles.actionButtons}>
            <button
              onClick={handleBackToChecklist}
              className={styles.backButton}
              aria-label="Back to checklist"
            >
              Back to Checklist
            </button>
            <button
              onClick={handleSendMail}
              disabled={isSending}
              className={styles.sendButton}
              aria-label="Send mail"
            >
              {isSending ? 'Sending...' : 'Send Mail'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mail; 