import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image_url: string
  category: string
}

interface CartState {
  items: CartItem[]
  isCartOpen: boolean
  isCartShaking: boolean
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
  openCart: () => void
  closeCart: () => void
  triggerCartShake: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      isCartShaking: false,
      
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      
      triggerCartShake: () => {
        set({ isCartShaking: true });
        setTimeout(() => {
          set({ isCartShaking: false });
        }, 1000);
      },

      addItem: (newItem) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.id === newItem.id)
          const updatedItems = existingItem
            ? state.items.map((item) =>
                item.id === newItem.id
                  ? { ...item, quantity: item.quantity + newItem.quantity }
                  : item
              )
            : [...state.items, newItem];
          
          return { items: updatedItems, isCartShaking: true };
        });

        // Auto stop shake after 1s
        setTimeout(() => {
          set({ isCartShaking: false });
        }, 1000);
      },

      removeItem: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id),
      })),

      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        ),
      })),

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        const state = get()
        return state.items.reduce((total, item) => total + item.price * item.quantity, 0)
      },

      getItemCount: () => {
        const state = get()
        return state.items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: 'orvano-cart-storage',
      partialize: (state) => ({ items: state.items }), // Persist only items, not UI open/shake states
    }
  )
)

