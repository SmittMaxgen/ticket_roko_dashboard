// src/theme/theme.js
import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",

    primary: {
      main: "#f59e0b",
      light: "#fbbf24",
      dark: "#d97706",
    },

    secondary: {
      main: "#6366f1",
      light: "#818cf8",
      dark: "#4f46e5",
    },

    background: {
      default: "#0f172a",
      paper: "#1a2744",
    },

    text: {
      primary: "#ffffff",
      secondary: "#a0aec0",
      disabled: "#475569",
    },

    success: {
      main: "#10b981",
      light: "#6ee7b7",
    },

    error: {
      main: "#ef4444",
      light: "#fca5a5",
    },

    warning: {
      main: "#f59e0b",
      light: "#fcd34d",
    },

    info: {
      main: "#3b82f6",
      light: "#93c5fd",
    },
  },

  typography: {
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",

    h1: { fontWeight: 800, fontSize: "2.5rem", letterSpacing: "-0.02em" },
    h2: { fontWeight: 700, fontSize: "2rem", letterSpacing: "-0.01em" },
    h3: { fontWeight: 700, fontSize: "1.75rem" },
    h4: { fontWeight: 600, fontSize: "1.375rem" },
    h5: { fontWeight: 600, fontSize: "1.125rem" },
    h6: { fontWeight: 600, fontSize: "1rem" },

    body1: { fontSize: "0.975rem", lineHeight: 1.6 },
    body2: { fontSize: "0.875rem", lineHeight: 1.5 },
    caption: { fontSize: "0.75rem", opacity: 0.8 },
  },

  shape: {
    borderRadius: 12,
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          fontWeight: 600,
          fontSize: "0.95rem",
          padding: "8px 20px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 12px 24px rgba(0,0,0,0.3)",
          },
        },
        contained: {
          background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
          color: "#fff",
          "&:hover": {
            background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#1e293b",
          border: "1px solid rgba(100, 116, 139, 0.3)",
          borderRadius: 12,
          backdropFilter: "blur(10px)",
          transition: "all 0.3s ease",
          "&:hover": {
            borderColor: "rgba(100, 116, 139, 0.6)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            transform: "translateY(-4px)",
          },
        },
      },
    },

    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "24px",
          "&:last-child": {
            paddingBottom: "24px",
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: "0.85rem",
          borderRadius: 6,
          height: "28px",
        },
        filledSuccess: {
          backgroundColor: "rgba(16, 185, 129, 0.15)",
          color: "#6ee7b7",
        },
        filledError: {
          backgroundColor: "rgba(239, 68, 68, 0.15)",
          color: "#fca5a5",
        },
        filledWarning: {
          backgroundColor: "rgba(245, 158, 11, 0.15)",
          color: "#fcd34d",
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            transition: "all 0.3s ease",
            "&:hover fieldset": {
              borderColor: "rgba(100, 116, 139, 0.6)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#f59e0b",
              boxShadow: "0 0 0 3px rgba(245, 158, 11, 0.1)",
            },
          },
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: "rgba(100, 116, 139, 0.2)",
        },
        head: {
          backgroundColor: "rgba(30, 41, 59, 0.8)",
          fontWeight: 700,
          fontSize: "0.875rem",
          color: "#e2e8f0",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#1e293b",
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#1a2744",
          borderBottom: "1px solid rgba(100, 116, 139, 0.2)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "scale(1.08)",
          },
        },
      },
    },
  },
});
