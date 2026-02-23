import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CategorySelect from "../components/CategorySelect";
import ProductCard from "../components/ProductCard";
import type { Product } from "../firebase/productService";
import {
  getAllProducts,
  getProductsByCategory,
  getAllCategories,
} from "../firebase/productService";

const Home = () => {
  const [selected, setSelected] = useState<string>("all");

  const { data: categories = [], isLoading: catsLoading } = useQuery<string[]>({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  const { data: products = [], isLoading: productsLoading } = useQuery<
    Product[]
  >({
    queryKey: ["products", selected],
    queryFn: () =>
      selected === "all" ? getAllProducts() : getProductsByCategory(selected),
  });

  return (
    <div className="container">
      <h1 className="page-title">Products</h1>

      <div className="filter-row">
        <span className="filter-label">Filter by Category</span>
        <CategorySelect
          selected={selected}
          onChange={setSelected}
          categories={catsLoading ? [] : categories}
        />
      </div>

      {productsLoading ? (
        <p className="subtle">Loading products...</p>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
