/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

export type Product = {
  id: string;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
  rating?: { rate: number };
};

type ProductCreate = Omit<Product, "id">;

const productsRef = collection(db, "products");

const mapProduct = (id: string, data: any): Product => ({
  id,
  title: String(data?.title ?? ""),
  price: Number(data?.price ?? 0),
  category: String(data?.category ?? ""),
  description: String(data?.description ?? ""),
  image: String(data?.image ?? ""),
  rating:
    data?.rating?.rate !== undefined
      ? { rate: Number(data.rating.rate) }
      : { rate: 0 },
});

export const getAllProducts = async (): Promise<Product[]> => {
  const snap = await getDocs(productsRef);
  return snap.docs.map((d) => mapProduct(d.id, d.data()));
};

export const getProductsByCategory = async (
  category: string,
): Promise<Product[]> => {
  const q = query(productsRef, where("category", "==", category));
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapProduct(d.id, d.data()));
};

export const getAllCategories = async (): Promise<string[]> => {
  const snap = await getDocs(productsRef);
  const categories = snap.docs
    .map((d) => String(d.data()?.category ?? "").trim())
    .filter(Boolean);

  return Array.from(new Set(categories));
};

export const createProduct = async (data: Omit<Product, "id">) => {
  const payload: ProductCreate = {
    title: data.title,
    price: data.price,
    category: data.category,
    description: data.description,
    image: data.image,
    rating: { rate: Number(data.rating?.rate ?? 0) },
  };
  await addDoc(productsRef, payload);
};

export const updateProduct = async (
  id: string,
  data: Partial<Omit<Product, "id">>,
) => {
  const ref = doc(db, "products", id);

  const payload: Record<string, unknown> = {};
  if (data.title !== undefined) payload.title = data.title;
  if (data.price !== undefined) payload.price = data.price;
  if (data.category !== undefined) payload.category = data.category;
  if (data.description !== undefined) payload.description = data.description;
  if (data.image !== undefined) payload.image = data.image;
  if (data.rating?.rate !== undefined)
    payload.rating = { rate: Number(data.rating.rate) };

  await updateDoc(ref, payload);
};

export const deleteProduct = async (id: string) => {
  await deleteDoc(doc(db, "products", id));
};
