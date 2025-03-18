import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Box } from "@mui/material";

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
    <Box style={{ textAlign: "center", right: "0", position: "absolute", paddingRight: "24px"}}>
      {user ? (
        <Box>
          <img
            src={user.photoURL}
            alt='User Avatar'
            style={{
              borderRadius: "50%",
              width: "auto",
              maxHeight: "30px",
            }}
          />
          {/* <button onClick={logout}>Sign Out</button> */}
        </Box>
      ) : (
        <button onClick={googleLogin}>Sign in with Google</button>
      )}
    </Box>
  );
}
