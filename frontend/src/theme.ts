import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#d0bcff",
      dark: "#d0bcff",
      contrastText: "#381e72",
      light: "#EADDFF",
    },
    secondary: {
      main: "#ccc2dc",
      contrastText: "#332D41",
      dark: "#4a4458",
      light: "#E8DEF8",
    },
    background: {
      default: "#1c1b1f",
      paper: "#49454f",
    },
    error: {
      main: "#f2b8b5",
      contrastText: "#601410",
      dark: "#8C1D18",
      light: "#F9DEDC",
    },
    text: {
      disabled: "#E6E1E5",
    },
    common: {
      white: "#fff",
      black: "#000",
    },
  },
  typography: {
    h1: {
      fontSize: 96,
    },
    h2: {
      fontSize: 60,
    },
    h3: {
      fontSize: 48,
      fontWeight: 300,
    },
    h4: {
      fontSize: 48,
    },
    h5: {
      fontSize: 24,
    },
    h6: {
      fontSize: 20,
      fontWeight: 500,
    },
    subtitle1: {
      fontSize: 16,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: 14,
      lineHeight: 1.71,
    },
    body1: {
      fontSize: 16,
    },
    body2: {
      fontSize: 14,
    },
    button: {
      fontSize: 14,
      lineHeight: 1.14,
    },
    caption: {
      fontSize: 12,
      lineHeight: 1.33,
    },
    overline: {
      fontSize: 10,
      lineHeight: 1.5,
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          padding: "10px 24px",
          borderRadius: 100,
        },
        outlined: {
          borderColor: "#79747E",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background:
            "linear-gradient(0deg, rgba(208, 188, 255, 0.11), rgba(208, 188, 255, 0.11)), #1C1B1F",
        },
      },
    },
  },
  shape: {
    borderRadius: 4,
  },
});
