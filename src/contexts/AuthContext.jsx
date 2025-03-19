import React, { useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  deleteUser,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../config/Firebase"; // ✅ Correct import

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

const provider = new GoogleAuthProvider();

export function register(email, password) {
  return createUserWithEmailAndPassword(auth, email, password)
    .then((result) => {
      return result.user.updateProfile({
        displayName: document
          .getElementById("name")
          .value.replace(/(^\w{1})|(\s+\w{1})/g, (value) =>
            value.toUpperCase()
          ),
      });
    })
    .catch((error) => {
      console.error(error);
    });
}

export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export const googleLogin = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log(result.user);
    })
    .catch((error) => {
      console.error("Google Sign-in Failed:", error);
    });
};

export function logout() {
  return signOut(auth);
}

export function deleteAccount() {
  const user = auth.currentUser;
  if (user) {
    deleteUser(user)
      .then(() => console.log("User deleted successfully"))
      .catch((error) => {
        console.error("Deletion Failed:", error);
      });
  }
}

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    register,
    logout,
    deleteAccount,
    googleLogin,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
