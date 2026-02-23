import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";

type ProductCardProps = {
  product: {
    id: string;
    title: string;
    price: number;
    category: string;
    description: string;
    image: string;
    rating?: { rate?: number };
  };
};

const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useDispatch();
  const rating = product.rating?.rate ?? 0;

  return (
    <div className="product-card">
      <div className="product-media">
        <img
          src={product.image}
          alt={product.title}
          onError={(e) =>
            (e.currentTarget.src = "https://via.placeholder.com/300")
          }
        />
      </div>

      <div className="product-content">
        <h3 className="product-title clamp-2">{product.title}</h3>

        <div className="product-meta">
          <span className="pill">{product.category}</span>
          <span className="pill">⭐ {rating}</span>
          <span className="pill">${product.price}</span>
        </div>

        <p className="product-desc clamp-4">{product.description}</p>

        <div className="product-footer">
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => dispatch(addToCart(product))}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
