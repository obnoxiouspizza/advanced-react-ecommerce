import axios from "axios";
import type { Product } from "../features/cart/cartTypes";

const api = axios.create({
  baseURL: "https://fakestoreapi.com",
});

export const fetchAllProducts = async (): Promise<Product[]> => {
  const res = await api.get<Product[]>("/products");
  return res.data;
};

export const fetchCategories = async (): Promise<string[]> => {
  const res = await api.get<string[]>("/products/categories");
  return res.data;
};

export const fetchProductsByCategory = async (
  category: string,
): Promise<Product[]> => {
  const res = await api.get<Product[]>(
    `/products/category/${encodeURIComponent(category)}`,
  );
  return res.data;
};
