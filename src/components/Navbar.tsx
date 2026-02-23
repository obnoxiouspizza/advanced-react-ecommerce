import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { useAuth } from "../context/useAuth";
import { logout } from "../firebase/authService";

const Navbar = () => {
  const cartCount = useSelector((state: RootState) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0),
  );

  const { user } = useAuth();

  return (
    <header className="nav">
      <div className="nav__inner">
        <Link to="/" className="nav__brand">
          <span className="nav__logo">E</span>
          <span className="nav__title">EdgeMart</span>
        </Link>

        <nav className="nav__links">
          <NavLink className="nav__link" to="/">
            Home
          </NavLink>

          <NavLink className="nav__link" to="/cart">
            Cart <span className="nav__pill">{cartCount}</span>
          </NavLink>

          {user ? (
            <>
              <NavLink className="nav__link" to="/orders">
                Orders
              </NavLink>
              <NavLink className="nav__link" to="/manage-products">
                Manage Products
              </NavLink>
              <NavLink className="nav__link" to="/profile">
                Profile
              </NavLink>

              <button
                className="nav__link nav__button"
                type="button"
                onClick={logout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink className="nav__link" to="/login">
                Login
              </NavLink>
              <NavLink className="nav__link" to="/register">
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
