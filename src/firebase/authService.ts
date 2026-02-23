import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  deleteUser,
  type User,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp, deleteDoc } from "firebase/firestore";

/* ================= REGISTER ================= */

export const registerWithEmail = async (email: string, password: string) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(
    doc(db, "users", cred.user.uid),
    {
      email: cred.user.email,
      createdAt: serverTimestamp(),
    },
    { merge: true },
  );

  return cred.user;
};

/* ================= LOGIN ================= */

/* Export BOTH names so your Login.tsx cannot break */
export const loginWithEmail = async (email: string, password: string) => {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
};

export const loginUser = loginWithEmail;

/* ================= LOGOUT ================= */

export const logout = async () => {
  await signOut(auth);
};

/* ================= DELETE ACCOUNT ================= */

export const deleteAccount = async (user: User) => {
  await deleteDoc(doc(db, "users", user.uid));
  await deleteUser(user);
};
