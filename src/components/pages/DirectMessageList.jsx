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

// Import JSON files from the catfish folder
import message1 from "../../catfish/message1.json";
import message2 from "../../catfish/message2.json";

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
            borderColor: index % 2 === 0 ? "#7289da" : "#99aab5", // Discord-like color distinction
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
                  {format(new Date(msg.timestamp), "MMM dd, yyyy - HH:mm")}
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
      timestamp: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.instanceOf(Date),
      ]).isRequired,
      message: PropTypes.string.isRequired,
      senderAvatar: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState(""); // New message input state
  const [isDrawerOpen, setIsDrawerOpen] = useState(true); // Track drawer state

  useEffect(() => {
    // Import the JSON files directly into the component
    const allMessages = [message1, message2]; // Add more as needed
    setMessages(allMessages);
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        sender: "Current User", // Placeholder sender name
        recipients: ["John Doe"], // Placeholder recipient
        timestamp: new Date().toISOString(),
        message: newMessage,
        senderAvatar: "https://i.pravatar.cc/150?img=3", // Placeholder avatar URL
      };

      // Add the new message to the messages list
      setMessages([...messages, newMsg]);
      setNewMessage(""); // Clear the input field
    }
  };

  return (
    <>
      <Box
        className='input-container'
        sx={{ display: "flex", flexDirection: "column", height: "80vh" }}
      >
        {/* Messages List with scrolling */}
        <DirectMessageList messages={messages} />

        {/* Fixed Input Field at Bottom */}
        <Box
          sx={(theme) => ({
            position: "fixed",
            bottom: 0,
            left: isDrawerOpen ? 240 : 0, // Adjust based on drawer state
            width: isDrawerOpen ? "calc(100% - 240px)" : "100%", // Ensure correct width
            display: "flex",
            alignItems: "center",
            p: 2,
            backgroundColor: "white",
            zIndex: 1,

            [theme.breakpoints.down("sm")]: {
              left: 0,
              width: "100%", // Full width on small screens
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

