// src/components/ProtectedRoute.jsx
// ─────────────────────────────────────────────────────────────
// Reads auth state directly from Redux — zero AuthContext dependency.
//
// Usage:
//   <ProtectedRoute>                          → any logged-in user
//   <ProtectedRoute roles={["super_admin"]}>  → role-locked
//
// Behaviour:
//   loading / restoring  → branded spinner
//   no token             → /login  (preserves "from" for redirect back)
//   wrong role           → /403
// ─────────────────────────────────────────────────────────────
import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Box, CircularProgress, Typography } from "@mui/material";

import {
  selectUser,
  selectToken,
  selectAuthLoading,
} from "../features/auth/authSelectors";
import { meThunk } from "../features/auth/authThunks";

export default function ProtectedRoute({ children, roles = [] }) {
  const dispatch = useDispatch();
  const location = useLocation();

  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const loading = useSelector(selectAuthLoading);

  // Restore session when we have a token in localStorage but no user in state yet
  useEffect(() => {
    if (token && !user) {
      dispatch(meThunk());
    }
  }, [token, user, dispatch]);

  // Waiting for /auth/me to resolve
  if (loading || (token && !user)) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          gap: 2,
          background: "#0F172A",
        }}
      >
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: "14px",
            background: "linear-gradient(135deg,#2563EB,#1D4ED8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            mb: 1,
            boxShadow: "0 0 40px rgba(37,99,235,0.35)",
          }}
        >
          🎭
        </Box>
        <CircularProgress size={28} sx={{ color: "#2563EB" }} />
        <Typography sx={{ color: "#64748B", fontSize: 13, mt: 0.5 }}>
          Loading HallDesk…
        </Typography>
      </Box>
    );
  }

  // No token — send to login and remember where they were headed
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Token present but wrong role
  if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/403" replace />;
  }

  return children;
}
