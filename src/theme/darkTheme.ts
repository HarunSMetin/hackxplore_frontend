import { createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#181A20", // Match the color in index.css
      paper: "rgba(35, 39, 47, 0.85)", // Match the color used in components
    },
    primary: {
      main: "#00bcd4", // The cyan color used in most components
    },
    secondary: {
      main: "#4CAF50",
    },
    text: {
      primary: "#e0e4ea", // Match the commonly used text color
      secondary: "#b0b8c1", // Match the secondary text color used
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    fontWeightBold: 700,
    fontWeightMedium: 500,
    fontWeightRegular: 400,
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(40, 40, 40, 0.7)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            transform: "scale(1.02)",
            boxShadow: "0 6px 8px rgba(0, 0, 0, 0.2)",
          },
        },
      },
    },
  },
});

export default darkTheme;
