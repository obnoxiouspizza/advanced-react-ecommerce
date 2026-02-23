/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../app/store";
import {
  clearCart,
  removeFromCart,
  incrementQty,
  decrementQty,
} from "../features/cart/cartSlice";
import { useAuth } from "../context/useAuth";
import { createOrder, type OrderItem } from "../firebase/orderService";

const Cart = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [message, setMessage] = useState<string | null>(null);

  const totals = useMemo(() => {
    const totalQuantity = cartItems.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = cartItems.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0,
    );
    return { totalQuantity, totalPrice: Number(totalPrice.toFixed(2)) };
  }, [cartItems]);

  const checkout = async () => {
    setMessage(null);

    if (!user) {
      setMessage("Please login to place an order.");
      return;
    }

    if (cartItems.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }

    const items: OrderItem[] = cartItems.map((i) => ({
      productId: String(i.id),
      title: i.title,
      price: i.price,
      quantity: i.quantity,
      image: i.image,
    }));

    try {
      await createOrder({
        userId: user.uid,
        items,
        totalQuantity: totals.totalQuantity,
        totalPrice: totals.totalPrice,
      });

      dispatch(clearCart());
      setMessage("Checkout complete! Your order was saved.");
    } catch (err: any) {
      setMessage(err?.message ?? "Checkout failed.");
    }
  };

  return (
    <div className="container cart-page">
      <h1 className="page-title">Cart</h1>
      {message && <p className="subtle">{message}</p>}

      <div className="cart-summary-card">
        <div className="totals">
          <div>
            <strong>Total Items:</strong> {totals.totalQuantity}
          </div>
          <div>
            <strong>Total Price:</strong> ${totals.totalPrice}
          </div>
        </div>

        <button className="btn btn-primary" type="button" onClick={checkout}>
          Checkout
        </button>
      </div>

      <div className="cart-list">
        {cartItems.length === 0 ? (
          <p className="subtle">No items in your cart.</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img
                src={item.image}
                alt={item.title}
                onError={(e) =>
                  (e.currentTarget.src = "https://via.placeholder.com/150")
                }
              />

              <div>
                <p className="cart-item__title">{item.title}</p>
                <p className="cart-item__sub">
                  ${item.price} each • Subtotal: $
                  {(item.price * item.quantity).toFixed(2)}
                </p>

                {/* Quantity controls */}
                <div>
                  <button
                    className="btn"
                    type="button"
                    onClick={() => dispatch(decrementQty(item.id))}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    className="btn"
                    type="button"
                    onClick={() => dispatch(incrementQty(item.id))}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                className="btn btn-danger"
                type="button"
                onClick={() => dispatch(removeFromCart(item.id))}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Cart;
