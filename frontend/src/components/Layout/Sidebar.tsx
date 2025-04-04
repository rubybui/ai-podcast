import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import {
  Box,
  Drawer,
  List,
  ListItemIcon,
  Typography,
  Button,
} from "@mui/material";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import CategoryIcon from "@mui/icons-material/Category";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import PostAddIcon from "@mui/icons-material/PostAdd";
import InfoIcon from "@mui/icons-material/Info";
import Link from "next/link";
import PersonIcon from "@mui/icons-material/Person";

import useResponsive from "@/utils/useResponsive";
import UserButton from "@/components/common/UserButton";

import { NavLink, NavItemButton, HeaderLink, FeedBackButton } from "./style";

interface Props {
  openDrawer: boolean;
  toggleDrawer: (open: boolean) => void;
}

const drawerWidth = 220;

const userNavList = [
  {
    label: "Home",
    url: "",
    icon: <HomeIcon />,
    loginRequired: false,
  },
  // {
  //   label: "Search",
  //   url: "browse",
  //   icon: <SearchIcon />,
  //   loginRequired: false,
  // },
  {
    label: "Categories",
    url: "categories",
    icon: <CategoryIcon />,
    loginRequired: false,
  },
  // {
  //   label: "Create Podcast",
  //   url: "create-podcast",
  //   icon: <PostAddIcon />,
  //   loginRequired: true,
  // },
];

const adminNavList = [
  {
    label: "Podcasts",
    url: "admin/podcast",
    icon: <LibraryMusicIcon />,
    loginRequired: false,
  },
  {
    label: "Categories",
    url: "admin/category",
    icon: <CategoryIcon />,
    loginRequired: false,
  },
];

const commonNavList = [
  {
    label: "Profile",
    url: "profile",
    icon: <PersonIcon />,
    loginRequired: true,
  },
];

export default function Sidebar({ openDrawer, toggleDrawer }: Props) {
  const router = useRouter();
  const isAdminPage = router.pathname.indexOf("/admin") !== -1;
  const navListItems = isAdminPage
    ? [...adminNavList, ...commonNavList]
    : [...userNavList, ...commonNavList];

  const responsive = useResponsive();
  const { status } = useSession();

  const getActiveLink = (url: string, pathname: string) => {
    if (pathname === "/" && !url) return "active"; // Early return for home page

    return pathname.indexOf(url) > 0 ? "active" : "";
  };

  useEffect(() => {
    if (responsive.isMobile) {
      toggleDrawer(false);
    }
  }, [responsive.isMobile]);

  return (
    <Drawer
      variant={responsive.isMobile ? "temporary" : "persistent"}
      anchor="left"
      ModalProps={{
        keepMounted: false,
      }}
      open={openDrawer}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        border: "none",
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          // paddingTop: isAdminPage ? "92px" : "0px",
          background: "#49454F",
        },
      }}
      onClose={() => toggleDrawer(false)}
    >
      <Box mt={2} position="relative">
        <Box
          display="flex"
          gap="6px"
          alignItems="center"
          justifyContent="center"
          mb="16px"
        >
          <HeaderLink href="/">
            <Image
              src="/img/Logo_Aipodcast.png"
              width={190}
              height={47}
              alt="logo"
              priority
            />
          </HeaderLink>
        </Box>
        <Box textAlign="center">
          <List sx={{ mr: 3 }}>
            {navListItems.map((item) => (
              <NavItemButton
                key={item.url}
                className={getActiveLink(item.url, router.pathname)}
                disabled={item.loginRequired && status !== "authenticated"}
              >
                <NavLink href={`/${item.url}`}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <Typography variant="subtitle2" color="common.white">
                    {item.label}
                    <div>
                      {item.loginRequired && status !== "authenticated" ? (
                        <Typography variant="caption">
                          Login required
                        </Typography>
                      ) : (
                        <></>
                      )}
                    </div>
                  </Typography>
                </NavLink>
              </NavItemButton>
            ))}
          </List>

          <Box>
            <Link href="/create-podcast">
              <Button
                className={getActiveLink("create-podcast", router.pathname)}
                disabled={status !== "authenticated"}
                sx={{ textTransform: "none", p: "16px 32px" }}
                size="large"
                variant="contained"
              >
                Create podcast
              </Button>
            </Link>
          </Box>
        </Box>
      </Box>
      <Box width="100%" mt="auto" p={1}>
        <Box>
          <UserButton />
        </Box>
        <Box mt={2}>
          <Typography variant="caption" textAlign="center" component="div">
            Powered by{" "}
            <Link href="https://coderpush.com" target="_blank">
              <Typography component="span" variant="caption" color="primary">
                Coderpush
              </Typography>
            </Link>
          </Typography>
        </Box>
      </Box>
      <FeedBackButton
        variant="contained"
        startIcon={<InfoIcon fontSize="small" />}
      >
        <Link
          href="https://docs.google.com/forms/d/e/1FAIpQLScOurRfMqp5X723rueLZbpMvbpHKF8ZKHAgjj7K4mX0jtEqNQ/viewform"
          target="_blank"
        >
          <Typography variant="body2" color="primary.contrastText">
            Feedback
          </Typography>
        </Link>
      </FeedBackButton>
    </Drawer>
  );
}
