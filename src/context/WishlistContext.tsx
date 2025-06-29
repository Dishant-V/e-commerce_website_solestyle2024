import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { WishlistItem, Product } from '../types';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  priceDropItems: WishlistItem[];
  markPriceDropNotified: (productId: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const { user } = useAuth();

  // Load wishlist from localStorage when user changes
  useEffect(() => {
    if (user) {
      const savedWishlist = localStorage.getItem(`wishlist_${user.id}`);
      if (savedWishlist) {
        const parsedItems = JSON.parse(savedWishlist).map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt)
        }));
        setItems(parsedItems);
      }
    } else {
      setItems([]);
    }
  }, [user]);

  // Save wishlist to localStorage whenever items change
  useEffect(() => {
    if (user && items.length >= 0) {
      localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(items));
    }
  }, [items, user]);

  // Check for price drops
  useEffect(() => {
    if (items.length > 0) {
      const updatedItems = items.map(item => {
        const hasPriceDrop = item.product.price < item.originalPrice;
        if (hasPriceDrop && !item.priceDropNotified) {
          // In a real app, you would send a notification here
          console.log(`Price drop alert: ${item.product.name} is now $${item.product.price} (was $${item.originalPrice})`);
        }
        return item;
      });
      setItems(updatedItems);
    }
  }, [items]);

  const addToWishlist = (product: Product) => {
    if (!user) return;

    const existingItem = items.find(item => item.product.id === product.id);
    if (existingItem) return;

    const newItem: WishlistItem = {
      product,
      addedAt: new Date(),
      originalPrice: product.price,
      priceDropNotified: false
    };

    setItems(prevItems => [...prevItems, newItem]);
  };

  const removeFromWishlist = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.product.id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return items.some(item => item.product.id === productId);
  };

  const clearWishlist = () => {
    setItems([]);
  };

  const priceDropItems = items.filter(item => 
    item.product.price < item.originalPrice && !item.priceDropNotified
  );

  const markPriceDropNotified = (productId: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.product.id === productId
          ? { ...item, priceDropNotified: true }
          : item
      )
    );
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        priceDropItems,
        markPriceDropNotified
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};