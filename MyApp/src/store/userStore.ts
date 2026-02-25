import { create } from 'zustand';
import { Platform } from 'react-native';

// MMKV is only available on native platforms, not web
let storage: any = null;

try {
  // Only initialize MMKV on native platforms
  if (Platform.OS !== 'web') {
    const { MMKV } = require('react-native-mmkv');
    storage = new MMKV();
  }
} catch (error) {
  console.warn('MMKV initialization failed, using fallback storage:', error);
  // Fallback for web or if MMKV fails
  storage = null;
}

export interface User {
  id: string;
  phoneNumber: string;
  name?: string;
  city: 'Hyderabad' | 'Bangalore';
  stylePreferences: {
    wearMost: 'Ethnic' | 'Western' | 'Fusion' | 'All of These';
    stylePreference: 'Minimal' | 'Bold' | 'Casual' | 'Traditional';
  };
  profilePhoto?: string;
  savedItems: string[];
  orders: Order[];
  cashbackEarned: number;
  isLoggedIn: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  deliveryDate: string;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  size: string;
  color: string;
  price: number;
}

// Export storage for use elsewhere if needed
export { storage };

interface AppMode {
  mode: 'shopping' | 'selling' | null;
  hasCompletedOnboarding: boolean;
  selectedBoard?: string;
}

interface UserStore {
  user: User | null;
  appMode: AppMode;
  cart: CartItem[];
  savedItems: string[];

  // User actions
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  setAppMode: (mode: 'shopping' | 'selling') => void;
  setOnboardingComplete: (complete: boolean) => void;
  logout: () => void;

  // Cart actions
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateCartItem: (productId: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;
  getCartTotal: () => number;

  // Saved items actions
  addToSavedItems: (productId: string) => void;
  removeFromSavedItems: (productId: string) => void;
  isSaved: (productId: string) => boolean;

  // Persistence
  loadFromStorage: () => void;
  saveToStorage: () => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  appMode: {
    mode: null,
    hasCompletedOnboarding: false,
  },
  cart: [],
  savedItems: [],

  setUser: (user: User) => {
    set({ user });
    get().saveToStorage();
  },

  updateUser: (updates: Partial<User>) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    }));
    get().saveToStorage();
  },

  setAppMode: (mode: 'shopping' | 'selling') => {
    set((state) => ({
      appMode: { ...state.appMode, mode },
    }));
    get().saveToStorage();
  },

  setOnboardingComplete: (complete: boolean) => {
    set((state) => ({
      appMode: { ...state.appMode, hasCompletedOnboarding: complete },
    }));
    get().saveToStorage();
  },

  logout: () => {
    set({
      user: null,
      cart: [],
      savedItems: [],
      appMode: {
        mode: null,
        hasCompletedOnboarding: false,
      },
    });
    if (storage) {
      storage.clearAll();
    }
  },

  addToCart: (item: CartItem) => {
    set((state) => {
      const existingItem = state.cart.find(
        (cartItem) =>
          cartItem.productId === item.productId &&
          cartItem.size === item.size &&
          cartItem.color === item.color
      );

      if (existingItem) {
        return {
          cart: state.cart.map((cartItem) =>
            cartItem === existingItem
              ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
              : cartItem
          ),
        };
      }

      return { cart: [...state.cart, item] };
    });
    get().saveToStorage();
  },

  removeFromCart: (productId: string) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.productId !== productId),
    }));
    get().saveToStorage();
  },

  updateCartItem: (productId: string, updates: Partial<CartItem>) => {
    set((state) => ({
      cart: state.cart.map((item) =>
        item.productId === productId ? { ...item, ...updates } : item
      ),
    }));
    get().saveToStorage();
  },

  clearCart: () => {
    set({ cart: [] });
    get().saveToStorage();
  },

  getCartTotal: () => {
    return get().cart.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  addToSavedItems: (productId: string) => {
    set((state) => {
      if (!state.savedItems.includes(productId)) {
        return { savedItems: [...state.savedItems, productId] };
      }
      return state;
    });
    get().saveToStorage();
  },

  removeFromSavedItems: (productId: string) => {
    set((state) => ({
      savedItems: state.savedItems.filter((id) => id !== productId),
    }));
    get().saveToStorage();
  },

  isSaved: (productId: string) => {
    return get().savedItems.includes(productId);
  },

  loadFromStorage: () => {
    if (!storage) {
      console.warn('Storage not available on this platform');
      return;
    }
    try {
      const userString = storage.getString('user');
      const modeString = storage.getString('appMode');
      const cartString = storage.getString('cart');
      const savedItemsString = storage.getString('savedItems');

      if (userString) set({ user: JSON.parse(userString) });
      if (modeString) set({ appMode: JSON.parse(modeString) });
      if (cartString) set({ cart: JSON.parse(cartString) });
      if (savedItemsString) set({ savedItems: JSON.parse(savedItemsString) });
    } catch (error) {
      console.error('Error loading from storage:', error);
    }
  },

  saveToStorage: () => {
    if (!storage) {
      console.warn('Storage not available on this platform');
      return;
    }
    try {
      const state = get();
      storage.set('user', JSON.stringify(state.user));
      storage.set('appMode', JSON.stringify(state.appMode));
      storage.set('cart', JSON.stringify(state.cart));
      storage.set('savedItems', JSON.stringify(state.savedItems));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  },
}));
