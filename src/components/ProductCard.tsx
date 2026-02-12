import type { Product } from "../features/cart/cartTypes";
import { useAppDispatch } from "../app/hooks";
import { addToCart } from "../features/cart/cartSlice";
import { toTitleCase } from "../utils/format";
import "../layout.css";

const PLACEHOLDER = "https://via.placeholder.com/300x300?text=No+Image";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const dispatch = useAppDispatch();

  return (
    <div className="card">
      <div className="productImgWrap">
        <img
          src={product.image}
          alt={product.title}
          className="productImg"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = PLACEHOLDER;
          }}
        />
      </div>

      <div className="cardHeader">
        <h3 className="productTitle">{product.title}</h3>
      </div>

      <div className="metaRow">
        <span>Category: {toTitleCase(product.category)}</span>
        <span>Rating: {product.rating?.rate ?? "N/A"}</span>
      </div>

      <p className="desc">{product.description}</p>

      <div className="controlsRow">
        {/* If inline styles are banned, remove this line and I’ll give you a class */}
        <span className="badge">${product.price.toFixed(2)}</span>
        <button
          className="btn btnPrimary"
          onClick={() => dispatch(addToCart(product))}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
