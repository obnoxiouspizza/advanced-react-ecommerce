import { db } from "./firebase";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

export type UserProfile = {
  email: string;
  name: string;
  address: string;
};

export const createUserDoc = async (uid: string, email: string) => {
  await setDoc(doc(db, "users", uid), {
    email,
    name: "",
    address: "",
    createdAt: serverTimestamp(),
  });
};

export const getUserDoc = async (uid: string): Promise<UserProfile | null> => {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
};

export const updateUserDoc = async (
  uid: string,
  data: Partial<Omit<UserProfile, "email">>,
) => {
  await updateDoc(doc(db, "users", uid), data);
};

export const deleteUserDoc = async (uid: string) => {
  await deleteDoc(doc(db, "users", uid));
};
