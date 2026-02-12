import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllProducts, fetchProductsByCategory } from "../api/fakestore";
import CategorySelect from "../components/CategorySelect";
import "../layout.css";

import ProductCard from "../components/ProductCard";

export default function Home() {
  const [category, setCategory] = useState<string>("all");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", category],
    queryFn: () =>
      category === "all"
        ? fetchAllProducts()
        : fetchProductsByCategory(category),
  });

  if (isLoading) return <p className="subtle">Loading products...</p>;
  if (isError || !data)
    return <p className="subtle">Failed to load products.</p>;

  return (
    <div>
      <h1 className="sectionTitle">Product Catalog</h1>
      <p className="subtle">
        Browse products, filter by category, and add items to your cart.
      </p>

      <div className="controlsRow">
        <CategorySelect value={category} onChange={setCategory} />
        <span className="badge">{data.length} Results</span>
      </div>

      <div className="productGrid">
        {data.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
