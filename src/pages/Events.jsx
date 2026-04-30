import { useEffect, useMemo, useState } from "react";
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
  Tabs,
  Tab,
  Grid,
  Tooltip,
  Stack,
  Divider,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
// import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
// import TheaterComedyIcon from "@mui/icons-material/TheaterComedy";
import StadiumIcon from "@mui/icons-material/Stadium";
import DeleteIcon from "@mui/icons-material/Delete";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import BlockIcon from "@mui/icons-material/Block";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

import CommonDropDown from "../commonComponents/CommonDropDown";
import CommonButton from "../commonComponents/CommonButton";

import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";

import {
  fetchEventsThunk,
  createEventThunk,
  updateEventThunk,
  approveEventThunk,
  rejectEventThunk,
  deleteEventThunk,
} from "../features/events/eventThunks";

import {
  selectHallList,
  selectHallLoading,
  selectHallError,
  selectHallActionLoading,
} from "../features/halls/hallSelectors";

import { fetchCategories } from "../features/categories/categoryThunks";

import { selectCategories } from "../features/categories/categorySelectors";

import {
  selectEventList,
  selectEventTotal,
  selectEventLoading,
  selectEventActionLoading,
} from "../features/events/eventSelectors";
import { useNavigate } from "react-router-dom";
import { fetchHallsThunk } from "../features/halls/hallThunks";

const STATUS_COLORS = {
  approved: "success",
  pending_approval: "warning",
  rejected: "error",
  cancelled: "default",
  completed: "info",
  draft: "default",
};

const EMPTY_FORM = {
  hall_id: "",
  category_id: "",
  title: "",
  description: "",
  event_date: "",
  start_time: "",
  end_time: "",
  city: "",
  address: "",
  ticket_price: 0,
  total_tickets: 0,
  is_free: false,
  status: "draft",
};

function StatCard({ title, value, icon, color }) {
  return (
    <Card
      sx={{
        background:
          "linear-gradient(145deg, rgba(30,41,59,.95), rgba(15,23,42,.95))",
        border: "1px solid #1e293b",
        borderRadius: 4,
        boxShadow: "0 10px 35px rgba(0,0,0,.28)",
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography sx={{ color: "#94a3b8", fontSize: 12 }}>
              {title}
            </Typography>
            <Typography
              sx={{
                color: "#fff",
                fontWeight: 800,
                fontSize: 28,
                mt: 0.5,
              }}
            >
              {value}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: 3,
              background: `${color}22`,
              color,
              display: "grid",
              placeItems: "center",
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function Events() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const rows = useSelector(selectEventList);
  const total = useSelector(selectEventTotal);
  const loading = useSelector(selectEventLoading);
  const actionLoading = useSelector(selectEventActionLoading);

  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const [rejectDlg, setRejectDlg] = useState(null);
  const [rejectNote, setRejectNote] = useState("");

  const hallList = useSelector(selectHallList);
  const categoryList = useSelector(selectCategories);

  const load = () => {
    const params = {
      page: page + 1,
      limit: 20,
      search,
    };

    if (tab !== "all") params.status = tab;

    dispatch(fetchEventsThunk(params));
  };

  useEffect(() => {
    load();
  }, [page, search, tab]);

  useEffect(() => {
    dispatch(fetchHallsThunk());
    dispatch(fetchCategories());
  }, [dispatch]);
  const stats = useMemo(() => {
    const approved = rows.filter((x) => x.status === "approved").length;
    const pending = rows.filter((x) => x.status === "pending_approval").length;
    const rejected = rows.filter((x) => x.status === "rejected").length;

    const revenue = rows.reduce(
      (a, b) => a + Number(b.ticket_price || 0) * Number(b.sold_tickets || 0),
      0,
    );

    return { approved, pending, rejected, revenue };
  }, [rows]);

  const handleSave = async () => {
    if (
      !form.hall_id ||
      !form.category_id ||
      !form.title.trim() ||
      !form.description.trim() ||
      !form.event_date ||
      !form.start_time ||
      !form.end_time ||
      !form.city.trim() ||
      !form.address.trim() ||
      Number(form.ticket_price) <= 0 ||
      Number(form.total_tickets) <= 0
    ) {
      enqueueSnackbar(
        "All fields required. Price & Total Tickets must be greater than 0",
        { variant: "error" },
      );
      return;
    }

    let result;

    if (editing) {
      result = await dispatch(
        updateEventThunk({
          id: editing,
          ...form,
        }),
      );
    } else {
      result = await dispatch(createEventThunk(form));
    }

    if (result.meta.requestStatus === "fulfilled") {
      enqueueSnackbar(editing ? "Event updated" : "Event created", {
        variant: "success",
      });
      setOpen(false);
      setEditing(null);
      setForm(EMPTY_FORM);
      load();
    } else {
      enqueueSnackbar("Action failed", {
        variant: "error",
      });
    }
  };

  const approve = async (id) => {
    const r = await dispatch(approveEventThunk(id));

    if (r.meta.requestStatus === "fulfilled") {
      enqueueSnackbar("Event approved", {
        variant: "success",
      });
      load();
    }
  };

  const reject = async () => {
    const r = await dispatch(
      rejectEventThunk({
        id: rejectDlg,
        reason: rejectNote,
      }),
    );

    if (r.meta.requestStatus === "fulfilled") {
      enqueueSnackbar("Event rejected", {
        variant: "warning",
      });
      setRejectDlg(null);
      setRejectNote("");
      load();
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete event?")) return;

    const r = await dispatch(deleteEventThunk(id));

    if (r.meta.requestStatus === "fulfilled") {
      enqueueSnackbar("Deleted", {
        variant: "info",
      });
      load();
    }
  };

  const columns = [
    {
      field: "title",
      headerName: "Event",
      flex: 1.8,
      minWidth: 230,
      renderCell: ({ row }) => (
        <Box py={0.7}>
          <Typography
            sx={{
              color: "#fff",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            {row.title}
          </Typography>

          <Typography
            sx={{
              color: "#64748b",
              fontSize: 11,
            }}
          >
            {row.organizer_name || "Organizer"} • {row.city || "—"}
          </Typography>
        </Box>
      ),
    },

    {
      field: "ticket_price",
      headerName: "Price",
      width: 110,
      renderCell: ({ row }) => (
        <Typography
          sx={{
            color: row.is_free ? "#22c55e" : "#f59e0b",
            fontWeight: 700,
            fontSize: 12,
          }}
        >
          {row.is_free
            ? "FREE"
            : `₹${Number(row.ticket_price || 0).toLocaleString("en-IN")}`}
        </Typography>
      ),
    },

    {
      field: "sold_tickets",
      headerName: "Sold",
      width: 100,
      renderCell: ({ row }) => (
        <Typography sx={{ color: "#94a3b8", fontSize: 12 }}>
          {row.sold_tickets || 0}/{row.total_tickets || 0}
        </Typography>
      ),
    },

    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: ({ value }) => (
        <Chip
          size="small"
          label={(value || "").replace("_", " ")}
          color={STATUS_COLORS[value] || "default"}
          sx={{
            textTransform: "capitalize",
            fontSize: 11,
          }}
        />
      ),
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      sortable: false,
      renderCell: ({ row }) => (
        <Stack direction="row" spacing={0.3}>
          {row.status === "pending_approval" && (
            <>
              <Tooltip title="Approve">
                <IconButton
                  size="small"
                  onClick={() => approve(row.id)}
                  sx={{ color: "#22c55e" }}
                >
                  <CheckCircleIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Reject">
                <IconButton
                  size="small"
                  onClick={() => setRejectDlg(row.id)}
                  sx={{ color: "#ef4444" }}
                >
                  <CancelOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}

          <Tooltip title="Edit">
            <IconButton
              size="small"
              // onClick={() => handleNavigateToEventHall(row)}

              onClick={() => {
                // setEditing(row.id);
                handleNavigateToEventHall(row);
                // setForm({
                //   title: row.title || "",
                //   city: row.city || "",
                //   address: row.address || "",
                //   description: row.description || "",
                //   ticket_price: row.ticket_price || 0,
                //   total_tickets: row.total_tickets || 0,
                //   status: row.status || "draft",
                // });
                // setOpen(true);
              }}
              sx={{ color: "#60a5fa" }}
            >
              <StadiumIcon
                // onClick={() => handleNavigateToEventHall(row)}
                fontSize="small"
              />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              // onClick={() => handleNavigateToEventHall(row)}

              onClick={() => {
                // setEditing(row.id);
                // handleNavigateToEventHall(row);
                setForm({
                  title: row.title || "",
                  city: row.city || "",
                  address: row.address || "",
                  description: row.description || "",
                  ticket_price: row.ticket_price || 0,
                  total_tickets: row.total_tickets || 0,
                  status: row.status || "draft",
                });
                setOpen(true);
              }}
              sx={{ color: "#60a5fa" }}
            >
              <EditOutlinedIcon
                // onClick={() => handleNavigateToEventHall(row)}
                fontSize="small"
              />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => remove(row.id)}
              sx={{ color: "#f87171" }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  const handleNavigateToEventHall = (row) => {
    console.log("row:::>>>>", row);
    navigate(`/events/${row?.id}`);
  };
  return (
    <Box sx={{ minHeight: "100vh" }}>
      {/* Header */}
      <Stack
        style={{ display: "flex", justifyContent: "space-between" }}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Typography
            sx={{
              color: "#fff",
              fontSize: 25,
              fontWeight: 800,
            }}
          >
            Events Management
          </Typography>

          <Typography sx={{ color: "#64748b", mt: 0.5 }}>
            Premium dashboard to manage events, approvals & bookings
          </Typography>
        </Box>

        <CommonButton
          startIcon={<AddIcon />}
          onClick={() => {
            setEditing(null);
            setForm(EMPTY_FORM);
            setOpen(true);
          }}
        >
          Add Event
        </CommonButton>
      </Stack>

      {/* Stats */}
      <Grid container spacing={2} mb={3} sx={{ marginTop: "15px" }}>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Approved"
            value={stats.approved}
            color="#22c55e"
            icon={<EventAvailableIcon />}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <StatCard
            title="Pending"
            value={stats.pending}
            color="#f59e0b"
            icon={<PendingActionsIcon />}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <StatCard
            title="Rejected"
            value={stats.rejected}
            color="#ef4444"
            icon={<BlockIcon />}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <StatCard
            title="Revenue"
            value={`₹${stats.revenue.toLocaleString("en-IN")}`}
            color="#3b82f6"
            icon={<CurrencyRupeeIcon />}
          />
        </Grid>
      </Grid>

      {/* Main Card */}
      <Card
        sx={{
          marginTop: "15px",
          background:
            "linear-gradient(145deg, rgba(30,41,59,.96), rgba(15,23,42,.96))",
          border: "1px solid #1e293b",
          borderRadius: 4,
        }}
      >
        <CardContent>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            gap={2}
            mb={2}
          >
            <TextField
              size="small"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ width: 320 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#64748b" }} />
                  </InputAdornment>
                ),
              }}
            />

            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              sx={{
                "& .MuiTab-root": {
                  color: "#64748b",
                  textTransform: "capitalize",
                },
                "& .Mui-selected": {
                  color: "#3b82f6 !important",
                },
              }}
            >
              {[
                "all",
                "pending_approval",
                "approved",
                "rejected",
                "cancelled",
              ].map((x) => (
                <Tab key={x} value={x} label={x.replace("_", " ")} />
              ))}
            </Tabs>
          </Stack>

          <Divider sx={{ borderColor: "#1e293b", mb: 2 }} />

          <DataGrid
            style={{ width: "100%" }}
            rows={rows}
            columns={columns}
            rowCount={total}
            loading={loading}
            autoHeight
            paginationMode="server"
            pageSizeOptions={[20]}
            paginationModel={{
              page,
              pageSize: 20,
            }}
            onPaginationModelChange={(m) => setPage(m.page)}
            disableRowSelectionOnClick
            sx={{
              border: "none",
              color: "#fff",
              "& .MuiDataGrid-columnHeaders": {
                background: "#0f172a",
                borderBottom: "1px solid #1e293b",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid rgba(30,41,59,.5)",
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "1px solid #1e293b",
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Add / Edit */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: 4,
          },
        }}
      >
        <DialogTitle sx={{ color: "#fff", fontWeight: 800 }}>
          {editing ? "Edit Event" : "Create Event"}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <CommonDropDown
              label="Select Hall"
              value={form.hall_id}
              options={hallList}
              onChange={(e) => setForm({ ...form, hall_id: e.target.value })}
              required
            />

            <CommonDropDown
              label="Select Category "
              // type="number"
              options={categoryList}
              value={form.category_id}
              onChange={(e) =>
                setForm({ ...form, category_id: e.target.value })
              }
              required
            />

            <TextField
              label="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              fullWidth
              required
            />

            <TextField
              label="Description"
              multiline
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              fullWidth
              required
            />

            <TextField
              label="Event Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={form.event_date}
              onChange={(e) => setForm({ ...form, event_date: e.target.value })}
              fullWidth
              required
            />

            <TextField
              label="Start Time"
              type="time"
              InputLabelProps={{ shrink: true }}
              value={form.start_time}
              onChange={(e) => setForm({ ...form, start_time: e.target.value })}
              fullWidth
              required
            />

            <TextField
              label="End Time"
              type="time"
              InputLabelProps={{ shrink: true }}
              value={form.end_time}
              onChange={(e) => setForm({ ...form, end_time: e.target.value })}
              fullWidth
              required
            />

            <TextField
              label="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              fullWidth
              required
            />

            <TextField
              label="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              fullWidth
              required
            />

            <TextField
              label="Ticket Price"
              type="number"
              value={form.ticket_price}
              inputProps={{ min: 1 }}
              onChange={(e) =>
                setForm({
                  ...form,
                  ticket_price: e.target.value,
                })
              }
              fullWidth
              required
            />

            <TextField
              label="Total Tickets"
              type="number"
              value={form.total_tickets}
              inputProps={{ min: 1 }}
              onChange={(e) =>
                setForm({
                  ...form,
                  total_tickets: e.target.value,
                })
              }
              fullWidth
              required
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>

          <Button
            variant="contained"
            onClick={handleSave}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <CircularProgress size={18} />
            ) : editing ? (
              "Update"
            ) : (
              "Create"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject */}
      <Dialog
        open={!!rejectDlg}
        onClose={() => setRejectDlg(null)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: 4,
          },
        }}
      >
        <DialogTitle sx={{ color: "#fff", fontWeight: 800 }}>
          Reject Event
        </DialogTitle>

        <DialogContent>
          <TextField
            label="Reason"
            multiline
            rows={4}
            fullWidth
            sx={{ mt: 1 }}
            value={rejectNote}
            onChange={(e) => setRejectNote(e.target.value)}
          />
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setRejectDlg(null)}>Cancel</Button>

          <Button variant="contained" color="error" onClick={reject}>
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
