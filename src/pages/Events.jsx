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
  InputAdornment,
  Tab,
  Tabs,
  Tooltip,
  Grid,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
// import CheckIcon from "@mui/icons-material/CheckCircleOutline";
// import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelIcon from "@mui/icons-material/CancelOutlined";
import EditIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SearchIcon from "@mui/icons-material/Search";
import api from "../api/axios";
import { useSnackbar } from "notistack";

const STATUS_COLORS = {
  approved: "success",
  pending_approval: "warning",
  rejected: "error",
  cancelled: "default",
  draft: "default",
  completed: "info",
};

const EMPTY_FORM = {
  title: "",
  description: "",
  event_date: "",
  start_time: "",
  end_time: "",
  city: "",
  address: "",
  ticket_price: 0,
  total_tickets: 0,
  is_free: 0,
  category_id: "",
  hall_id: "",
};

export default function Events() {
  const { enqueueSnackbar } = useSnackbar();
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [rejectDlg, setRejectDlg] = useState(null);
  const [rejectNote, setRejectNote] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(null);
  const [categories, setCategories] = useState([]);
  const [halls, setHalls] = useState([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: page + 1, limit: 20, search };
      if (tab !== "all") params.status = tab;
      const { data } = await api.get("/events", { params });
      setRows(data.data);
      setTotal(data.total);
    } catch {
      enqueueSnackbar("Failed to load events", { variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [page, search, tab]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    api
      .get("/categories")
      .then((r) => setCategories(r.data.data))
      .catch(() => {});
    api
      .get("/halls")
      .then((r) => setHalls(r.data.data))
      .catch(() => {});
  }, []);

  const approve = async (id) => {
    await api.patch(`/events/${id}/approve`);
    enqueueSnackbar("Event approved & published!", { variant: "success" });
    load();
  };

  const reject = async () => {
    await api.patch(`/events/${rejectDlg}/reject`, { reason: rejectNote });
    enqueueSnackbar("Event rejected", { variant: "warning" });
    setRejectDlg(null);
    setRejectNote("");
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    await api.delete(`/events/${id}`);
    enqueueSnackbar("Event deleted", { variant: "info" });
    load();
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await api.put(`/events/${editing}`, form);
        enqueueSnackbar("Event updated", { variant: "success" });
      } else {
        await api.post("/events", form);
        enqueueSnackbar("Event created", { variant: "success" });
      }
      setOpen(false);
      load();
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || "Error", {
        variant: "error",
      });
    }
  };

  const columns = [
    {
      field: "title",
      headerName: "Event",
      flex: 2,
      minWidth: 200,
      renderCell: ({ row }) => (
        <Box sx={{ py: 0.5 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#F8FAFC" }}>
            {row.title}
          </Typography>
          <Typography sx={{ fontSize: 11, color: "#64748B" }}>
            {row.organizer_name} · {row.city || "—"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "category_name",
      headerName: "Category",
      width: 120,
      renderCell: ({ value }) => (
        <Chip
          label={value || "—"}
          size="small"
          sx={{
            fontSize: 10,
            height: 20,
            background: "#334155",
            color: "#94A3B8",
          }}
        />
      ),
    },
    {
      field: "event_date",
      headerName: "Date",
      width: 110,
      renderCell: ({ value }) => (
        <Typography sx={{ fontSize: 12, color: "#94A3B8" }}>
          {value ? new Date(value).toLocaleDateString("en-IN") : "—"}
        </Typography>
      ),
    },
    {
      field: "ticket_price",
      headerName: "Price",
      width: 100,
      renderCell: ({ row }) => (
        <Typography
          sx={{
            fontSize: 12,
            color: row.is_free ? "#22c55e" : "#f59e0b",
            fontWeight: 600,
          }}
        >
          {row.is_free
            ? "FREE"
            : `₹${Number(row.ticket_price).toLocaleString("en-IN")}`}
        </Typography>
      ),
    },
    {
      field: "sold_tickets",
      headerName: "Sold",
      width: 100,
      renderCell: ({ row }) => (
        <Typography sx={{ fontSize: 12, color: "#94A3B8" }}>
          {row.sold_tickets}/{row.total_tickets}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: ({ value }) => (
        <Chip
          label={value?.replace("_", " ")}
          size="small"
          color={STATUS_COLORS[value] || "default"}
          sx={{ fontSize: 10, height: 20, textTransform: "capitalize" }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 140,
      sortable: false,
      renderCell: ({ row }) => (
        <Box sx={{ display: "flex", gap: 0.3 }}>
          {row.status === "pending_approval" && (
            <>
              <Tooltip title="Approve">
                <IconButton
                  size="small"
                  onClick={() => approve(row.id)}
                  sx={{ color: "#22c55e" }}
                > 
                  {/* <CheckCircleOutlineIcon fontSize="small" /> */}
                </IconButton>
              </Tooltip>
              <Tooltip title="Reject">
                <IconButton
                  size="small"
                  onClick={() => setRejectDlg(row.id)}
                  sx={{ color: "#ef4444" }}
                >
                  <CancelIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => {
                setForm({ ...row });
                setEditing(row.id);
                setOpen(true);
              }}
              sx={{ color: "#64748B", "&:hover": { color: "#2563EB" } }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => handleDelete(row.id)}
              sx={{ color: "#64748B", "&:hover": { color: "#ef4444" } }}
            >
              <DeleteIcon fontSize="small" />
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
            Events
          </Typography>
          <Typography sx={{ color: "#64748B", fontSize: 13 }}>
            Approve, manage and monitor all events
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setForm(EMPTY_FORM);
            setEditing(null);
            setOpen(true);
          }}
        >
          Add Event
        </Button>
      </Box>

      <Card sx={{ background: "#1E293B" }}>
        <CardContent sx={{ pb: "0 !important" }}>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              size="small"
              placeholder="Search events…"
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
            {[
              "all",
              "pending_approval",
              "approved",
              "rejected",
              "cancelled",
            ].map((t) => (
              <Tab
                key={t}
                label={t.replace("_", " ")}
                value={t}
                sx={{ textTransform: "capitalize" }}
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
          sx={{ border: "none" }}
        />
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { background: "#1E293B", border: "1px solid #334155" },
        }}
      >
        <DialogTitle sx={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC" }}>
          {editing ? "Edit Event" : "Create Event"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Event Title"
                size="small"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Event Date"
                type="date"
                size="small"
                value={form.event_date?.slice(0, 10) || ""}
                onChange={(e) =>
                  setForm({ ...form, event_date: e.target.value })
                }
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Start Time"
                type="time"
                size="small"
                value={form.start_time || ""}
                onChange={(e) =>
                  setForm({ ...form, start_time: e.target.value })
                }
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="End Time"
                type="time"
                size="small"
                value={form.end_time || ""}
                onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl size="small" fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  label="Category"
                  value={form.category_id || ""}
                  onChange={(e) =>
                    setForm({ ...form, category_id: e.target.value })
                  }
                >
                  {categories.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl size="small" fullWidth>
                <InputLabel>Hall</InputLabel>
                <Select
                  label="Hall"
                  value={form.hall_id || ""}
                  onChange={(e) =>
                    setForm({ ...form, hall_id: e.target.value })
                  }
                >
                  <MenuItem value="">None</MenuItem>
                  {halls.map((h) => (
                    <MenuItem key={h.id} value={h.id}>
                      {h.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Ticket Price (₹)"
                type="number"
                size="small"
                value={form.ticket_price}
                onChange={(e) =>
                  setForm({ ...form, ticket_price: e.target.value })
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Total Tickets"
                type="number"
                size="small"
                value={form.total_tickets}
                onChange={(e) =>
                  setForm({ ...form, total_tickets: e.target.value })
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl size="small" fullWidth>
                <InputLabel>Is Free?</InputLabel>
                <Select
                  label="Is Free?"
                  value={form.is_free}
                  onChange={(e) =>
                    setForm({ ...form, is_free: e.target.value })
                  }
                >
                  <MenuItem value={0}>Paid</MenuItem>
                  <MenuItem value={1}>Free</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="City"
                size="small"
                value={form.city || ""}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Address"
                size="small"
                value={form.address || ""}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                multiline
                rows={3}
                size="small"
                value={form.description || ""}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: "16px 24px", gap: 1 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: "#64748B" }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave}>
            {editing ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog
        open={!!rejectDlg}
        onClose={() => setRejectDlg(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { background: "#1E293B", border: "1px solid #334155" },
        }}
      >
        <DialogTitle sx={{ color: "#F8FAFC", fontWeight: 700 }}>
          Reject Event
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Reason for rejection"
            multiline
            rows={3}
            fullWidth
            size="small"
            value={rejectNote}
            onChange={(e) => setRejectNote(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: "16px 24px" }}>
          <Button onClick={() => setRejectDlg(null)} sx={{ color: "#64748B" }}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={reject}>
            Reject Event
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
