export const fetchProducts = async () => {
  const res = await fetch("https://fakestoreapi.com/products");
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
};

export const fetchCategories = async () => {
  const res = await fetch("https://fakestoreapi.com/products/categories");
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
};

export const fetchProductsByCategory = async (category: string) => {
  const res = await fetch(
    `https://fakestoreapi.com/products/category/${category}`,
  );
  if (!res.ok) throw new Error("Failed to fetch category products");
  return res.json();
};
