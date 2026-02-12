import type { CartItem } from "../features/cart/cartTypes";

const KEY = "cart";

export const loadCartFromSession = (): CartItem[] => {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
};

export const saveCartToSession = (cartItems: CartItem[]): void => {
  sessionStorage.setItem(KEY, JSON.stringify(cartItems));
};

export const clearCartSession = (): void => {
  sessionStorage.removeItem(KEY);
};
