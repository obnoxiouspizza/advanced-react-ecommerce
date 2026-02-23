import type { CartItem } from "../features/cart/cartTypes";

export const loadCartFromSession = (): CartItem[] => {
  const data = sessionStorage.getItem("cart");
  return data ? JSON.parse(data) : [];
};

export const saveCartToSession = (cart: CartItem[]) => {
  sessionStorage.setItem("cart", JSON.stringify(cart));
};
