import { Link } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import "../layout.css";

export default function Navbar() {
  const items = useAppSelector((state) => state.cart.items);
  const totalCount = items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/cart">Cart ({totalCount})</Link>
    </nav>
  );
}
