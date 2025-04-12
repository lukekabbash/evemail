import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const LOCAL_STORAGE_KEY = 'eve-os-mail-checklist';

export interface ChecklistItem {
  typeId: string;  // Changed from 'id' to match EVE Online's type_id
  name: string;
  quantity: number;
  price: number;
}

interface ChecklistContextType {
  items: ChecklistItem[];
  addItem: (item: ChecklistItem) => void;
  removeItem: (typeId: string) => void;
  updateQuantity: (typeId: string, quantity: number) => void;
  clearChecklist: () => void;
  totalItems: number;
  totalValue: number;
}

const ChecklistContext = createContext<ChecklistContextType | null>(null);

export const useChecklist = () => {
  const context = useContext(ChecklistContext);
  if (!context) {
    throw new Error('useChecklist must be used within a ChecklistProvider');
  }
  return context;
};

export const ChecklistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { auth } = useAuth();
  const [items, setItems] = useState<ChecklistItem[]>(() => {
    // Initialize from local storage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse saved checklist:', e);
        }
      }
    }
    return [];
  });

  // Save to local storage whenever items change
  useEffect(() => {
    if (!auth.isAuthenticated) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, auth.isAuthenticated]);

  const addItem = (newItem: ChecklistItem) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.typeId === newItem.typeId);
      if (existingItem) {
        return currentItems.map(item =>
          item.typeId === newItem.typeId
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      return [...currentItems, newItem];
    });
  };

  const removeItem = (typeId: string) => {
    setItems(currentItems => currentItems.filter(item => item.typeId !== typeId));
  };

  const updateQuantity = (typeId: string, quantity: number) => {
    setItems(currentItems =>
      currentItems.map(item =>
        item.typeId === typeId ? { ...item, quantity } : item
      )
    );
  };

  const clearChecklist = () => {
    setItems([]);
    if (!auth.isAuthenticated) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalValue = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearChecklist,
    totalItems,
    totalValue,
  };

  return (
    <ChecklistContext.Provider value={value}>
      {children}
    </ChecklistContext.Provider>
  );
}; 