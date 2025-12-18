import { create } from 'zustand';
import { CartItem } from '@/types/product';

interface CartStore {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  basketUUID: string;
  setItems: (items: CartItem[]) => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, quantity: number) => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  loading: false,
  error: null,
  basketUUID: '',
  setItems: (items) => set({ items }),
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) => set((state) => ({ 
    items: state.items.filter(item => item.id !== id) 
  })),
  updateItem: (id, quantity) => set((state) => ({
    items: state.items.map(item => 
      item.id === id ? { ...item, quantity } : item
    )
  }))
}));
