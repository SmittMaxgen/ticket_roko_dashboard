// src/App.jsx
// ─────────────────────────────────────────────────────────────
// Root of the app. No AuthContext — auth lives entirely in Redux.
//
// PUBLIC       /login
// PROTECTED    / dashboard, users, events, bookings, halls, analytics, settings
// SUPER-ADMIN  /system  (role-locked example)
// UTILITY      /403, *→404
// ─────────────────────────────────────────────────────────────
import { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { Provider, useSelector, useDispatch } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import {
  CssBaseline,
  Box,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { SnackbarProvider } from "notistack";

import { store } from "./app/store";
import { theme } from "./theme/theme";
import ProtectedRoute from "./routes/ProtectedRoutes";
import Layout from "./Layout/Layout";

// ── Lazy pages ────────────────────────────────────────────
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Users = lazy(() => import("./pages/Users"));
const Events = lazy(() => import("./pages/Events"));
const Bookings = lazy(() => import("./pages/Bookings"));
const Halls = lazy(() => import("./pages/Hall"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Settings = lazy(() => import("./pages/Settings"));

// ── Page loading fallback ────────────────────────────────
function PageLoader() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        minHeight: 320,
      }}
    >
      <CircularProgress size={26} sx={{ color: "#2563EB" }} />
    </Box>
  );
}

// ── 403 Forbidden ────────────────────────────────────────
function Forbidden() {
  const navigate = useNavigate();
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
      <Typography sx={{ fontSize: 60, lineHeight: 1 }}>🚫</Typography>
      <Typography variant="h5" sx={{ color: "#F8FAFC", fontWeight: 700 }}>
        Access Denied
      </Typography>
      <Typography sx={{ color: "#64748B", fontSize: 14 }}>
        You don't have permission to view this page.
      </Typography>
      <Button variant="contained" onClick={() => navigate("/")} sx={{ mt: 1 }}>
        Back to Dashboard
      </Button>
    </Box>
  );
}

// ── 404 Not Found ────────────────────────────────────────
function NotFound() {
  const navigate = useNavigate();
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
      <Typography sx={{ fontSize: 60, lineHeight: 1 }}>🔍</Typography>
      <Typography variant="h5" sx={{ color: "#F8FAFC", fontWeight: 700 }}>
        Page Not Found
      </Typography>
      <Typography sx={{ color: "#64748B", fontSize: 14 }}>
        The page you're looking for doesn't exist.
      </Typography>
      <Button variant="contained" onClick={() => navigate("/")} sx={{ mt: 1 }}>
        Back to Dashboard
      </Button>
    </Box>
  );
}

// ── Route tree ───────────────────────────────────────────
function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ── Public ─────────────────────────────── */}
        <Route path="/login" element={<Login />} />
        <Route path="/403" element={<Forbidden />} />

        {/* ── Protected shell ────────────────────── */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard — default */}
          <Route index element={<Dashboard />} />

          {/* Users — admin & super_admin only */}
          <Route
            path="users"
            element={
              <ProtectedRoute roles={["admin", "super_admin"]}>
                <Users />
              </ProtectedRoute>
            }
          />

          {/* Events — any admin */}
          <Route path="events" element={<Events />} />

          {/* Bookings — any admin */}
          <Route path="bookings" element={<Bookings />} />

          {/* Hall Desk — any admin */}
          <Route path="halls" element={<Halls />} />

          {/* Analytics — any admin */}
          <Route path="analytics" element={<Analytics />} />

          {/* Settings — self-service, any logged-in user */}
          <Route path="settings" element={<Settings />} />

          {/* Categories — placeholder (swap for Categories page when ready) */}
          <Route path="categories" element={<Dashboard />} />

          {/* Super admin only example */}
          <Route
            path="system"
            element={
              <ProtectedRoute roles={["super_admin"]}>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Catch-all inside shell → 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Root-level 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

// ── Root ─────────────────────────────────────────────────
export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          autoHideDuration={3000}
        >
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  );
}
