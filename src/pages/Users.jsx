import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Avatar,
  Tooltip,
  InputAdornment,
  Tab,
  Tabs,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/EditOutlined";
import BlockIcon from "@mui/icons-material/Block";
import SearchIcon from "@mui/icons-material/Search";
import VerifiedIcon from "@mui/icons-material/VerifiedUser";
import api from "../api/axios";
import { useSnackbar } from "notistack";

const roleColor = {
  super_admin: "error",
  admin: "warning",
  organizer: "info",
  user: "default",
};
const kycColor = {
  approved: "success",
  rejected: "error",
  pending: "warning",
  submitted: "info",
};

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  password: "",
  role: "user",
};

export default function Users() {
  const { enqueueSnackbar } = useSnackbar();
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: page + 1, limit: 20, search };
      if (tab !== "all") params.role = tab;
      const { data } = await api.get("/users", { params });
      setRows(data.data);
      setTotal(data.total);
    } catch {
      enqueueSnackbar("Failed to load users", { variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [page, search, tab]);

  useEffect(() => {
    load();
  }, [load]);

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditing(null);
    setOpen(true);
  };
  const openEdit = (row) => {
    setForm({
      name: row.name,
      email: row.email,
      phone: row.phone || "",
      role: row.role,
      password: "",
      is_active: row.is_active,
      is_verified: row.is_verified,
    });
    setEditing(row.id);
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/users/${editing}`, form);
        enqueueSnackbar("User updated", { variant: "success" });
      } else {
        await api.post("/users", form);
        enqueueSnackbar("User created", { variant: "success" });
      }
      setOpen(false);
      load();
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || "Error", {
        variant: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (id) => {
    await api.delete(`/users/${id}`);
    enqueueSnackbar("User deactivated", { variant: "info" });
    load();
  };

  const handleKyc = async (id, status) => {
    await api.patch(`/users/${id}/kyc`, { kyc_status: status });
    enqueueSnackbar(`KYC ${status}`, { variant: "success" });
    load();
  };

  const columns = [
    {
      field: "name",
      headerName: "User",
      flex: 1.5,
      minWidth: 180,
      renderCell: ({ row }) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 0.5 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              background: "#2563EB",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {row.name?.[0]?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography
              sx={{ fontSize: 13, fontWeight: 600, color: "#F8FAFC" }}
            >
              {row.name}
            </Typography>
            <Typography sx={{ fontSize: 11, color: "#64748B" }}>
              {row.email}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: "role",
      headerName: "Role",
      width: 120,
      renderCell: ({ value }) => (
        <Chip
          label={value}
          size="small"
          color={roleColor[value] || "default"}
          sx={{ fontSize: 10, height: 20, textTransform: "capitalize" }}
        />
      ),
    },
    {
      field: "kyc_status",
      headerName: "KYC",
      width: 110,
      renderCell: ({ row }) =>
        row.role === "organizer" ? (
          <Chip
            label={row.kyc_status}
            size="small"
            color={kycColor[row.kyc_status] || "default"}
            sx={{ fontSize: 10, height: 20, textTransform: "capitalize" }}
          />
        ) : (
          <Typography sx={{ color: "#475569", fontSize: 12 }}>N/A</Typography>
        ),
    },
    {
      field: "is_active",
      headerName: "Status",
      width: 90,
      renderCell: ({ value }) => (
        <Chip
          label={value ? "Active" : "Inactive"}
          size="small"
          color={value ? "success" : "error"}
          sx={{ fontSize: 10, height: 20 }}
        />
      ),
    },
    {
      field: "last_login",
      headerName: "Last Login",
      width: 150,
      renderCell: ({ value }) => (
        <Typography sx={{ fontSize: 12, color: "#64748B" }}>
          {value ? new Date(value).toLocaleDateString("en-IN") : "Never"}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 130,
      sortable: false,
      renderCell: ({ row }) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => openEdit(row)}
              sx={{ color: "#64748B", "&:hover": { color: "#2563EB" } }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {row.role === "organizer" && row.kyc_status === "submitted" && (
            <Tooltip title="Approve KYC">
              <IconButton
                size="small"
                onClick={() => handleKyc(row.id, "approved")}
                sx={{ color: "#64748B", "&:hover": { color: "#22c55e" } }}
              >
                <VerifiedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Deactivate">
            <IconButton
              size="small"
              onClick={() => handleDeactivate(row.id)}
              sx={{ color: "#64748B", "&:hover": { color: "#ef4444" } }}
            >
              <BlockIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ color: "#F8FAFC" }}>
            Users
          </Typography>
          <Typography sx={{ color: "#64748B", fontSize: 13 }}>
            Manage users, organizers & KYC verification
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}>
          Add User
        </Button>
      </Box>

      <Card sx={{ background: "#1E293B" }}>
        <CardContent sx={{ pb: "0 !important" }}>
          {/* Filters */}
          <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
            <TextField
              size="small"
              placeholder="Search name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ width: 280 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#64748B", fontSize: 18 }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              mb: 1,
              "& .MuiTab-root": {
                fontSize: 12,
                minHeight: 40,
                color: "#64748B",
              },
              "& .Mui-selected": { color: "#2563EB !important" },
              "& .MuiTabs-indicator": { background: "#2563EB" },
            }}
          >
            {["all", "user", "organizer", "admin"].map((t) => (
              <Tab
                key={t}
                label={t.charAt(0).toUpperCase() + t.slice(1)}
                value={t}
              />
            ))}
          </Tabs>
        </CardContent>

        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          rowCount={total}
          paginationMode="server"
          paginationModel={{ page, pageSize: 20 }}
          onPaginationModelChange={(m) => setPage(m.page)}
          autoHeight
          disableRowSelectionOnClick
          sx={{ border: "none", "& .MuiDataGrid-row": { cursor: "default" } }}
        />
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { background: "#1E293B", border: "1px solid #334155" },
        }}
      >
        <DialogTitle sx={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC" }}>
          {editing ? "Edit User" : "Add New User"}
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            pt: "16px !important",
          }}
        >
          <TextField
            label="Full Name"
            size="small"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            fullWidth
          />
          <TextField
            label="Email"
            type="email"
            size="small"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            fullWidth
            disabled={!!editing}
          />
          <TextField
            label="Phone"
            size="small"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            fullWidth
          />
          {!editing && (
            <TextField
              label="Password"
              type="password"
              size="small"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              fullWidth
            />
          )}
          <FormControl size="small" fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              label="Role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              {["user", "organizer", "admin"].map((r) => (
                <MenuItem key={r} value={r}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: "16px 24px", gap: 1 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: "#64748B" }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : editing ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
