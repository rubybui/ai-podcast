import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import {
  Button,
  Box,
  ListItemIcon,
  Menu,
  MenuItem,
  Avatar
} from "@mui/material";
import Logout from "@mui/icons-material/Logout";
import ContactsIcon from "@mui/icons-material/Contacts";
import Link from "next/link";

const UserButton = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const handleSignOut = () => {
    signOut();
  };

  const handleSignIn = () => {
    signIn();
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ textAlign: "center" }}>
      {session && session.user ? (
        <>
          <Button
            variant="text"
            startIcon={
              <Avatar
                src={session.user.image || "/img/podcast/microphone.png"}
                sx={{ width: 20, height: 20 }}
              />
            }
            onClick={handleClick}
            aria-controls={open ? "demo-positioned-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            sx={{
              padding: 0,
              "&:hover": {
                background: "none"
              }
            }}
          >
            <div style={{ textTransform: "none", textAlign: "left" }}>
              <div>{session.user.name}</div>
              <div style={{ fontWeight: "normal" }}>{session.user.email}</div>
            </div>
          </Button>
          <Menu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "center"
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center"
            }}
          >
            <MenuItem onClick={handleSignOut}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
            <MenuItem>
              <Link href={"/contact"} style={{color: "white"}}>
                <ListItemIcon>
                  <ContactsIcon fontSize="small" />
                </ListItemIcon>
                Contact Us
              </Link>
            </MenuItem>
          </Menu>
        </>
      ) : (
        <Button variant="contained" onClick={handleSignIn}>
          Login
        </Button>
      )}
    </Box>
  );
};

export default UserButton;
