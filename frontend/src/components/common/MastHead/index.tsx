import { useCallback, useEffect, useMemo, useState } from "react";
import { Box, List, ListItem, ListItemText, styled } from "@mui/material";
import { useRouter } from "next/router";
import { debounce } from "@mui/material/utils";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";

import SearchBar from "../SearchBar";
import ImageFallback from "../ImageFallback";

import useResponsive from "@/utils/useResponsive";
import { AppConfig } from "@/config";
import { IPodcast } from "@/types";
import { getPodcastThumbnail } from "@/utils";

interface Props {
  openDrawer: boolean;
  closeDrawer: (status: boolean) => void;
}
const drawerWidth = 220;

const DrawerButton = styled("button")(({ theme }) => ({
  position: "absolute",
  left: 10,
  top: "50%",
  transform: "translateY(-50%)",
  width: 40,
  height: 40,
  color: theme.palette.common.white,
  borderRadius: "50%",
  border: "none",
  background: "#49454F",
  cursor: "pointer",
  zIndex: 5,
}));

const MastHead = ({ openDrawer, closeDrawer }: Props) => {
  const router = useRouter();
  const responsive = useResponsive();
  const [podcasts, setPodcasts] = useState<IPodcast[]>([]);

  const onChangeSearch = useCallback(async (value: string) => {
    if (!value) {
      setPodcasts([]);
      return;
    }

    const name = value.trim();
    const res = await fetch(
      AppConfig.apiUrl + `/podcasts/search?name=${name}`,
      {
        method: "GET",
      }
    );
    const { data } = await res.json();
    setPodcasts(data);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", scrollingEvent);
    return () => {
      window.removeEventListener("scroll", scrollingEvent);
    };
  }, []);

  const scrollingEvent = () => {
    if (window.scrollY > 30) {
      document.getElementById("masthead")?.classList.add("shadow");
    } else {
      document.getElementById("masthead")?.classList.remove("shadow");
    }
  };

  const searchDelayed = useMemo(
    () => debounce(onChangeSearch, 500),
    [onChangeSearch]
  );

  const onClickPodcast = (url: string) => {
    setPodcasts([]);
    router.push(url);
  };

  return (
    <Box
      p={1}
      position="fixed"
      top="0"
      left="0"
      width={
        responsive.isMobile
          ? "calc(100vw)"
          : openDrawer
          ? "calc(100vw - 220px)"
          : "calc(100vw)"
      }
      zIndex={5}
      ml={openDrawer && !responsive.isMobile ? "220px" : 0}
      sx={{ transition: "all 0.2s ease" }}
    >
      <DrawerButton
        onClick={() => closeDrawer(!openDrawer)}
        className={openDrawer ? "open" : ""}
      >
        {openDrawer ? (
          <MenuOpenIcon sx={{ verticalAlign: "middle" }} />
        ) : (
          <MenuIcon sx={{ verticalAlign: "middle" }} />
        )}
      </DrawerButton>
      <Box
        id="masthead"
        sx={{
          position: "absolute",
          zIndex: -1,
          top: 0,
          left: 0,
          width: "100%",
          transition: "all .2s ease",
          height: 0,
          ["&.shadow"]: {
            height: "100%",
            backgroundColor: "#151515",
          },
        }}
      />
      <Box margin="0 auto">
        <List
          sx={{
            position: "relative",
            width: (theme) => ({
              maxWidth: "540px",
              margin: "0 auto",
              [theme.breakpoints.down("md")]: {
                paddingLeft: "50px",
                "& .MuiInputBase-root": {
                  width: "100%",
                },
              },
            }),
          }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          <SearchBar placeholder="Search" onChange={searchDelayed} />
          <Box
            sx={{
              position: "absolute",
              top: 50,
              left: 0,
              background: "#1c1b1f",
              zIndex: 2,
              borderRadius: 2,
              width: "100%",
            }}
          >
            {podcasts.map((podcast) => (
              <ListItem
                key={podcast._id}
                onClick={() => onClickPodcast(`/podcast/${podcast.slug}`)}
                sx={{
                  "& :hover": {
                    color: "#d0bcff",
                  },
                }}
              >
                <ImageFallback
                  src={getPodcastThumbnail(podcast)}
                  alt={podcast.name}
                  height={24}
                  width={24}
                />
                <ListItemText
                  primary={podcast.name}
                  sx={{
                    ml: 1,
                    display: "-webkit-box",
                    overflow: "hidden",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 1,
                  }}
                />
              </ListItem>
            ))}
          </Box>
        </List>
      </Box>
    </Box>
  );
};

export default MastHead;
