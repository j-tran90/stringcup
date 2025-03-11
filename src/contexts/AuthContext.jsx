// AuthContext.jsx

import React, { useContext, useEffect, useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  deleteUser,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import app from "../config/Firebase";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

const provider = new GoogleAuthProvider();
const authInstance = getAuth(app);

export function register(email, password) {
  return createUserWithEmailAndPassword(authInstance, email, password)
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
  return signInWithEmailAndPassword(authInstance, email, password);
}

export const googleLogin = () => {
  signInWithPopup(authInstance, provider)
    .then((result) => {
      console.log(result.user);
    })
    .catch((error) => {
      console.error("Google Sign-in Failed:", error);
    });
};

export function logout() {
  return signOut(authInstance);
}

export function deleteAccount() {
  const user = authInstance.currentUser;
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
    const unsubscribe = onAuthStateChanged(authInstance, (user) => {
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
