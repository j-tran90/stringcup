import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Divider,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { format } from "date-fns";
import { db } from "../../config/firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const DirectMessageList = ({ messages }) => {
  return (
    <Box sx={{ overflowY: "auto", flex: 1, p: 2 }}>
      {messages.map((msg, index) => (
        <Card
          key={index}
          sx={{
            mb: 1,
            p: 1.5,
            borderRadius: 2,
            boxShadow: "none",
            borderLeft: 3,
            borderColor: index % 2 === 0 ? "#7289da" : "#99aab5",
            backgroundColor: index % 2 === 0 ? "#f3f3f8" : "white",
          }}
        >
          <CardContent sx={{ p: 1 }}>
            <div
              style={{ display: "flex", alignItems: "center", marginBottom: 8 }}
            >
              <Avatar src={msg.senderAvatar} sx={{ mr: 2 }} />
              <div style={{ flex: 1 }}>
                <Typography variant='body1' fontWeight='bold'>
                  {msg.sender}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  {msg.timestamp?.toDate
                    ? format(
                        new Date(msg.timestamp.toDate()),
                        "MMM dd, yyyy - HH:mm"
                      )
                    : "N/A"}
                </Typography>
              </div>
            </div>
            <Typography variant='body2' color='textSecondary' gutterBottom>
              <strong>To:</strong> {msg.recipients.join(", ")}
            </Typography>
            <Typography variant='body2' sx={{ whiteSpace: "pre-wrap" }}>
              {msg.message}
            </Typography>
            {index !== messages.length - 1 && <Divider sx={{ my: 2 }} />}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

DirectMessageList.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      sender: PropTypes.string.isRequired,
      recipients: PropTypes.arrayOf(PropTypes.string).isRequired,
      timestamp: PropTypes.object, // Firestore timestamp
      message: PropTypes.string.isRequired,
      senderAvatar: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) return;

    const chatroomId = "selected_chatroom_id"; // Replace with dynamic chatroom logic
    const messagesRef = collection(db, "directmessage", chatroomId, "messages");

    const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, []);

  const handleSendMessage = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      console.error("No user is currently authenticated.");
      return;
    }

    const recipientId = "recipient_id_placeholder"; // Replace with actual recipient ID logic
    const newChatroomRef = { id: "chatroom_id_placeholder" }; // Replace with actual chatroom reference logic

    if (newMessage.trim()) {
      const newMsg = {
        sender: currentUser.displayName || "Anonymous",
        senderId: currentUser.uid,
        recipients: [recipientId],
        timestamp: serverTimestamp(),
        message: newMessage,
        senderAvatar: currentUser.photoURL || "https://i.pravatar.cc/150?img=3",
      };

      try {
        await addDoc(
          collection(db, "directmessage", newChatroomRef.id, "messages"),
          newMsg
        );
        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <>
      <Box
        className='input-container'
        sx={{ display: "flex", flexDirection: "column", height: "80vh" }}
      >
        <DirectMessageList messages={messages} />

        <Box
          sx={(theme) => ({
            position: "fixed",
            bottom: 0,
            left: isDrawerOpen ? 240 : 0,
            width: isDrawerOpen ? "calc(100% - 240px)" : "100%",
            display: "flex",
            alignItems: "center",
            p: 2,
            backgroundColor: "white",
            zIndex: 1,
            [theme.breakpoints.down("sm")]: {
              left: 0,
              width: "100%",
            },
          })}
        >
          <TextField
            fullWidth
            variant='outlined'
            placeholder='Type your message...'
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            sx={{ mr: 1 }}
          />
          <Button
            variant='contained'
            color='primary'
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            Send
          </Button>
        </Box>
      </Box>
    </>
  );
}
