import { Box, Button, ListItem, ListItemButton, styled } from "@mui/material";
import Link from "next/link";

const drawerWidth = 220;

export const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "isAdminPage",
})<{
  open?: boolean;
  isAdminPage?: boolean;
}>(({ theme, open, isAdminPage }) => ({
  position: "relative",
  flexGrow: 1,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
  // paddingTop: isAdminPage ? 80 : 0,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    [theme.breakpoints.up("md")]: {
      marginLeft: drawerWidth,
    },
  }),
}));

export const NavLink = styled(Link)(() => ({
  display: "flex",
  width: "100%",
  padding: "12px 20px",
}));

export const NavItem = styled(ListItem)(({ theme }) => ({
  marginBottom: 8,
  borderTopRightRadius: 24,
  borderBottomRightRadius: 24,
  padding: 0,
  transition: "background .3s ease",
  "&.active": {
    background: theme.palette.primary.main,
    "& .MuiTypography-root": {
      color: theme.palette.primary.contrastText,
    },
    "& .MuiListItemIcon-root": {
      color: theme.palette.primary.contrastText,
    },
  },
  "&:hover:not(.active)": {
    background: "rgba(232, 222, 248, 0.16)",
    "& .MuiTypography-root": {
      color: theme.palette.common.white,
    },
    "& .MuiListItemIcon-root": {
      color: theme.palette.common.white,
    },
  },
}));

export const NavItemButton = styled(ListItemButton)(({ theme }) => ({
  marginBottom: 8,
  borderTopRightRadius: 24,
  borderBottomRightRadius: 24,
  padding: 0,
  transition: "background .3s ease",
  "&.active": {
    background: theme.palette.primary.main,
    "& .MuiTypography-root": {
      color: theme.palette.primary.contrastText,
    },
    "& .MuiListItemIcon-root": {
      color: theme.palette.primary.contrastText,
    },
  },
  "&:hover:not(.active)": {
    background: "rgba(232, 222, 248, 0.16)",
    "& .MuiTypography-root": {
      color: theme.palette.common.white,
    },
    "& .MuiListItemIcon-root": {
      color: theme.palette.common.white,
    },
  },
}));

export const HeaderBar = styled(Box)(() => ({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  padding: "16px",
  zIndex: 1201,
  background:
    "linear-gradient(0deg, rgba(208, 188, 255, 0.08), rgba(208, 188, 255, 0.08)), #1C1B1F;",
}));

export const HeaderLink = styled(Link)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "6px",
}));

export const FeedBackButton = styled(Button)(({ theme }) => ({
  position: "absolute",
  left: 0,
  bottom: 150,
  padding: "5px 8px",
  borderRadius: 2,
  boxShadow: "none",
  fontWeight: 500,
  textTransform: "none",
  fontSize: 12,
  fontStretch: "expanded",
  transform: "rotate(-90deg) translateY(-35px)",
}));
