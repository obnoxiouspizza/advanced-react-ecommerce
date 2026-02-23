import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type CartItem = {
  id: string | number;
  title: string;
  price: number;
  image: string;
  category?: string;
  description?: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
};

const loadCart = (): CartItem[] => {
  try {
    const raw = sessionStorage.getItem("cart");
    if (!raw) return [];
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
};

const saveCart = (items: CartItem[]) => {
  try {
    sessionStorage.setItem("cart", JSON.stringify(items));
  } catch {
    // ignore
  }
};

const initialState: CartState = {
  items: loadCart(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{
        id: string | number;
        title: string;
        price: number;
        image: string;
        category?: string;
        description?: string;
      }>,
    ) => {
      const existing = state.items.find((i) => i.id === action.payload.id);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }

      saveCart(state.items);
    },

    removeFromCart: (state, action: PayloadAction<string | number>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      saveCart(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      saveCart(state.items);
    },

    incrementQty: (state, action: PayloadAction<string | number>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (!item) return;
      item.quantity += 1;
      saveCart(state.items);
    },

    decrementQty: (state, action: PayloadAction<string | number>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (!item) return;

      item.quantity -= 1;

      // if qty hits 0, remove item
      if (item.quantity <= 0) {
        state.items = state.items.filter((i) => i.id !== action.payload);
      }

      saveCart(state.items);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  incrementQty,
  decrementQty,
} = cartSlice.actions;

export default cartSlice.reducer;
