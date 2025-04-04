import { Box, Typography, styled } from "@mui/material";

export const Banner = styled(Box)(({ theme }) => ({
  height: "300px",
  position: "relative",
}));

export const BannerOverlay = styled(Box)(({ theme }) => ({
  height: "30vh",
  maxHeight: "500px",
  minHeight: "550px",
  backgroundColor: "#d0bcff",
  backgroundImage: `linear-gradient(rgba(0,0,0,.6) 0,#1c1b1f 100%, rgba(0,0,0,.6))`,
  position: "absolute",
  width: "100%",
  zIndex: -1,
  top: "0",
  left: 0,
}));

export const BannerHeading = styled(Typography)(({ theme }) => ({
  position: "absolute",
  bottom: 15,
  left: 15,
  align: "center",
  fontWeight: "600",
}));
