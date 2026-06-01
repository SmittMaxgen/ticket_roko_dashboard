import { lazy, Suspense, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";

import { Provider, useDispatch, useSelector } from "react-redux";

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
import { meThunk } from "./features/auth/authThunks";

// ─────────────────────────────────────────────
// Lazy Pages (All Fixed)
// ─────────────────────────────────────────────
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Users = lazy(() => import("./pages/Users"));
const Events = lazy(() => import("./pages/Events"));
const TicketCheckerManagement = lazy(
  () => import("./pages/TicketCheckerManagement"),
);
const Bookings = lazy(() => import("./pages/Bookings"));
const HallCreate = lazy(() => import("./pages/HallCreate"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Settings = lazy(() => import("./pages/Settings"));
const VendorRegistration = lazy(() => import("./pages/VendorRegistration"));
const Partyplote = lazy(() => import("./components/Partyplote"));
const PartyPlotDetails = lazy(() => import("./pages/PartyPlotDetails"));
const PartyPlotsAll = lazy(() => import("./pages/PartyPlotsAll"));
const Labels = lazy(() => import("./pages/Labels"));
const TicketCheckerDashboard = lazy(
  () => import("./pages/TicketCheckerDashboard"),
);
const HallDesk = lazy(() => import("./pages/HallDesk"));
const BookingManager = lazy(() => import("./pages/BookingManager"));
const Advertisements = lazy(() => import("./pages/Advertisements"));

// ─────────────────────────────────────────────
// Loader
// ─────────────────────────────────────────────
function PageLoader() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 300,
      }}
    >
      <CircularProgress />
    </Box>
  );
}

// ─────────────────────────────────────────────
// 403
// ─────────────────────────────────────────────
function Forbidden() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        background: "#0F172A",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Typography sx={{ fontSize: 70 }}>🚫</Typography>

      <Typography variant="h5" sx={{ color: "#fff" }}>
        Access Denied
      </Typography>

      <Button onClick={() => navigate("/")}>Back</Button>
    </Box>
  );
}

// ─────────────────────────────────────────────
// 404
// ─────────────────────────────────────────────
function NotFound() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        background: "#0F172A",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Typography sx={{ fontSize: 70 }}>🔍</Typography>

      <Typography variant="h5" sx={{ color: "#fff" }}>
        Page Not Found
      </Typography>

      <Button onClick={() => navigate("/")}>Back</Button>
    </Box>
  );
}

// ─────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────
function AppRoutes() {
  const dispatch = useDispatch();

  // USER FROM REDUX
  const user = useSelector((state) => state.auth.user);

  // Fetch User Once
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && !user) {
      dispatch(meThunk());
    }
  }, [dispatch, user]);

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />
        <Route path="/403" element={<Forbidden />} />

        {/* PROTECTED */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route
            index
            element={
              user?.role === "vendor_organizer" &&
              (!user?.vendorProfile || !user?.vendorProfile?.is_completed) ? (
                <Navigate to="/vendor-registration" replace />
              ) : (
                <Dashboard />
              )
            }
          />

          {/* Users */}
          <Route
            path="users"
            element={
              <ProtectedRoute roles={["admin", "super_admin"]}>
                <Users />
              </ProtectedRoute>
            }
          />

          {/* Events */}
          <Route path="events" element={<Events user={user} />} />
          <Route path="events/:id" element={<BookingManager />} />

          {/* Admin Bookings */}
          <Route
            path="bookings"
            element={<Bookings myPage={true} userId={user || null} />}
          />

          {/* My Bookings */}
          <Route
            path="bookings/my-bookings"
            element={<Bookings myPage={true} userId={user || null} />}
          />

          {/* Analytics */}
          <Route path="analytics" element={<Analytics />} />

          {/* Settings */}
          <Route path="settings" element={<Settings />} />

          {/* Hall */}
          <Route
            path="hall"
            element={<HallCreate is_add={true} is_edit={false} />}
          />

          <Route path="halls-desk" element={<HallDesk />} />

          <Route
            path="hall-desk/:id"
            element={<HallCreate is_add={false} is_edit={true} />}
          />

          {/* Super Admin */}
          <Route
            path="system"
            element={
              <ProtectedRoute roles={["super_admin"]}>
                <Settings />
              </ProtectedRoute>
            }
          />

          <Route path="vendor-registration" element={<VendorRegistration />} />

          <Route path="party-plots" element={<PartyPlotsAll />} />
          <Route path="party-plot" element={<Partyplote />} />
          <Route path="party-plot/:id" element={<PartyPlotDetails />} />

          <Route
            path="ticket-checker"
            element={
              <ProtectedRoute roles={["ticket_checker"]}>
                <TicketCheckerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="ticket-checker-management"
            element={
              <ProtectedRoute roles={["super_admin", "admin"]}>
                <TicketCheckerManagement />
              </ProtectedRoute>
            }
          />

          <Route path="labels" element={<Labels />} />
          <Route path="Advertisements" element={<Advertisements />} />

          {/* Inner 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Root 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

// ─────────────────────────────────────────────
// Root App
// ─────────────────────────────────────────────
export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <SnackbarProvider
          maxSnack={3}
          autoHideDuration={3000}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  );
}
