import MessageIcon from "@mui/icons-material/Message";
import { Box, Button } from "@mui/material";
import Popover from "@mui/material/Popover";
import { useState } from "react";
import { db } from "../../config/Firebase"; // Ensure Firebase is initialized
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext"; // Custom hook to get current user
import UserList from "./navigation/UserList";

function Compose() {
  const [anchorEl, setAnchorEl] = useState(null);
  const { currentUser } = useAuth(); // Assuming you have authentication setup

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUserClick = async (event) => {
    const userElement = event.target.closest("[data-uid]");
  
    if (!userElement) {
      console.log("No valid user element clicked.");
      return;
    }
  
    const selectedUID = userElement.dataset.uid;
    const selectedUserName = userElement.innerText.trim();
  
    if (!selectedUID || !currentUser) {
      console.log("No user selected or no current user detected.");
      return;
    }
  
    console.log("Selected User UID:", selectedUID);
    console.log("Selected User Name:", selectedUserName);
  
    const userUID = currentUser.uid;
  
    try {
      console.log(`Checking if chatroom exists between ${userUID} and ${selectedUID} (${selectedUserName})...`);
  
      const chatQuery = query(
        collection(db, "directmessage"),
        where("participants", "array-contains", userUID)
      );
      const chatSnapshot = await getDocs(chatQuery);
  
      let chatExists = false;
  
      chatSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.participants.includes(selectedUID)) {
          chatExists = true;
        }
      });
  
      if (!chatExists) {
        const newChat = await addDoc(collection(db, "directmessage"), {
          participants: [userUID, selectedUID],
          createdAt: new Date(),
        });
        console.log(`New chatroom created with ID: ${newChat.id}`);
      } else {
        console.log("Chatroom already exists.");
      }
    } catch (error) {
      console.error("Error creating chatroom:", error);
    }
  
    handleClose();
  };
  
  return (
    <Box>
      <Button aria-describedby='simple-popover' onClick={handleClick}>
        <MessageIcon />
      </Button>
      <Popover
        id='simple-popover'
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box onClick={handleUserClick}>
          <UserList />
        </Box>
      </Popover>
    </Box>
  );
}

export default Compose;
