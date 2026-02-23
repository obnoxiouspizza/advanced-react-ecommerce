/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { getOrdersForUser, type OrderDoc } from "../firebase/orderService";

const Orders = () => {
  const { user, loading } = useAuth();

  const {
    data: orders = [],
    isLoading,
    isError,
    error,
  } = useQuery<OrderDoc[]>({
    queryKey: ["orders", user?.uid],
    queryFn: () => getOrdersForUser(user!.uid),
    enabled: !!user && !loading,
  });

  if (loading) {
    return (
      <div className="container">
        <h1 className="page-title">Orders</h1>
        <p className="subtle">Loading user...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container">
        <h1 className="page-title">Orders</h1>
        <p className="subtle">Please login to view your orders.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container">
        <h1 className="page-title">Orders</h1>
        <p className="subtle">Loading orders...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container">
        <h1 className="page-title">Orders</h1>
        <p className="subtle">
          Error loading orders: {(error as any)?.message ?? "Unknown error"}
        </p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="page-title">Order History</h1>
      <p className="subtle">Orders saved under your account.</p>

      <div className="section cart-list">
        {orders.length === 0 ? (
          <p className="subtle">No orders yet.</p>
        ) : (
          orders.map((o) => {
            const date =
              o.createdAt?.toDate?.().toLocaleString?.() ?? "Unknown date";
            return (
              <div key={o.id} className="cart-item">
                <div>
                  <p className="cart-item__title">Order #{o.id.slice(0, 8)}</p>
                  <p className="cart-item__sub">
                    {date} • Items: {o.totalQuantity} • Total: ${o.totalPrice}
                  </p>
                </div>

                <div>
                  <Link className="btn" to={`/order-details/${o.id}`}>
                    View
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Orders;
