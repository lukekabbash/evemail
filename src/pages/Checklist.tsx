import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChecklist } from '../contexts/ChecklistContext';
import { useAuth } from '../contexts/AuthContext';
import styles from './Checklist.module.css';

const Checklist: React.FC = () => {
  const { items, updateQuantity, removeItem, clearChecklist, totalItems, totalValue } = useChecklist();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingQuantity, setEditingQuantity] = useState<string>('');
  
  // Start editing a quantity
  const handleStartEdit = (typeId: string, quantity: number) => {
    setEditingItemId(typeId);
    setEditingQuantity(quantity.toString());
  };
  
  // Save edited quantity
  const handleSaveEdit = () => {
    if (editingItemId !== null) {
      const quantity = parseInt(editingQuantity);
      if (!isNaN(quantity) && quantity > 0) {
        updateQuantity(editingItemId, quantity);
      }
      setEditingItemId(null);
    }
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditingItemId(null);
  };
  
  // Handle key press in quantity input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };
  
  // Navigate to mail page
  const handleSendMail = () => {
    navigate('/mail');
  };
  
  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Shopping Checklist</h1>
        
        <div className={styles.headerButtons}>
          <button
            onClick={clearChecklist}
            className={styles.clearButton}
            disabled={items.length === 0}
            aria-label="Clear checklist"
          >
            Clear List
          </button>
          {auth.isAuthenticated && (
            <button
              onClick={handleSendMail}
              className={styles.mailButton}
              disabled={items.length === 0}
              aria-label="Send as mail"
            >
              Send as Mail
            </button>
          )}
        </div>
      </div>
      
      {items.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>Your shopping list is empty.</p>
          <button
            onClick={() => navigate('/browse')}
            className={styles.browseButton}
            aria-label="Browse items"
          >
            Browse Items
          </button>
        </div>
      ) : (
        <div className={styles.table}>
          <div className={styles.tableContainer}>
            <table className={styles.tableContent}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th className={styles.headerCell}>Item</th>
                  <th className={styles.headerCell}>Quantity</th>
                  <th className={styles.headerCell}>Price</th>
                  <th className={styles.headerCellRight}>Actions</th>
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {items.map((item) => (
                  <tr key={item.typeId} className={styles.tableRow}>
                    <td className={styles.tableCell}>
                      <div className={styles.itemName}>{item.name}</div>
                    </td>
                    <td className={styles.tableCell}>
                      {editingItemId === item.typeId ? (
                        <input
                          type="number"
                          value={editingQuantity}
                          onChange={(e) => setEditingQuantity(e.target.value)}
                          onBlur={handleSaveEdit}
                          onKeyDown={handleKeyDown}
                          autoFocus
                          min="1"
                          className={styles.quantityInput}
                          aria-label={`Edit quantity for ${item.name}`}
                        />
                      ) : (
                        <div 
                          className={styles.quantity}
                          onClick={() => handleStartEdit(item.typeId, item.quantity)}
                          tabIndex={0}
                          onKeyDown={(e) => e.key === 'Enter' && handleStartEdit(item.typeId, item.quantity)}
                          aria-label={`${item.quantity} units of ${item.name}, click to edit`}
                        >
                          {item.quantity.toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className={styles.tableCell}>
                      {(item.price * item.quantity).toLocaleString()} ISK
                    </td>
                    <td className={styles.tableCell} style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => removeItem(item.typeId)}
                        className={styles.removeButton}
                        aria-label={`Remove ${item.name} from checklist`}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className={styles.tableFooter}>
                <tr>
                  <td className={styles.footerCell}>
                    Total Items: {items.length}
                  </td>
                  <td className={styles.footerCell}>
                    Total Quantity: {totalItems.toLocaleString()}
                  </td>
                  <td className={styles.footerCell} colSpan={2}>
                    Total Value: {totalValue.toLocaleString()} ISK
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
      
      {!auth.isAuthenticated && items.length > 0 && (
        <div className={styles.loginPrompt}>
          <p>Want to send this list to your in-game mailbox?</p>
          <button
            onClick={() => navigate('/login')}
            className={styles.loginButton}
            aria-label="Login with EVE Online"
          >
            Login with EVE Online
          </button>
        </div>
      )}
    </div>
  );
};

export default Checklist; 