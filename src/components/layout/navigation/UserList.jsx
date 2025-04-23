import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../config/Firebase"; // Import the auth instance
import {
  collection,
  getDocs,
  getFirestore,
  setDoc,
  doc,
} from "firebase/firestore"; // Firestore methods
import { Avatar } from "@mui/material";

const db = getFirestore(); // Get Firestore instance

// Function to log and store the current user's UID and data
function logAndStoreCurrentUserData() {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Log the UID of the current user
      console.log(`Current User UID: ${user.uid}`);

      // Prepare user data to store in Firestore
      const userData = {
        name: user.displayName || "No Name", // If name is null, use 'No Name'
        email: user.email || "No Email",
        avatar: user.photoURL || "No Avatar URL",
      };

      try {
        // Store user data into Firestore
        await setDoc(doc(db, "users", user.uid), userData);
        console.log("User data stored successfully:", userData);
      } catch (error) {
        console.error("Error storing user data:", error);
      }
    } else {
      console.log("No user is currently authenticated.");
    }
  });
}

logAndStoreCurrentUserData(); // Call the function to log and store user data

// UserList component to render users from Firestore
function UserList() {
  const [users, setUsers] = useState([]); // State to store fetched users

  useEffect(() => {
    // Fetch users from Firestore on component mount
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users")); // Fetch "users" collection
        const usersData = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Document ID as UID
          ...doc.data(), // Spread user data (name, email, avatar)
        }));
        setUsers(usersData); // Set the users state with fetched data
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };

    fetchUsers(); // Call the function to fetch users
  }, []); // Empty dependency array to run this effect only once when component mounts

  return (
    <>
      <List>
        {users.map((user) => (
          <ListItem key={user.id} disablePadding>
            <ListItemButton data-uid={user.id}>
              <Avatar
                src={user.photoURL}
                alt={user.name}
                sx={{ marginRight: 2 }}
              />
              <ListItemText primary={user.name || "No Name"} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );
}

export default UserList;
