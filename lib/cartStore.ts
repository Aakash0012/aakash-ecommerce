import { create } from 'zustand';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalAmount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  addToCart: (product) => {
    const current = get().cart;
    const existing = current.find((item) => item.id === product.id);
    if (existing) {
      set({
        cart: current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ),
      });
    } else {
      set({ cart: [...current, { ...product, quantity: 1 }] });
    }
  },
  removeFromCart: (productId) =>
    set({ cart: get().cart.filter((item) => item.id !== productId) }),
  updateQuantity: (productId, quantity) =>
    set({
      cart: get().cart.map((item) =>
        item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
      ),
    }),
  clearCart: () => set({ cart: [] }),
  totalItems: () => get().cart.reduce((sum, item) => sum + item.quantity, 0),
  totalAmount: () => get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
}));