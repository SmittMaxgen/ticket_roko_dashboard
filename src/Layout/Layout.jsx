// src/components/Layout.jsx
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Badge,
  Tooltip,
  Typography,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/NotificationsOutlined";
import LogoutIcon from "@mui/icons-material/LogoutOutlined";
import PersonIcon from "@mui/icons-material/PersonOutlined";

import Sidebar, { DRAWER_W } from "../pages/Sidebar";
import { selectUser } from "../features/auth/authSelectors";
import { logoutThunk } from "../features/auth/authThunks";
import { logout } from "../features/auth/authSlice";

export default function Layout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = async () => {
    setAnchorEl(null);
    await dispatch(logoutThunk());
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: "#0A1628" }}>
      <Sidebar />

      <Box
        sx={{
          flex: 1,
          ml: `${DRAWER_W}px`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <AppBar
          position="sticky"
          elevation={0}
          sx={{ background: "#0F172A", borderBottom: "1px solid #1E293B" }}
        >
          <Toolbar
            sx={{
              justifyContent: "flex-end",
              gap: 1,
              minHeight: "56px !important",
            }}
          >
            <Tooltip title="Notifications">
              <IconButton
                size="small"
                sx={{ color: "#64748B", "&:hover": { color: "#F8FAFC" } }}
              >
                <Badge
                  badgeContent={3}
                  color="error"
                  sx={{ "& .MuiBadge-badge": { fontSize: 9 } }}
                >
                  <NotificationsIcon fontSize="small" />
                </Badge>
              </IconButton>
            </Tooltip>

            <IconButton
              onClick={(e) => setAnchorEl(e.currentTarget)}
              size="small"
              sx={{ ml: 0.5 }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  background: "#2563EB",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {user?.name?.[0]?.toUpperCase()}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              PaperProps={{
                sx: {
                  background: "#1E293B",
                  border: "1px solid #334155",
                  mt: 1,
                  minWidth: 180,
                },
              }}
            >
              <Box sx={{ px: 2, py: 1 }}>
                <Typography
                  sx={{ fontSize: 13, fontWeight: 600, color: "#F8FAFC" }}
                >
                  {user?.name}
                </Typography>
                <Typography sx={{ fontSize: 11, color: "#64748B" }}>
                  {user?.email}
                </Typography>
              </Box>
              <Divider sx={{ borderColor: "#334155" }} />
              <MenuItem
                onClick={() => {
                  setAnchorEl(null);
                  navigate("/settings");
                }}
                sx={{
                  fontSize: 13,
                  gap: 1.5,
                  color: "#94A3B8",
                  "&:hover": { color: "#F8FAFC", background: "#334155" },
                }}
              >
                <PersonIcon fontSize="small" /> Profile
              </MenuItem>
              <MenuItem
                onClick={handleLogout}
                sx={{
                  fontSize: 13,
                  gap: 1.5,
                  color: "#ef4444",
                  "&:hover": { background: "#2d1515" },
                }}
              >
                <LogoutIcon fontSize="small" /> Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        <Box sx={{ flex: 1, p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
