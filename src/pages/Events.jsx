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
  FormControlLabel,
  Switch,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import AddIcon from "@mui/icons-material/Add";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ViewListIcon from "@mui/icons-material/ViewList";
import EventCalendar from "../commonComponents/EventCalendar";
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
import api, { API_BASE_URL } from "../api/axios";

import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";

import { fetchEventsThunk } from "../features/events/eventThunks";

import { selectHallList } from "../features/halls/hallSelectors";

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

const SECTION_LABELS = [
  { label: "Premium", color: "#f59e0b" },
  { label: "Executive", color: "#818cf8" },
  { label: "General", color: "#34d399" },
  { label: "VIP", color: "#f472b6" },
  { label: "Standard", color: "#001170" },
];

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
  is_trending: false,
  language: "English",
  event_type: "Other",
  status: "draft",
  banner: null,
  banner_preview: "",
  section_prices: {
    Premium: 0,
    Executive: 0,
    General: 0,
    VIP: 0,
    Standard: 0,
  },
};

function StatCard({ title, value, icon, color }) {
  return (
    <Card
      sx={{
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `1px solid ${color}40`,
        boxShadow: `0 10px 30px ${color}15`,
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&::before": {
          content: '""',
          position: "absolute",
          top: "-50%",
          right: "-50%",
          width: "100%",
          height: "100%",
          background: `radial-gradient(circle, ${color}20, transparent)`,
          transition: "all 0.6s ease",
        },
        "&:hover": {
          transform: "translateY(-6px)",
          borderColor: color,
          boxShadow: `0 20px 40px ${color}25`,
        },
      }}
    >
      <CardContent sx={{ position: "relative", zIndex: 1 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography
              sx={{
                color: "#a0aec0",
                fontSize: "0.85rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                mb: 0.5,
              }}
            >
              {title}
            </Typography>
            <Typography
              sx={{
                color: "#fff",
                fontWeight: 800,
                fontSize: "2rem",
                lineHeight: 1.2,
                background: `linear-gradient(135deg, #fff, ${color})`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {value}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "12px",
              background: `${color}25`,
              border: `1.5px solid ${color}40`,
              color,
              display: "grid",
              placeItems: "center",
              fontSize: "1.5rem",
              transition: "all 0.3s ease",
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function Events({ user }) {
  console.log("user:::::>>>>>", user);
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

  const [view, setView] = useState("list"); // "list" | "calendar"
  const [rejectDlg, setRejectDlg] = useState(null);
  const [rejectNote, setRejectNote] = useState("");
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedEventForAssignment, setSelectedEventForAssignment] =
    useState(null);
  const [ticketCheckerUsers, setTicketCheckerUsers] = useState([]);
  const [selectedTicketCheckerUserId, setSelectedTicketCheckerUserId] =
    useState("");
  const [assignLoading, setAssignLoading] = useState(false);

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

  const fetchTicketCheckerUsers = async () => {
    if (ticketCheckerUsers.length) return;

    try {
      const { data } = await api.get("/users");
      const checkers = (data.data || []).filter(
        (item) => item.role === "ticket_checker",
      );
      setTicketCheckerUsers(checkers);
    } catch (err) {
      enqueueSnackbar(
        err.response?.data?.message ||
          err.message ||
          "Failed to load ticket checkers",
        { variant: "error" },
      );
    }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => {
    if (assignDialogOpen) {
      fetchTicketCheckerUsers();
    }
  }, [assignDialogOpen]);

  const openAssignDialog = (event) => {
    setSelectedEventForAssignment(event);
    setSelectedTicketCheckerUserId("");
    setAssignDialogOpen(true);
  };

  const handleAssignTicketChecker = async () => {
    if (!selectedEventForAssignment || !selectedTicketCheckerUserId) {
      enqueueSnackbar("Please select a ticket checker.", {
        variant: "warning",
      });
      return;
    }

    setAssignLoading(true);
    try {
      await api.post(
        `/events/${selectedEventForAssignment.id}/assign-ticket-checker`,
        {
          user_id: selectedTicketCheckerUserId,
        },
      );
      enqueueSnackbar("Ticket checker assigned to event.", {
        variant: "success",
      });
      setAssignDialogOpen(false);
      setSelectedEventForAssignment(null);
      load();
    } catch (err) {
      enqueueSnackbar(
        err.response?.data?.message || err.message || "Assignment failed",
        { variant: "error" },
      );
    } finally {
      setAssignLoading(false);
    }
  };

  const stats = useMemo(() => {
    const safeRows = Array.isArray(rows) ? rows : [];

    const approved = safeRows.filter((x) => x.status === "approved").length;
    const pending = safeRows.filter(
      (x) => x.status === "pending_approval",
    ).length;
    const rejected = safeRows.filter((x) => x.status === "rejected").length;

    const revenue = safeRows.reduce(
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

    // Transform section_prices object → array for API
    const section_prices = Object.entries(form.section_prices).map(
      ([section_label, price]) => ({ section_label, price: Number(price) }),
    );

    const formData = new FormData();

    formData.append("hall_id", form.hall_id);
    formData.append("category_id", form.category_id);
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("event_date", form.event_date);
    formData.append("start_time", form.start_time);
    formData.append("end_time", form.end_time);
    formData.append("city", form.city);
    formData.append("address", form.address);
    formData.append("ticket_price", form.ticket_price);
    formData.append("total_tickets", form.total_tickets);
    formData.append("is_free", form.is_free);
    formData.append("is_trending", form.is_trending);
    formData.append("language", form.language);
    formData.append("event_type", form.event_type);
    formData.append("status", form.status);

    // banner image
    if (form.banner) {
      formData.append("banner", form.banner);
    }

    // section prices
    formData.append("section_prices", JSON.stringify(section_prices));

    let result;

    if (editing) {
      result = await dispatch(
        updateEventThunk({
          id: editing,
          data: formData,
        }),
      );
    } else {
      result = await dispatch(createEventThunk(formData));
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
      field: "language",
      headerName: "Language",
      width: 110,
      renderCell: ({ row }) => (
        <Chip
          label={row.language || "English"}
          size="small"
          color="primary"
          variant="outlined"
        />
      ),
    },
    {
      field: "is_trending",
      headerName: "Trending",
      width: 110,
      renderCell: ({ row }) => (
        <Typography
          sx={{
            color: row.is_trending ? "#22c55e" : "#f59e0b",
            fontWeight: 700,
            fontSize: 12,
          }}
        >
          {row.is_trending ? "YES" : "NO"}
        </Typography>
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

          {user.role === "super_admin" || user.role === "admin" ? (
            <Tooltip title="Assign Ticket Checker">
              <IconButton
                size="small"
                onClick={() => openAssignDialog(row)}
                sx={{ color: "#60a5fa" }}
              >
                {/* <PeopleIcon fontSize="small" /> */}
              </IconButton>
            </Tooltip>
          ) : null}

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
          {/* <Tooltip title="Edit">
            <IconButton
              size="small"
              // onClick={() => handleNavigateToEventHall(row)}

              onClick={() => {
                // setEditing(row.id);
                // handleNavigateToEventHall(row);
                // Build section_prices map from API array
                const spMap = { Premium: 0, Executive: 0, General: 0, VIP: 0 };
                (row.sectionPrices || []).forEach((sp) => {
                  spMap[sp.section_label] = Number(sp.price);
                });
                setForm({
                  hall_id: row.hall_id || "",
                  category_id: row.category_id || "",
                  title: row.title || "",
                  city: row.city || "",
                  is_trending: row.is_trending || false,
                  address: row.address || "",
                  description: row.description || "",
                  event_date: row.event_date || "",
                  start_time: row.start_time || "",
                  end_time: row.end_time || "",
                  ticket_price: row.ticket_price || 0,
                  total_tickets: row.total_tickets || 0,
                  status: row.status || "draft",
                  section_prices: spMap,
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
          </Tooltip> */}

          {/* <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => {
                // setEditing(row.id);
                // handleNavigateToEventHall(row);
                // Build section_prices map from API array
                const spMap = { Premium: 0, Executive: 0, General: 0, VIP: 0 };
                (row.sectionPrices || []).forEach((sp) => {
                  spMap[sp.section_label] = Number(sp.price);
                });
                setForm({
                  hall_id: row.hall_id || "",
                  category_id: row.category_id || "",
                  title: row.title || "",
                  city: row.city || "",
                  is_trending: row.is_trending || false,
                  address: row.address || "",
                  description: row.description || "",
                  event_date: row.event_date || "",
                  start_time: row.start_time || "",
                  end_time: row.end_time || "",
                  ticket_price: row.ticket_price || 0,
                  total_tickets: row.total_tickets || 0,
                  status: row.status || "draft",
                  section_prices: spMap,
                });
                setOpen(true);
              }}
              sx={{ color: "#60a5fa" }}
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip> */}
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => {
                const spMap = {
                  Premium: 0,
                  Executive: 0,
                  General: 0,
                  VIP: 0,
                  Standard: 0,
                };

                (row.sectionPrices || row.EventSectionPrices || []).forEach(
                  (sp) => {
                    if (sp.section_label) {
                      spMap[sp.section_label] = Number(sp.price || 0);
                    }
                  },
                );

                setForm({
                  hall_id: row.hall_id || "",
                  category_id: row.category_id || "",
                  title: row.title || "",
                  description: row.description || "",
                  event_date: row.event_date || "",
                  start_time: row.start_time || "",
                  end_time: row.end_time || "",
                  city: row.city || "",
                  address: row.address || "",
                  ticket_price: row.ticket_price || 0,
                  total_tickets: row.total_tickets || 0,
                  is_free: row.is_free || false,
                  is_trending: !!row.is_trending,
                  language: row.language || "English",
                  event_type: row.event_type || "Other",
                  status: row.status || "draft",
                  banner: null,
                  banner_url: row.banner_url || "",
                  banner_preview: "",
                  section_prices: spMap,
                });

                setEditing(row.id); // ← THIS WAS THE MAIN PROBLEM
                setOpen(true);
              }}
              sx={{ color: "#60a5fa" }}
            >
              <EditOutlinedIcon fontSize="small" />
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
      {/* {(user.role === "super_admin" || user.role === "admin") && ( */}
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
            {user.role === "super_admin" || user.role === "admin"
              ? "Events Management"
              : "All Events"}
          </Typography>

          <Typography sx={{ color: "#64748b", mt: 0.5 }}>
            {user.role === "super_admin" || user.role === "admin"
              ? "Premium dashboard to manage events, approvals & bookings"
              : "Our All Events You can Book Your Seat for Listed Events !"}
          </Typography>
        </Box>
        {/* {(user.role === "super_admin" || user.role === "admin") && (
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
        )}  */}
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <IconButton
            onClick={() => setView("list")}
            sx={{
              border: `1px solid ${view === "list" ? "#2563EB" : "#334155"}`,
              borderRadius: "8px",
              color: view === "list" ? "#2563EB" : "#64748B",
              background: view === "list" ? "#2563EB10" : "transparent",
              "&:hover": { borderColor: "#2563EB55", color: "#2563EB" },
            }}
          >
            <ViewListIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={() => setView("calendar")}
            sx={{
              border: `1px solid ${view === "calendar" ? "#2563EB" : "#334155"}`,
              borderRadius: "8px",
              color: view === "calendar" ? "#2563EB" : "#64748B",
              background: view === "calendar" ? "#2563EB10" : "transparent",
              "&:hover": { borderColor: "#2563EB55", color: "#2563EB" },
            }}
          >
            <CalendarMonthIcon fontSize="small" />
          </IconButton>
          {(user.role === "super_admin" || user.role === "admin") && (
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
          )}
        </Box>
      </Stack>
      {/* )} */}

      {/* Stats */}
      {user.role === "super_admin" || user.role === "admin" ? (
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
      ) : (
        <></>
      )}
      {/* Calendar View */}
      {view === "calendar" && (
        <Box sx={{ mt: 2 }}>
          <EventCalendar
            events={Array.isArray(rows) ? rows : []}
            user={user}
            onEventClick={(ev) => navigate(`/events/${ev.id}`)}
          />
        </Box>
      )}

      {/* Main Card */}
      <Card
        sx={{
          marginTop: "15px",
          display: view === "calendar" ? "none" : "block",
          background:
            "linear-gradient(145deg, rgba(30,41,59,.96), rgba(15,23,42,.96))",
          border: "1px solid #1e293b",
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
            rows={Array.isArray(rows) ? rows : []}
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
            {/* ✅ Language Field */}
            <CommonDropDown
              label="Event Language"
              value={form.language}
              options={[
                { id: "English", name: "English" },
                { id: "Hindi", name: "Hindi" },
                { id: "Gujarati", name: "Gujarati" },
                { id: "Tamil", name: "Tamil" },
                { id: "Telugu", name: "Telugu" },
                { id: "Marathi", name: "Marathi" },
                { id: "Bengali", name: "Bengali" },
                { id: "Kannada", name: "Kannada" },
              ]}
              onChange={(e) => setForm({ ...form, language: e.target.value })}
              required
            />

            {/* Event Type */}
            <CommonDropDown
              label="Event Type"
              value={form.event_type}
              options={[
                { id: "Drama", name: "Drama" },
                { id: "Comedy", name: "Comedy / Laughter" },
                { id: "Concert", name: "Concert / Music" },
                { id: "Workshop", name: "Workshop" },
                { id: "Meetup", name: "Meetup" },
                { id: "Festival", name: "Festival" },
                { id: "Sports", name: "Sports" },
                { id: "Theatre", name: "Theatre" },
                { id: "Dance", name: "Dance" },
                { id: "Other", name: "Other" },
              ]}
              onChange={(e) => setForm({ ...form, event_type: e.target.value })}
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
            {/* ✅ NEW: Is Trending Toggle */}
            <FormControlLabel
              control={
                <Switch
                  checked={form.is_trending || false}
                  onChange={(e) =>
                    setForm({ ...form, is_trending: e.target.checked })
                  }
                  color="success"
                />
              }
              label={
                <Typography>
                  Mark as <strong>Trending Event</strong>
                </Typography>
              }
              sx={{ mt: 1 }}
            />
            <Box>
              <Typography
                sx={{
                  color: "#94a3b8",
                  fontSize: 12,
                  mb: 1,
                  fontWeight: 600,
                }}
              >
                EVENT BANNER
              </Typography>

              <Button variant="outlined" component="label" fullWidth>
                Upload Banner Image
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];

                    if (file) {
                      setForm({
                        ...form,
                        banner: file,
                        banner_preview: URL.createObjectURL(file),
                      });
                    }
                  }}
                />
              </Button>

              {(form.banner_preview || form.banner_url) && (
                <Box
                  mt={2}
                  sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "1px solid #1e293b",
                  }}
                >
                  <img
                    src={
                      form.banner_preview || `${API_BASE_URL}${form.banner_url}`
                    }
                    alt="banner"
                    style={{
                      width: "100%",
                      height: 180,
                      objectFit: "cover",
                    }}
                  />
                </Box>
              )}
            </Box>
            {/* ── Section Prices ── */}
            <Box>
              <Typography
                sx={{ color: "#94a3b8", fontSize: 12, mb: 1, fontWeight: 600 }}
              >
                SECTION PRICES (per seat)
              </Typography>
              <Grid container spacing={1.5}>
                {SECTION_LABELS.map((sec) => (
                  <Grid item xs={6} key={sec.label}>
                    <TextField
                      label={sec.label}
                      type="number"
                      size="small"
                      fullWidth
                      value={form.section_prices[sec.label]}
                      inputProps={{ min: 0 }}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          section_prices: {
                            ...form.section_prices,
                            [sec.label]: e.target.value,
                          },
                        })
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <span style={{ color: sec.color, fontWeight: 700 }}>
                              ₹
                            </span>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: sec.color + "55" },
                          "&:hover fieldset": { borderColor: sec.color },
                        },
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
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
        open={assignDialogOpen}
        onClose={() => setAssignDialogOpen(false)}
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
          Assign Ticket Checker
        </DialogTitle>

        <DialogContent>
          <Typography sx={{ color: "#94a3b8", mb: 2 }}>
            Assign a ticket checker to event:{" "}
            {selectedEventForAssignment?.title}
          </Typography>

          <CommonDropDown
            label="Ticket Checker"
            value={selectedTicketCheckerUserId}
            options={ticketCheckerUsers.map((user) => ({
              label: `${user.name || user.email} (${user.email})`,
              value: user.id,
            }))}
            onChange={(e) => setSelectedTicketCheckerUserId(e.target.value)}
            required
          />
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAssignTicketChecker}
            disabled={assignLoading || !selectedTicketCheckerUserId}
          >
            {assignLoading ? <CircularProgress size={18} /> : "Assign"}
          </Button>
        </DialogActions>
      </Dialog>

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
