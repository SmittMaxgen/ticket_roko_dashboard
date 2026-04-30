// src/components/Sidebar.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Divider,
  Chip,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import EventIcon from "@mui/icons-material/Event";
import ConfirmationIcon from "@mui/icons-material/ConfirmationNumber";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import CategoryIcon from "@mui/icons-material/Category";

import { selectUser } from "../features/auth/authSelectors";
import { selectPendingEventCount } from "../features/dashboard/dashboardSelectors";
import HallCreate from "./HallCreate";

export const DRAWER_W = 240;

// const NAV = [
//   { label: "Dashboard", icon: <DashboardIcon />, path: "/" },
//   { label: "Users", icon: <PeopleIcon />, path: "/users" },
//   {
//     label: "Events",
//     icon: <EventIcon />,
//     path: "/events",
//     badgeKey: "pendingEvents",
//   },
//   { label: "Bookings", icon: <ConfirmationIcon />, path: "/bookings" },
//   { label: "Hall Desk", icon: <MeetingRoomIcon />, path: "/halls-desk" },
//   { label: "Hall Create", icon: <DashboardIcon />, path: "/hall" },
//   { label: "Analytics", icon: <BarChartIcon />, path: "/analytics" },
//   { label: "Categories", icon: <CategoryIcon />, path: "/categories" },
//   { label: "Settings", icon: <SettingsIcon />, path: "/settings" },
// ];

const NAV = [
  {
    label: "Dashboard",
    icon: <DashboardIcon />,
    path: "/",
    roles: ["super_admin", "admin", "user"],
  },

  {
    label: "Users",
    icon: <PeopleIcon />,
    path: "/users",
    roles: ["super_admin"],
  },

  {
    label: "Events",
    icon: <EventIcon />,
    path: "/events",
    roles: ["super_admin", "admin", "user"],
  },

  {
    label: "Bookings",
    icon: <ConfirmationIcon />,
    path: "/bookings",
    roles: ["super_admin", "admin", "user"],
  },

  {
    label: "Hall Desk",
    icon: <MeetingRoomIcon />,
    path: "/halls-desk",
    roles: ["super_admin", "admin"],
  },

  {
    label: "Hall Create",
    icon: <DashboardIcon />,
    path: "/hall",
    roles: ["super_admin"],
  },

  {
    label: "Analytics",
    icon: <BarChartIcon />,
    path: "/analytics",
    roles: ["super_admin"],
  },

  {
    label: "Categories",
    icon: <CategoryIcon />,
    path: "/categories",
    roles: ["super_admin", "admin"],
  },

  {
    label: "Settings",
    icon: <SettingsIcon />,
    path: "/settings",
    roles: ["super_admin", "admin", "user"],
  },
];

export default function Sidebar() {
  const user = useSelector(selectUser);
  const userRole = user?.role || "user";

  const filteredNav = NAV.filter((item) => item.roles.includes(userRole));
  const pending = useSelector(selectPendingEventCount);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const getBadge = (key) => {
    if (key === "pendingEvents" && pending > 0) return pending;
    return null;
  };

  return (
    <Box
      sx={{
        width: DRAWER_W,
        flexShrink: 0,
        background: "#0F172A",
        borderRight: "1px solid #1E293B",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          p: "20px 20px 16px",
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "10px",
            background: "linear-gradient(135deg,#2563EB,#1D4ED8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            flexShrink: 0,
          }}
        >
          🎭
        </Box>
        <Box>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 15,
              color: "#F8FAFC",
              lineHeight: 1.2,
            }}
          >
            HallDesk
          </Typography>
          <Typography sx={{ fontSize: 10, color: "#64748B", letterSpacing: 1 }}>
            ADMIN PANEL
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: "#1E293B", mb: 1 }} />

      {/* Nav items */}
      <List sx={{ px: 1.5, flex: 1 }}>
        {filteredNav.map((item) => {
          // const active =
          //   pathname === item.path ||
          //   (item.path !== "/" && pathname.startsWith(item.path));
          const active =
            pathname === item.path ||
            (item.path !== "/" &&
              (pathname.startsWith(item.path + "/") || pathname === item.path));
          const badge = getBadge(item.badgeKey);

          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                // disabled={item.path === "/" ? false : true}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: "8px",
                  py: "9px",
                  px: "12px",
                  background: active ? "rgba(37,99,235,0.15)" : "transparent",
                  border: active
                    ? "1px solid rgba(37,99,235,0.3)"
                    : "1px solid transparent",
                  "&:hover": {
                    background: "rgba(37,99,235,0.08)",
                    border: "1px solid rgba(37,99,235,0.15)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 34,
                    color: active ? "#2563EB" : "#64748B",
                    "& svg": { fontSize: 20 },
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: 13,
                    fontWeight: active ? 600 : 400,
                    color: active ? "#F8FAFC" : "#94A3B8",
                  }}
                />
                {badge && (
                  <Chip
                    label={badge}
                    size="small"
                    sx={{
                      background: "#ef4444",
                      color: "#fff",
                      fontSize: 10,
                      height: 18,
                      fontWeight: 700,
                      minWidth: 18,
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: "#1E293B" }} />

      {/* User card */}
      <Box
        sx={{ p: "12px 16px", display: "flex", alignItems: "center", gap: 1.5 }}
      >
        <Avatar
          sx={{
            width: 34,
            height: 34,
            background: "#2563EB",
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          {user?.name?.[0]?.toUpperCase()}
        </Avatar>
        <Box sx={{ flex: 1, overflow: "hidden" }}>
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 600,
              color: "#F8FAFC",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {user?.name}
          </Typography>
          <Typography
            sx={{ fontSize: 10, color: "#64748B", textTransform: "capitalize" }}
          >
            {user?.role?.replace("_", " ")}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
