import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, CartItem } from '@/types';

interface AppContextType {
  // Cart
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Loading state
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const CART_STORAGE_KEY = '@sonia_hou_cart';
const WISHLIST_STORAGE_KEY = '@sonia_hou_wishlist';

export function AppProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load persisted data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [cartData, wishlistData] = await Promise.all([
          AsyncStorage.getItem(CART_STORAGE_KEY),
          AsyncStorage.getItem(WISHLIST_STORAGE_KEY),
        ]);

        if (cartData) {
          setCartItems(JSON.parse(cartData));
        }
        if (wishlistData) {
          setWishlist(JSON.parse(wishlistData));
        }
      } catch (error) {
        console.error('Error loading data from AsyncStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Persist cart data
  const persistCart = useCallback(async (items: CartItem[]) => {
    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error persisting cart:', error);
    }
  }, []);

  // Persist wishlist data
  const persistWishlist = useCallback(async (items: string[]) => {
    try {
      await AsyncStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error persisting wishlist:', error);
    }
  }, []);

  // Cart functions
  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      let newItems: CartItem[];

      if (existingItem) {
        newItems = prevItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...prevItems, { product, quantity }];
      }

      persistCart(newItems);
      return newItems;
    });
  }, [persistCart]);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems(prevItems => {
      const newItems = prevItems.filter(item => item.product.id !== productId);
      persistCart(newItems);
      return newItems;
    });
  }, [persistCart]);

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems => {
      const newItems = prevItems.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      );
      persistCart(newItems);
      return newItems;
    });
  }, [removeFromCart, persistCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    persistCart([]);
  }, [persistCart]);

  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }, [cartItems]);

  const getCartItemCount = useCallback(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  // Wishlist functions
  const toggleWishlist = useCallback((productId: string) => {
    setWishlist(prevWishlist => {
      const isInList = prevWishlist.includes(productId);
      const newWishlist = isInList
        ? prevWishlist.filter(id => id !== productId)
        : [...prevWishlist, productId];

      persistWishlist(newWishlist);
      return newWishlist;
    });
  }, [persistWishlist]);

  const isInWishlist = useCallback((productId: string) => {
    return wishlist.includes(productId);
  }, [wishlist]);

  const value: AppContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    wishlist,
    toggleWishlist,
    isInWishlist,
    isLoading,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
