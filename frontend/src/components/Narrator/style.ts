import { Box, styled } from "@mui/material";

interface NarratorProps {
  autoScrolling: boolean;
}

export const Narrator = styled(Box)(({ theme }) => ({
  marginTop: 20,
  maxHeight: 400,
  overflow: "hidden",
  overflowY: "scroll",
  position: "relative",
  background:
    "linear-gradient(0deg,rgba(208, 188, 255, 0.11),rgba(208, 188, 255, 0.11)),#1c1b1f",
  padding: 12,
  borderRadius: 8,

  "& .slick-slide .MuiTypography-root": {
    padding: "16px 0",
    fontWeight: 500,
    transform: "all .3s ease",
  },
  "& .active-sentence": {
    color: theme.palette.primary.main,
    borderRadius: "4px",
    marginY: 3,
    "& span": {
      color: "white",
      fontWeight: 600,
    },
  },
}));
