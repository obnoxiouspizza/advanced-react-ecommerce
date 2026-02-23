import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { getOrderById, type OrderDoc } from "../firebase/orderService";

const OrderDetails = () => {
  const { id } = useParams();
  const { user, loading } = useAuth();

  const { data, isLoading } = useQuery<OrderDoc | null>({
    queryKey: ["order", id],
    queryFn: () => getOrderById(id!),
    enabled: !!id,
  });

  if (loading) {
    return (
      <div className="container">
        <h1 className="page-title">Order Details</h1>
        <p className="subtle">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container">
        <h1 className="page-title">Order Details</h1>
        <p className="subtle">Please login.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container">
        <h1 className="page-title">Order Details</h1>
        <p className="subtle">Loading...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container">
        <h1 className="page-title">Order Details</h1>
        <p className="subtle">Order not found.</p>
      </div>
    );
  }

  // ✅ Security check: only allow the owner
  if (data.userId !== user.uid) {
    return (
      <div className="container">
        <h1 className="page-title">Order Details</h1>
        <p className="subtle">You do not have access to this order.</p>
      </div>
    );
  }

  const date = data.createdAt?.toDate?.().toLocaleString?.() ?? "Unknown date";

  return (
    <div className="container">
      <h1 className="page-title">Order #{data.id.slice(0, 8)}</h1>
      <p className="subtle">{date}</p>

      <div className="section cart-list">
        {data.items.map((it) => (
          <div key={it.productId + it.title} className="cart-item">
            <img
              src={it.image || "https://via.placeholder.com/150"}
              alt={it.title}
              onError={(e) =>
                (e.currentTarget.src = "https://via.placeholder.com/150")
              }
            />
            <div>
              <p className="cart-item__title">{it.title}</p>
              <p className="cart-item__sub">
                Qty: {it.quantity} • ${it.price}
              </p>
            </div>
            <div>${(it.price * it.quantity).toFixed(2)}</div>
          </div>
        ))}
      </div>

      <div className="cart-summary section">
        <div>
          <strong>Total Items:</strong> {data.totalQuantity}
          <br />
          <strong>Total:</strong> ${data.totalPrice}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
