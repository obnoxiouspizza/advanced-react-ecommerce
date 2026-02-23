import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  Timestamp,
  where,
  query,
} from "firebase/firestore";
import { db } from "./firebase";

export type OrderItem = {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
};

export type OrderDoc = {
  id: string;
  userId: string;
  items: OrderItem[];
  totalQuantity: number;
  totalPrice: number;
  createdAt: Timestamp;
};

type CreateOrderInput = {
  userId: string;
  items: OrderItem[];
  totalQuantity: number;
  totalPrice: number;
};

export const createOrder = async (input: CreateOrderInput): Promise<string> => {
  const ref = await addDoc(collection(db, "orders"), {
    userId: input.userId,
    items: input.items,
    totalQuantity: input.totalQuantity,
    totalPrice: input.totalPrice,
    createdAt: Timestamp.now(), // always present
  });

  return ref.id;
};

export const getOrdersForUser = async (userId: string): Promise<OrderDoc[]> => {
  const q = query(collection(db, "orders"), where("userId", "==", userId));
  const snap = await getDocs(q);

  const orders = snap.docs.map((d) => {
    const data = d.data() as Omit<OrderDoc, "id">;
    return { id: d.id, ...data };
  });

  // sort newest first
  orders.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());

  return orders;
};

export const getOrderById = async (
  orderId: string,
): Promise<OrderDoc | null> => {
  const snap = await getDoc(doc(db, "orders", orderId));
  if (!snap.exists()) return null;
  const data = snap.data() as Omit<OrderDoc, "id">;
  return { id: snap.id, ...data };
};
