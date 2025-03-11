import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function UserComponent() {
  const [user, setUser] = useState(null);
  const { googleLogin, logout, currentUser } = useAuth();

  // If currentUser is already set from the context, you can use it
  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
    }
  }, [currentUser]);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      {user ? (
        <div>
          <h3>Welcome, {user.displayName}!</h3>
          <img
            src={user.photoURL}
            alt='User Avatar'
            style={{ borderRadius: "50%", width: "100px", height: "100px" }}
          />
          <br />
          <button onClick={logout}>Sign Out</button>
        </div>
      ) : (
        <button onClick={googleLogin}>Sign in with Google</button>
      )}
    </div>
  );
}
