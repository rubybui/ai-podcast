import { useTheme, useMediaQuery } from "@mui/material";

const mobileSize = {
  card: 145,
  pagePadding: "10px 25px",
};

const desktopSize = {
  card: 145,
  pagePadding: "10px 88px",
};

const useResponsive = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return isMobile
    ? { isMobile, size: mobileSize }
    : { isMobile, size: desktopSize };
};

export default useResponsive;
