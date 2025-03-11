import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";

function Users() {
  const users = ["Lester", "User2", "User3", "User4", "User5"];

  return (
    <List>
      {users.map((user, index) => (
        <ListItem key={user} disablePadding>
          <ListItemButton>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={user} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}

export default Users;
