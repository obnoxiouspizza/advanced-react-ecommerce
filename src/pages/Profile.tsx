/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { getOrdersForUser, type OrderDoc } from "../firebase/orderService";

const Profile = () => {
  const { user, loading } = useAuth();

  const {
    data: orders = [],
    isLoading,
    isError,
    error,
  } = useQuery<OrderDoc[]>({
    queryKey: ["profile-orders", user?.uid],
    queryFn: () => getOrdersForUser(user!.uid),
    enabled: !!user && !loading,
  });

  if (loading) {
    return (
      <div className="container">
        <h1 className="page-title">Profile</h1>
        <p className="subtle">Loading user...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container">
        <h1 className="page-title">Profile</h1>
        <p className="subtle">Please login.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="page-title">Profile</h1>
      <p className="subtle">Signed in as: {user.email}</p>
      <p className="subtle">UID: {user.uid}</p>

      <div className="section">
        <h2>Recent Orders</h2>

        {isLoading && <p className="subtle">Loading orders...</p>}

        {isError && (
          <p className="subtle">
            Error loading orders: {(error as any)?.message ?? "Unknown error"}
          </p>
        )}

        {!isLoading && !isError && orders.length === 0 && (
          <p className="subtle">
            No orders yet. Add items to cart and checkout.
          </p>
        )}

        {!isLoading && !isError && orders.length > 0 && (
          <div className="cart-list">
            {orders.slice(0, 6).map((o) => {
              const date =
                o.createdAt?.toDate?.().toLocaleString?.() ?? "Unknown date";
              return (
                <div key={o.id} className="cart-item">
                  <div>
                    <p className="cart-item__title">
                      Order #{o.id.slice(0, 8)}
                    </p>
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
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
