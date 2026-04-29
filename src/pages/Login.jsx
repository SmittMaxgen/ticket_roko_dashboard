// src/pages/Login.jsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/EmailOutlined";
import LockIcon from "@mui/icons-material/LockOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { loginThunk } from "../features/auth/authThunks";
import {
  selectAuthLoading,
  selectAuthError,
} from "../features/auth/authSelectors";
import { clearAuthError } from "../features/auth/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const loading = useSelector(selectAuthLoading);
  const apiError = useSelector(selectAuthError);

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [localError, setLocalError] = useState("");

  // After login, go back to where they came from (or dashboard)
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    dispatch(clearAuthError());

    const result = await dispatch(
      loginThunk({ email: form.email, password: form.password }),
    );

    if (loginThunk.fulfilled.match(result)) {
      navigate(from, { replace: true });
    } else {
      setLocalError(result.payload || "Login failed. Please try again.");
    }
  };

  const error = localError || apiError;
  useEffect(() => {
    console.log("token");
  }, []);
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#0F172A",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <Box
        sx={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 300,
          background:
            "radial-gradient(ellipse, rgba(37,99,235,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Grid pattern */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          opacity: 0.04,
          backgroundImage: `
          linear-gradient(#fff 1px, transparent 1px),
          linear-gradient(90deg, #fff 1px, transparent 1px)
        `,
          backgroundSize: "40px 40px",
        }}
      />

      <Box
        sx={{
          width: "100%",
          maxWidth: 440,
          px: 2,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "16px",
              background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              mx: "auto",
              mb: 2,
              boxShadow: "0 0 40px rgba(37,99,235,0.4)",
            }}
          >
            🎭
          </Box>
          <Typography
            variant="h5"
            sx={{ color: "#F8FAFC", fontWeight: 700, mb: 0.5 }}
          >
            HallDesk
          </Typography>
          <Typography sx={{ color: "#64748B", fontSize: 13 }}>
            Admin Dashboard — Sign in to continue
          </Typography>
        </Box>

        <Card
          sx={{
            background: "#1E293B",
            border: "1px solid #334155",
            borderRadius: "16px",
          }}
        >
          <CardContent sx={{ p: "32px !important" }}>
            <form onSubmit={handleSubmit}>
              {error && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 2.5,
                    background: "#2d1515",
                    border: "1px solid #ef444444",
                    color: "#fca5a5",
                    fontSize: 13,
                  }}
                >
                  {error}
                </Alert>
              )}

              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#64748B",
                  mb: 0.8,
                  letterSpacing: 0.5,
                }}
              >
                EMAIL ADDRESS
              </Typography>
              <TextField
                fullWidth
                type="email"
                placeholder="admin@halldesk.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                size="small"
                sx={{ mb: 2.5 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: "#64748B", fontSize: 18 }} />
                    </InputAdornment>
                  ),
                }}
              />

              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#64748B",
                  mb: 0.8,
                  letterSpacing: 0.5,
                }}
              >
                PASSWORD
              </Typography>
              <TextField
                fullWidth
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                size="small"
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "#64748B", fontSize: 18 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        edge="end"
                        onClick={() => setShowPw(!showPw)}
                        sx={{ color: "#64748B" }}
                      >
                        {showPw ? (
                          <VisibilityOffIcon fontSize="small" />
                        ) : (
                          <VisibilityIcon fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  py: 1.3,
                  fontSize: 14,
                  fontWeight: 700,
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
                  boxShadow: "0 4px 20px rgba(37,99,235,0.4)",
                  "&:hover": { boxShadow: "0 6px 28px rgba(37,99,235,0.6)" },
                }}
              >
                {loading ? (
                  <CircularProgress size={20} sx={{ color: "#fff" }} />
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <Divider sx={{ my: 2.5, borderColor: "#334155" }} />

            <Box
              sx={{
                background: "#0F172A",
                borderRadius: "8px",
                p: "12px 14px",
              }}
            >
              <Typography
                sx={{
                  fontSize: 11,
                  color: "#64748B",
                  mb: 0.5,
                  fontWeight: 600,
                }}
              >
                DEFAULT CREDENTIALS
              </Typography>
              <Typography
                sx={{ fontSize: 12, color: "#94A3B8", fontFamily: "monospace" }}
              >
                admin@halldesk.com / Admin@123
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Typography
          sx={{ textAlign: "center", mt: 3, fontSize: 12, color: "#475569" }}
        >
          © 2025 HallDesk · All rights reserved
        </Typography>
      </Box>
    </Box>
  );
}
