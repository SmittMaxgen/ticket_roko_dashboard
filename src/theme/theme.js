// src/theme/theme.js
import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",

    primary: {
      main: "#f59e0b", // amber (your seat booking highlight)
    },

    secondary: {
      main: "#6366f1", // indigo (sections / highlights)
    },

    background: {
      default: "#0d0d14",
      paper: "#13131c",
    },

    text: {
      primary: "#ffffff",
      secondary: "#888888",
      disabled: "#444444",
    },

    success: {
      main: "#22c55e",
    },

    error: {
      main: "#ef4444",
    },

    warning: {
      main: "#f59e0b",
    },

    info: {
      main: "#3b82f6",
    },
  },

  typography: {
    fontFamily: "'DM Sans', sans-serif",

    h1: { fontWeight: 700, fontSize: "2rem" },
    h2: { fontWeight: 700, fontSize: "1.75rem" },
    h3: { fontWeight: 600, fontSize: "1.5rem" },
    h4: { fontWeight: 600, fontSize: "1.25rem" },
    h5: { fontWeight: 600, fontSize: "1rem" },
    h6: { fontWeight: 500, fontSize: "0.9rem" },

    body1: { fontSize: "0.95rem" },
    body2: { fontSize: "0.85rem" },
  },

  shape: {
    borderRadius: 10,
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 10,
          fontWeight: 600,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#13131c",
          border: "1px solid #1e1e2a",
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: "#1e1e2a",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});
