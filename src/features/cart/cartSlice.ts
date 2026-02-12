import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartItem, Product } from "./cartTypes";
import {
  loadCartFromSession,
  saveCartToSession,
  clearCartSession,
} from "../../utils/sessionCart";

type CartState = {
  items: CartItem[];
};

const initialState: CartState = {
  items: loadCartFromSession(),
};

const persist = (items: CartItem[]) => {
  saveCartToSession(items);
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const existing = state.items.find((p) => p.id === product.id);

      if (existing) {
        existing.qty += 1;
      } else {
        state.items.push({ ...product, qty: 1 });
      }

      persist(state.items);
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      state.items = state.items.filter((p) => p.id !== id);
      persist(state.items);
    },

    updateQty: (state, action: PayloadAction<{ id: number; qty: number }>) => {
      const { id, qty } = action.payload;
      const item = state.items.find((p) => p.id === id);
      if (!item) return;

      item.qty = qty;

      if (item.qty <= 0) {
        state.items = state.items.filter((p) => p.id !== id);
      }

      persist(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      clearCartSession();
    },
  },
});

export const { addToCart, removeFromCart, updateQty, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
