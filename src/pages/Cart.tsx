import { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  removeFromCart,
  updateQty,
  clearCart,
} from "../features/cart/cartSlice";
import "../layout.css";

const PLACEHOLDER = "https://via.placeholder.com/200x200?text=No+Image";

export default function Cart() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);
  const [message, setMessage] = useState<string>("");

  const totals = useMemo(() => {
    const totalProducts = items.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = items.reduce(
      (sum, item) => sum + item.qty * item.price,
      0,
    );
    return { totalProducts, totalPrice };
  }, [items]);

  const handleCheckout = () => {
    dispatch(clearCart());
    setMessage("✅ Checkout complete! Your cart has been cleared.");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div>
      <h1 className="sectionTitle">Your Cart</h1>

      {message && <div className="toast">{message}</div>}

      {items.length === 0 ? (
        <p className="subtle">
          Your cart is empty. Add something from the Home page.
        </p>
      ) : (
        <>
          <div className="controlsRow">
            <span className="badge">Items: {totals.totalProducts}</span>
            <span className="badge">
              Total: ${totals.totalPrice.toFixed(2)}
            </span>
            <button className="btn btnSuccess" onClick={handleCheckout}>
              Checkout
            </button>
          </div>

          <div className="cartList">
            {items.map((item) => (
              <div key={item.id} className="cartRow">
                <div className="cartImgWrap">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="cartImg"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = PLACEHOLDER;
                    }}
                  />
                </div>

                <div className="cartRowBody">
                  <p className="noMargin">
                    <b>{item.title}</b>
                  </p>
                  <p className="tightMargin">${item.price.toFixed(2)} each</p>

                  <label className="subtle">
                    Quantity
                    <input
                      type="number"
                      min={0}
                      value={item.qty}
                      onChange={(e) =>
                        dispatch(
                          updateQty({
                            id: item.id,
                            qty: Number(e.target.value),
                          }),
                        )
                      }
                      className="qtyInput"
                    />
                  </label>
                </div>

                <button
                  className="btn btnDanger"
                  onClick={() => dispatch(removeFromCart(item.id))}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
