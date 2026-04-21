import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
} from "@mui/material";
import api from "../api/axios";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { selectUser } from "../features/auth/authSelectors";

export default function Settings() {
  const user = useSelector(selectUser);
  const { enqueueSnackbar } = useSnackbar();

  const [pw, setPw] = useState({
    currentPassword: "",
    newPassword: "",
    confirm: "",
  });

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const handleChangePw = async (e) => {
    e.preventDefault();
    setErr("");

    if (!pw.currentPassword || !pw.newPassword || !pw.confirm) {
      setErr("All fields are required");
      return;
    }

    if (pw.newPassword !== pw.confirm) {
      setErr("Passwords don't match");
      return;
    }

    if (pw.newPassword.length < 6) {
      setErr("Password must be at least 6 characters");
      return;
    }

    setSaving(true);

    try {
      await api.post("/auth/change-password", {
        currentPassword: pw.currentPassword,
        newPassword: pw.newPassword,
      });

      enqueueSnackbar("Password changed successfully!", {
        variant: "success",
      });

      setPw({
        currentPassword: "",
        newPassword: "",
        confirm: "",
      });
    } catch (err) {
      setErr(err.response?.data?.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      {/* HEADER */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ color: "#F8FAFC" }}>
          Settings
        </Typography>
        <Typography sx={{ color: "#64748B", fontSize: 13 }}>
          Manage your account and system settings
        </Typography>
      </Box>

      <Grid container spacing={2.5}>
        {/* PROFILE CARD */}
        <Grid item xs={12} md={6}>
          <Card sx={{ background: "#1E293B" }}>
            <CardContent>
              <Typography
                sx={{ fontSize: 14, fontWeight: 600, color: "#F8FAFC", mb: 2 }}
              >
                Profile
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {[
                  ["Name", user?.name],
                  ["Email", user?.email],
                  ["Role", user?.role?.replace("_", " ")],
                  [
                    "Last Login",
                    user?.last_login
                      ? new Date(user.last_login).toLocaleString("en-IN")
                      : "N/A",
                  ],
                ].map(([k, v]) => (
                  <Box
                    key={k}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      p: "10px 0",
                      borderBottom: "1px solid #334155",
                    }}
                  >
                    <Typography sx={{ fontSize: 12, color: "#64748B" }}>
                      {k}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "#F8FAFC",
                        textTransform: "capitalize",
                      }}
                    >
                      {v}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* PASSWORD CARD */}
        <Grid item xs={12} md={6}>
          <Card sx={{ background: "#1E293B" }}>
            <CardContent>
              <Typography
                sx={{ fontSize: 14, fontWeight: 600, color: "#F8FAFC", mb: 2 }}
              >
                Change Password
              </Typography>

              <form onSubmit={handleChangePw}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {err && (
                    <Alert
                      severity="error"
                      sx={{
                        background: "#2d1515",
                        color: "#fca5a5",
                        fontSize: 12,
                      }}
                    >
                      {err}
                    </Alert>
                  )}

                  <TextField
                    label="Current Password"
                    type="password"
                    size="small"
                    fullWidth
                    value={pw.currentPassword}
                    onChange={(e) =>
                      setPw({ ...pw, currentPassword: e.target.value })
                    }
                  />

                  <TextField
                    label="New Password"
                    type="password"
                    size="small"
                    fullWidth
                    value={pw.newPassword}
                    onChange={(e) =>
                      setPw({ ...pw, newPassword: e.target.value })
                    }
                  />

                  <TextField
                    label="Confirm New Password"
                    type="password"
                    size="small"
                    fullWidth
                    value={pw.confirm}
                    onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
                  />

                  <Button type="submit" variant="contained" disabled={saving}>
                    {saving ? "Saving..." : "Update Password"}
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* SYSTEM INFO */}
        <Grid item xs={12}>
          <Card sx={{ background: "#1E293B" }}>
            <CardContent>
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#F8FAFC",
                  mb: 1.5,
                }}
              >
                System Info
              </Typography>

              <Grid container spacing={2}>
                {[
                  ["API Version", "v1.0.0"],
                  ["Database", "MySQL 8.0"],
                  ["Node.js", "v20.x"],
                  ["Environment", "Development"],
                ].map(([k, v]) => (
                  <Grid key={k} item xs={6} sm={3}>
                    <Box
                      sx={{
                        background: "#0F172A",
                        borderRadius: "8px",
                        p: "12px 14px",
                      }}
                    >
                      <Typography
                        sx={{ fontSize: 10, color: "#64748B", mb: 0.5 }}
                      >
                        {k.toUpperCase()}
                      </Typography>
                      <Typography
                        sx={{ fontSize: 13, fontWeight: 600, color: "#2563EB" }}
                      >
                        {v}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
