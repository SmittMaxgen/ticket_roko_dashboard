// src/components/PartyPlotDetail.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Party Plot DETAIL / MANAGE page  →  /party-plot/:id
// Full edit + ticket management + bookings view
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import api from "../api/axios";

import {
  Box,
  Typography,
  Stack,
  Button,
  IconButton,
  Tooltip,
  Tab,
  Tabs,
  TextField,
  CircularProgress,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Skeleton,
  MenuItem,
} from "@mui/material";

import QRCode from "react-qr-code";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import AddIcon from "@mui/icons-material/Add";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlineOutlined";

import {
  fetchPartyPlotByIdThunk,
  updatePartyPlotThunk,
  createTicketsThunk,
  bookTicketsThunk,
  bookEventTicketsThunk,
  scanTicketThunk,
} from "../features/partyPlot/partyPlotThunks";

import {
  selectCurrentPartyPlot,
  selectPartyPlotLoading,
  selectPartyPlotActionLoading,
  selectPartyPlotError,
} from "../features/partyPlot/partyPlotSelectors";

// ─────────────────────────────────────────────────────────────────────────────
// Stat Box
// ─────────────────────────────────────────────────────────────────────────────
function StatBox({ icon, title, value, color }) {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 120,
        background: "#0F172A",
        border: `1px solid ${color}28`,
        borderRadius: 3,
        p: 2.5,
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography
          sx={{
            fontSize: 10,
            color: "#64748B",
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          {title}
        </Typography>
        {React.cloneElement(icon, { sx: { fontSize: 18, color } })}
      </Stack>
      <Typography sx={{ fontSize: 30, fontWeight: 800, color, lineHeight: 1 }}>
        {value}
      </Typography>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Booking Card
// ─────────────────────────────────────────────────────────────────────────────
function BookingCard({ ticket }) {
  const isUsed = ticket.status === "used";

  return (
    <Box
      sx={{
        background: "#0F172A",
        border: "1px solid rgba(30,41,59,1)",
        borderRadius: 2.5,
        p: 2,
        transition: "border-color 0.2s",
        "&:hover": { borderColor: "rgba(100,116,139,0.4)" },
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        mb={1.5}
      >
        <Box>
          <Stack direction="row" alignItems="center" gap={0.8} mb={0.3}>
            <PersonOutlineIcon sx={{ fontSize: 15, color: "#64748B" }} />
            <Typography
              sx={{ color: "#F1F5F9", fontWeight: 700, fontSize: "0.9rem" }}
            >
              {ticket.bookedUser?.name || "—"}
            </Typography>
          </Stack>
          <Typography sx={{ color: "#475569", fontSize: "0.76rem" }}>
            {ticket.bookedUser?.email || "—"}
          </Typography>
        </Box>
        <Chip
          label={ticket.status}
          size="small"
          sx={{
            background: isUsed
              ? "rgba(239,68,68,0.15)"
              : "rgba(34,197,94,0.15)",
            color: isUsed ? "#EF4444" : "#22C55E",
            border: `1px solid ${isUsed ? "#EF444440" : "#22C55E40"}`,
            fontWeight: 700,
            fontSize: 10,
            height: 22,
          }}
        />
      </Stack>

      <Divider sx={{ borderColor: "rgba(30,41,59,1)", mb: 1.5 }} />

      {/* <Stack gap={0.8}>
        <Stack direction="row" justifyContent="space-between">
          <Typography sx={{ color: "#475569", fontSize: 11 }}>
            Ticket #
          </Typography>
          <Typography sx={{ color: "#F59E0B", fontWeight: 700, fontSize: 11 }}>
            {ticket.ticket_number}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography sx={{ color: "#475569", fontSize: 11 }}>
            Barcode
          </Typography>
          <Typography
            sx={{
              color: "#38BDF8",
              fontWeight: 700,
              fontSize: 10,
              fontFamily: "monospace",
            }}
          >
            {ticket.barcode}
          </Typography>
        </Stack>
      </Stack> */}
      <Stack alignItems="center" spacing={1} sx={{ mt: 1 }}>
        <QRCode
          value={`${window.location.origin}/scan-ticket/${ticket.barcode}`}
          size={120}
          style={{
            background: "#fff",
            padding: 8,
            borderRadius: 8,
          }}
        />

        <Typography
          sx={{
            color: "#38BDF8",
            fontWeight: 700,
            fontSize: 10,
            fontFamily: "monospace",
            textAlign: "center",
            wordBreak: "break-all",
          }}
        >
          {ticket.barcode}
        </Typography>
      </Stack>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab Panels
// ─────────────────────────────────────────────────────────────────────────────

// ── Info / Edit Tab ───────────────────────────────────────────────────────────
function EditTab({ plot, isAdmin, actionLoading, onSave }) {
  const [form, setForm] = useState({
    name: plot?.name || "",
    description: plot?.description || "",
    image: plot?.image || "",
    total_tickets: plot?.total_tickets || 0,
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (plot) {
      setForm({
        name: plot.name || "",
        description: plot.description || "",
        image: plot.image || "",
        total_tickets: plot.total_tickets || 0,
      });
      setFile(null);
      setPreview(null);
    }
  }, [plot]);

  const set = (key) => (e) =>
    setForm((f) => ({
      ...f,
      [key]: key === "total_tickets" ? Number(e.target.value) : e.target.value,
    }));

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    setPreview(selected ? URL.createObjectURL(selected) : null);
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      color: "#F1F5F9",
      "& fieldset": { borderColor: "rgba(100,116,139,0.25)" },
      "&:hover fieldset": { borderColor: "rgba(245,158,11,0.4)" },
      "&.Mui-focused fieldset": { borderColor: "#F59E0B" },
    },
    "& .MuiInputLabel-root": { color: "#64748B" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#F59E0B" },
  };

  const handleSave = () => {
    if (!form.name.trim()) return;

    if (file) {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("total_tickets", String(form.total_tickets));
      fd.append("image", file);
      onSave(fd);
    } else {
      onSave(form);
    }
  };

  return (
    <Box sx={{ maxWidth: 600 }}>
      <Stack spacing={2.5}>
        <TextField
          label="Venue Name *"
          value={form.name}
          onChange={set("name")}
          fullWidth
          sx={fieldSx}
        />
        <TextField
          label="Description"
          value={form.description}
          onChange={set("description")}
          fullWidth
          multiline
          rows={3}
          sx={fieldSx}
        />
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Button
            variant="outlined"
            component="label"
            sx={{ color: "#F1F5F9", borderColor: "rgba(100,116,139,0.2)" }}
          >
            Browse Image
            <input
              hidden
              accept="image/*"
              type="file"
              onChange={handleFileChange}
            />
          </Button>
          <TextField
            label="Or Image URL"
            value={form.image}
            onChange={set("image")}
            fullWidth
            sx={fieldSx}
            placeholder="https://..."
          />
        </Box>
        {preview ? (
          <Box
            component="img"
            src={preview}
            alt="preview"
            sx={{
              width: "100%",
              height: 140,
              objectFit: "cover",
              borderRadius: 1,
            }}
          />
        ) : form.image ? (
          <Box
            component="img"
            src={form.image}
            alt="image"
            sx={{
              width: "100%",
              height: 140,
              objectFit: "cover",
              borderRadius: 1,
            }}
            onError={(e) => (e.target.style.display = "none")}
          />
        ) : null}
        {isAdmin && (
          <TextField
            type="number"
            label="Total Tickets"
            value={form.total_tickets}
            onChange={set("total_tickets")}
            fullWidth
            sx={fieldSx}
            inputProps={{ min: 1 }}
          />
        )}
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={actionLoading || !form.name.trim()}
          onClick={handleSave}
          sx={{
            alignSelf: "flex-start",
            background: "linear-gradient(135deg,#F59E0B,#D97706)",
            textTransform: "none",
            fontWeight: 700,
            borderRadius: 2,
            px: 3,
            "&:hover": {
              background: "linear-gradient(135deg,#D97706,#B45309)",
            },
          }}
        >
          {actionLoading ? "Saving…" : "Save Changes"}
        </Button>
      </Stack>
    </Box>
  );
}

// ── Tickets / Operations Tab ──────────────────────────────────────────────────
function OperationsTab({
  plotId,
  isAdmin,
  actionLoading,
  onCreateTickets,
  onBookTickets,
  onScan,
}) {
  const [createCount, setCreateCount] = useState(50);
  const [bookCount, setBookCount] = useState(1);
  const [scanBarcode, setScanBarcode] = useState("");

  const inputSx = {
    width: 140,
    "& .MuiOutlinedInput-root": {
      color: "#F1F5F9",
      "& fieldset": { borderColor: "rgba(100,116,139,0.25)" },
      "&:hover fieldset": { borderColor: "rgba(245,158,11,0.4)" },
      "&.Mui-focused fieldset": { borderColor: "#F59E0B" },
    },
    "& .MuiInputLabel-root": { color: "#64748B" },
  };

  const panelSx = {
    background: "#0F172A",
    border: "1px solid rgba(30,41,59,1)",
    borderRadius: 3,
    p: 3,
  };

  const ActionBtn = ({ label, loadingLabel, onClick, gradient, shadow }) => (
    <Button
      variant="contained"
      disabled={actionLoading}
      onClick={onClick}
      sx={{
        background: gradient,
        textTransform: "none",
        fontWeight: 700,
        borderRadius: 2,
        px: 2.5,
        boxShadow: shadow,
        "&:hover": { filter: "brightness(1.1)", boxShadow: shadow },
      }}
    >
      {actionLoading ? loadingLabel : label}
    </Button>
  );

  return (
    <Stack spacing={3} sx={{ maxWidth: 600 }}>
      {/* Create Tickets */}
      {/* {isAdmin && (
        <Box sx={panelSx}>
          <Stack direction="row" alignItems="center" gap={1} mb={2}>
            <AddIcon sx={{ color: "#38BDF8", fontSize: 18 }} />
            <Typography sx={{ color: "#F1F5F9", fontWeight: 700 }}>
              Create Tickets
            </Typography>
          </Stack>
          <Stack direction="row" gap={2} alignItems="center">
            <TextField
              type="number"
              size="small"
              label="Count"
              value={createCount}
              onChange={(e) => setCreateCount(Number(e.target.value))}
              sx={inputSx}
              inputProps={{ min: 1 }}
            />
            <ActionBtn
              label="Create Tickets"
              loadingLabel="Creating…"
              onClick={() => onCreateTickets(createCount)}
              gradient="linear-gradient(135deg,#2563EB,#1D4ED8)"
              shadow="0 4px 18px rgba(37,99,235,0.35)"
            />
          </Stack>
        </Box>
      )} */}

      {/* Book Tickets */}
      <Box sx={panelSx}>
        <Stack direction="row" alignItems="center" gap={1} mb={2}>
          <BookOnlineIcon sx={{ color: "#22C55E", fontSize: 18 }} />
          <Typography sx={{ color: "#F1F5F9", fontWeight: 700 }}>
            Book Tickets
          </Typography>
        </Stack>
        <Stack direction="row" gap={2} alignItems="center">
          <TextField
            type="number"
            size="small"
            label="Count"
            value={bookCount}
            onChange={(e) => setBookCount(Number(e.target.value))}
            sx={inputSx}
            inputProps={{ min: 1 }}
          />
          <ActionBtn
            label="Book Tickets"
            loadingLabel="Booking…"
            onClick={() => onBookTickets(bookCount)}
            gradient="linear-gradient(135deg,#22C55E,#16A34A)"
            shadow="0 4px 18px rgba(34,197,94,0.3)"
          />
        </Stack>
        <Typography sx={{ mt: 1.5, color: "#475569", fontSize: 11 }}>
          Email + SMS confirmation sent automatically after booking.
        </Typography>
      </Box>

      {/* Scan Ticket */}
      <Box sx={panelSx}>
        <Stack direction="row" alignItems="center" gap={1} mb={2}>
          <QrCodeScannerIcon sx={{ color: "#F59E0B", fontSize: 18 }} />
          <Typography sx={{ color: "#F1F5F9", fontWeight: 700 }}>
            Scan Ticket
          </Typography>
        </Stack>
        <Stack direction="row" gap={2} alignItems="center">
          <TextField
            size="small"
            label="Barcode"
            value={scanBarcode}
            onChange={(e) => setScanBarcode(e.target.value)}
            sx={{ ...inputSx, width: 200 }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && scanBarcode.trim()) {
                onScan(scanBarcode.trim());
                setScanBarcode("");
              }
            }}
          />
          <ActionBtn
            label="Scan"
            loadingLabel="Scanning…"
            onClick={() => {
              if (scanBarcode.trim()) {
                onScan(scanBarcode.trim());
                setScanBarcode("");
              }
            }}
            gradient="linear-gradient(135deg,#F59E0B,#D97706)"
            shadow="0 4px 18px rgba(245,158,11,0.3)"
          />
        </Stack>
        <Typography sx={{ mt: 1.5, color: "#475569", fontSize: 11 }}>
          Press Enter or click Scan to validate a ticket.
        </Typography>
      </Box>
    </Stack>
  );
}

// ── Booked Tickets Tab ────────────────────────────────────────────────────────
function BookingExpandCard({ booking }) {
  const [expanded, setExpanded] = useState(false);
  const isUsed = booking.status === "used";

  return (
    <Box
      sx={{
        background: "#0F172A",
        border: "1px solid rgba(30,41,59,1)",
        borderRadius: 2.5,
        overflow: "hidden",
      }}
    >
      {/* ── Header Row ── */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ p: 2, cursor: "pointer" }}
        onClick={() => setExpanded((v) => !v)}
      >
        <Box>
          <Typography sx={{ color: "#F1F5F9", fontWeight: 700, fontSize: 13 }}>
            {booking.user?.name || "—"}
          </Typography>
          <Typography sx={{ color: "#64748B", fontSize: 11 }}>
            {booking.user?.email}
          </Typography>
          {booking.event && (
            <Typography sx={{ color: "#94A3B8", fontSize: 11, mt: 0.3 }}>
              Event: {booking.event?.title}
            </Typography>
          )}
        </Box>
        <Box sx={{ textAlign: "right" }}>
          <Typography sx={{ color: "#F59E0B", fontWeight: 700, fontSize: 12 }}>
            {booking.booking_ref}
          </Typography>
          <Typography sx={{ color: "#94A3B8", fontSize: 11 }}>
            Tickets: {booking.total_tickets}
          </Typography>
          <Typography sx={{ color: "#22C55E", fontSize: 11, fontWeight: 700 }}>
            ₹{booking.total_amount}
          </Typography>
          <Stack direction="row" gap={1} justifyContent="flex-end" mt={0.5}>
            <Chip
              label={booking.status}
              size="small"
              sx={{
                background:
                  booking.status === "confirmed"
                    ? "rgba(34,197,94,0.15)"
                    : "rgba(100,116,139,0.15)",
                color: booking.status === "confirmed" ? "#22C55E" : "#94A3B8",
                fontSize: 10,
                fontWeight: 700,
              }}
            />
            <Chip
              label={expanded ? "▲ Hide QR" : "▼ Show QR"}
              size="small"
              sx={{
                background: "rgba(245,158,11,0.1)",
                color: "#F59E0B",
                fontSize: 10,
                fontWeight: 700,
                cursor: "pointer",
              }}
            />
          </Stack>
        </Box>
      </Stack>

      {/* ── Expandable QR Grid ── */}
      {expanded && (
        <Box
          sx={{
            borderTop: "1px solid rgba(30,41,59,1)",
            p: 2,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 2,
          }}
        >
          {(booking.tickets || []).map((ticket) => (
            <Box
              key={ticket.id}
              sx={{
                background: "#0a1120",
                border: `1px solid ${ticket.status === "used" ? "#EF444440" : "#22C55E40"}`,
                borderRadius: 2,
                p: 1.5,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Chip
                label={ticket.status}
                size="small"
                sx={{
                  background:
                    ticket.status === "used"
                      ? "rgba(239,68,68,0.15)"
                      : "rgba(34,197,94,0.15)",
                  color: ticket.status === "used" ? "#EF4444" : "#22C55E",
                  fontSize: 9,
                  fontWeight: 700,
                  height: 18,
                }}
              />
              <QRCode
                value={`${window.location.origin}/scan-ticket/${ticket.barcode}`}
                size={100}
                style={{ background: "#fff", padding: 6, borderRadius: 6 }}
              />
              <Typography
                sx={{
                  color: "#38BDF8",
                  fontSize: 9,
                  fontFamily: "monospace",
                  textAlign: "center",
                  wordBreak: "break-all",
                }}
              >
                {ticket.ticket_number}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

function BookingsTab({ plotId, events }) {
  const [filterEventId, setFilterEventId] = useState("all");
  const [page, setPage] = useState(1);
  const [bookings, setBookings] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const limit = 20;

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = { party_plot_id: plotId, page, limit };
      if (filterEventId === "pp_only") params.pp_only = "true";
      else if (filterEventId !== "all") params.event_id = filterEventId;

      const { data } = await api.get("/party-plot-bookings", { params });
      setBookings(data.data || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [filterEventId, page]);

  const totalPages = Math.ceil(total / limit);

  const selectSx = {
    "& .MuiOutlinedInput-root": {
      color: "#F1F5F9",
      "& fieldset": { borderColor: "rgba(100,116,139,0.25)" },
      "&:hover fieldset": { borderColor: "rgba(245,158,11,0.4)" },
      "&.Mui-focused fieldset": { borderColor: "#F59E0B" },
    },
    "& .MuiInputLabel-root": { color: "#64748B" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#F59E0B" },
  };

  return (
    <Box>
      {/* Filter Row */}
      <Stack direction="row" gap={2} mb={3} alignItems="center" flexWrap="wrap">
        <TextField
          select
          size="small"
          label="Filter by Event"
          value={filterEventId}
          onChange={(e) => {
            setFilterEventId(e.target.value);
            setPage(1);
          }}
          sx={{ minWidth: 220, ...selectSx }}
        >
          <MenuItem value="all">All Bookings</MenuItem>
          <MenuItem value="pp_only">Party Plot Only (no event)</MenuItem>
          {(events || []).map((ev) => (
            <MenuItem key={ev.id} value={String(ev.id)}>
              {ev.title}
            </MenuItem>
          ))}
        </TextField>
        <Typography sx={{ color: "#64748B", fontSize: 12 }}>
          {total} total booking{total !== 1 ? "s" : ""}
        </Typography>
      </Stack>

      {/* Content */}
      {loading ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
            gap: 2,
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <Skeleton
              key={i}
              variant="rounded"
              height={200}
              sx={{ bgcolor: "rgba(255,255,255,0.05)" }}
            />
          ))}
        </Box>
      ) : bookings.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography sx={{ fontSize: 40, mb: 2 }}>🎫</Typography>
          <Typography sx={{ color: "#64748B" }}>No bookings found.</Typography>
        </Box>
      ) : (
        <Stack spacing={1.5}>
          {bookings.map((booking) => (
            <BookingExpandCard key={booking.id} booking={booking} />
          ))}
        </Stack>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          gap={2}
          mt={3}
        >
          <Button
            size="small"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            sx={{ color: "#F59E0B", textTransform: "none" }}
          >
            Prev
          </Button>
          <Typography sx={{ color: "#64748B", fontSize: 12 }}>
            Page {page} of {totalPages}
          </Typography>
          <Button
            size="small"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            sx={{ color: "#F59E0B", textTransform: "none" }}
          >
            Next
          </Button>
        </Stack>
      )}
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
export default function PartyPlotDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const plot = useSelector(selectCurrentPartyPlot);
  const loading = useSelector(selectPartyPlotLoading);
  const actionLoading = useSelector(selectPartyPlotActionLoading);
  const error = useSelector(selectPartyPlotError);
  const user = useSelector((state) => state.auth.user);

  const isAdmin = user?.role === "admin" || user?.role === "super_admin";

  const [tab, setTab] = useState("info");
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [ticketCheckerUsers, setTicketCheckerUsers] = useState([]);
  const [selectedTicketCheckerId, setSelectedTicketCheckerId] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventBookingCount, setEventBookingCount] = useState(1);
  const [eventBookingLoading, setEventBookingLoading] = useState(false);
  // ── Fetch on mount / id change ────────────────────────────
  useEffect(() => {
    if (id) dispatch(fetchPartyPlotByIdThunk(id));
  }, [dispatch, id]);

  // ── Derived ticket stats ──────────────────────────────────
  const tickets = plot?.tickets || [];
  const available = tickets.filter((t) => t.status === "available");
  const booked = tickets.filter((t) => t.status === "booked");
  const used = tickets.filter((t) => t.status === "used");

  // event bookings count
  const eventBookingsCount = (plot?.partyPlotEvents || []).reduce(
    (a, e) =>
      a +
      (e.eventTicketBookings?.reduce(
        (b, b2) => b + (b2.total_tickets || 0),
        0,
      ) || 0),
    0,
  );

  // ── Handlers ─────────────────────────────────────────────
  const handleSave = (formData) => {
    const isFormData =
      typeof FormData !== "undefined" && formData instanceof FormData;

    const payload = isFormData ? formData : { id, ...formData };

    if (isFormData) {
      formData.append("id", id);
      dispatch(updatePartyPlotThunk(formData))
        .unwrap()
        .then(() => {
          enqueueSnackbar("Party plot updated!", { variant: "success" });
          dispatch(fetchPartyPlotByIdThunk(id));
        })
        .catch((err) =>
          enqueueSnackbar(err || "Update failed.", { variant: "error" }),
        );
    } else {
      dispatch(updatePartyPlotThunk({ id, ...formData }))
        .unwrap()
        .then(() => {
          enqueueSnackbar("Party plot updated!", { variant: "success" });
          dispatch(fetchPartyPlotByIdThunk(id));
        })
        .catch((err) =>
          enqueueSnackbar(err || "Update failed.", { variant: "error" }),
        );
    }
  };

  const handleCreateTickets = (count) => {
    dispatch(createTicketsThunk({ id, num_tickets: count }))
      .unwrap()
      .then(() => {
        enqueueSnackbar(`${count} tickets created!`, { variant: "success" });
        dispatch(fetchPartyPlotByIdThunk(id));
      })
      .catch((err) => enqueueSnackbar(err || "Failed.", { variant: "error" }));
  };

  const handleBookTickets = (count) => {
    dispatch(bookTicketsThunk({ id, num_tickets: count }))
      .unwrap()
      .then(() => {
        enqueueSnackbar(`${count} tickets booked!`, { variant: "success" });
        dispatch(fetchPartyPlotByIdThunk(id));
      })
      .catch((err) =>
        enqueueSnackbar(err || "Booking failed.", { variant: "error" }),
      );
  };

  const loadTicketCheckerUsers = async () => {
    if (ticketCheckerUsers.length) return;

    try {
      const { data } = await api.get("/users");
      setTicketCheckerUsers(
        (data.data || []).filter((user) => user.role === "ticket_checker"),
      );
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
      loadTicketCheckerUsers();
    }
  }, [assignDialogOpen]);

  const handleAssignTicketChecker = async () => {
    if (!selectedTicketCheckerId) {
      enqueueSnackbar("Please select a ticket checker.", {
        variant: "warning",
      });
      return;
    }

    setAssignLoading(true);
    try {
      await api.post(`/party-plots/${id}/assign-ticket-checker`, {
        user_id: selectedTicketCheckerId,
      });
      enqueueSnackbar("Ticket checker assigned successfully.", {
        variant: "success",
      });
      setAssignDialogOpen(false);
      setSelectedTicketCheckerId("");
      dispatch(fetchPartyPlotByIdThunk(id));
    } catch (err) {
      enqueueSnackbar(
        err.response?.data?.message || err.message || "Assignment failed",
        { variant: "error" },
      );
    } finally {
      setAssignLoading(false);
    }
  };

  const handleBookEventTickets = async () => {
    if (!selectedEvent || !eventBookingCount) return;
    setEventBookingLoading(true);
    try {
      await api.post(`/party-plots/${selectedEvent.id}/book-tickets`, {
        num_tickets: eventBookingCount,
      });
      enqueueSnackbar(
        `${eventBookingCount} tickets booked for ${selectedEvent.title}!`,
        { variant: "success" },
      );
      setSelectedEvent(null);
      setEventBookingCount(1);
      dispatch(fetchPartyPlotByIdThunk(id));
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || "Booking failed.", {
        variant: "error",
      });
    } finally {
      setEventBookingLoading(false);
    }
  };

  const handleScan = (barcode) => {
    api
      .post("/scan-ticket", { barcode })
      .then(() => {
        enqueueSnackbar("Ticket validated!", { variant: "success" });
        dispatch(fetchPartyPlotByIdThunk(id));
      })
      .catch((err) =>
        enqueueSnackbar(err.response?.data?.message || "Invalid ticket.", {
          variant: "error",
        }),
      );
  };

  // ─────────────────────────────────────────────────────────
  // Loading skeleton
  // ─────────────────────────────────────────────────────────
  if (loading && !plot) {
    return (
      <Box sx={{ p: 0 }}>
        <Skeleton
          variant="text"
          width={160}
          height={24}
          sx={{ bgcolor: "rgba(255,255,255,0.05)", mb: 3 }}
        />
        <Skeleton
          variant="text"
          width={280}
          height={44}
          sx={{ bgcolor: "rgba(255,255,255,0.06)", mb: 1 }}
        />
        <Skeleton
          variant="text"
          width={200}
          height={20}
          sx={{ bgcolor: "rgba(255,255,255,0.04)", mb: 4 }}
        />
        <Stack direction="row" gap={2} mb={4}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton
              key={i}
              variant="rounded"
              sx={{ flex: 1, height: 80, bgcolor: "rgba(255,255,255,0.05)" }}
            />
          ))}
        </Stack>
      </Box>
    );
  }

  // ─────────────────────────────────────────────────────────
  // Not found
  // ─────────────────────────────────────────────────────────
  if (!loading && !plot && error) {
    return (
      <Box sx={{ textAlign: "center", py: 10 }}>
        <Typography sx={{ fontSize: 48, mb: 2 }}>⚠️</Typography>
        <Typography sx={{ color: "#EF4444", fontWeight: 700, mb: 1 }}>
          Party Plot Not Found
        </Typography>
        <Typography sx={{ color: "#64748B", mb: 3, fontSize: "0.875rem" }}>
          {error}
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/party-plot")}
          sx={{ color: "#F59E0B", textTransform: "none" }}
        >
          Back to Party Plots
        </Button>
      </Box>
    );
  }

  const total = tickets.length;
  const filledPct =
    total > 0 ? Math.round(((total - available.length) / total) * 100) : 0;

  // ─────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────
  return (
    <Box sx={{ p: 0 }}>
      {/* ── Back + Breadcrumb ── */}
      <Stack direction="row" alignItems="center" gap={1} mb={3}>
        <IconButton
          size="small"
          onClick={() => navigate("/party-plot")}
          sx={{ color: "#64748B", "&:hover": { color: "#F59E0B" } }}
        >
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <Typography sx={{ color: "#475569", fontSize: "0.8rem" }}>
          Party Plots
        </Typography>
        <Typography sx={{ color: "#334155", fontSize: "0.8rem" }}>/</Typography>
        <Typography
          sx={{ color: "#94A3B8", fontSize: "0.8rem", fontWeight: 600 }}
        >
          {plot?.name || "Loading…"}
        </Typography>
      </Stack>

      {/* ── Header ── */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ sm: "flex-start" }}
        gap={2}
        sx={{ mb: 4, pb: 3, borderBottom: "1px solid rgba(100,116,139,0.2)" }}
      >
        <Box flex={1}>
          <Typography
            sx={{
              fontSize: "2rem",
              fontWeight: 800,
              background: "linear-gradient(135deg,#F59E0B 0%,#6366f1 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 0.5,
              lineHeight: 1.1,
            }}
          >
            {plot?.name || "—"}
          </Typography>
          <Typography sx={{ color: "#64748B", fontSize: "0.875rem", mb: 1.5 }}>
            {plot?.description || "No description provided."}
          </Typography>

          {isAdmin && (
            <Button
              variant="contained"
              sx={{ mb: 2 }}
              onClick={() => setAssignDialogOpen(true)}
              startIcon={<PersonOutlineIcon />}
            >
              Assign Ticket Checker
            </Button>
          )}

          {/* Fill Rate */}
          <Box sx={{ maxWidth: 360 }}>
            <Stack direction="row" justifyContent="space-between" mb={0.5}>
              <Typography
                sx={{
                  color: "#475569",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 0.8,
                }}
              >
                FILL RATE
              </Typography>
              <Typography
                sx={{
                  fontSize: 10,
                  fontWeight: 700,
                  color:
                    filledPct > 80
                      ? "#EF4444"
                      : filledPct > 50
                        ? "#F59E0B"
                        : "#22C55E",
                }}
              >
                {filledPct}%
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={filledPct}
              sx={{
                height: 5,
                borderRadius: 4,
                background: "rgba(255,255,255,0.06)",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 4,
                  background:
                    filledPct > 80
                      ? "linear-gradient(90deg,#F59E0B,#EF4444)"
                      : filledPct > 50
                        ? "linear-gradient(90deg,#22C55E,#F59E0B)"
                        : "linear-gradient(90deg,#38BDF8,#22C55E)",
                },
              }}
            />
          </Box>
        </Box>

        {/* Cover image */}
        {plot?.image && (
          <Box
            component="img"
            src={plot.image}
            alt={plot.name}
            sx={{
              width: 140,
              height: 100,
              objectFit: "cover",
              borderRadius: 2.5,
              border: "1px solid rgba(100,116,139,0.2)",
              flexShrink: 0,
            }}
          />
        )}
      </Stack>

      {/* ── Stats Row ── */}
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
            Assign a ticket checker to {plot?.name || "this party plot"}.
          </Typography>

          <TextField
            select
            label="Ticket Checker"
            value={selectedTicketCheckerId}
            onChange={(e) => setSelectedTicketCheckerId(e.target.value)}
            fullWidth
            size="small"
          >
            {ticketCheckerUsers.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name || user.email} ({user.email})
              </MenuItem>
            ))}
            {ticketCheckerUsers.length === 0 && (
              <MenuItem value="" disabled>
                No ticket checker users found
              </MenuItem>
            )}
          </TextField>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAssignTicketChecker}
            disabled={assignLoading || !selectedTicketCheckerId}
          >
            {assignLoading ? <CircularProgress size={18} /> : "Assign"}
          </Button>
        </DialogActions>
      </Dialog>

      <Stack
        sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}
        direction="row"
        flexWrap="wrap"
        gap={2}
        mb={4}
      >
        {/* <StatBox
          icon={<ConfirmationNumberIcon />}
          title="TOTAL"
          value={total}
          color="#38BDF8"
        />
        <StatBox
          icon={<EventAvailableIcon />}
          title="AVAILABLE"
          value={available.length}
          color="#22C55E"
        /> */}
        <StatBox
          icon={<LocalActivityIcon />}
          title="BOOKED"
          value={booked.length}
          color="#F59E0B"
        />
        <StatBox
          icon={<CheckCircleIcon />}
          title="USED"
          value={used.length}
          color="#EF4444"
        />
        <StatBox
          icon={<BookOnlineIcon />}
          title="EVENT BOOKINGS"
          value={eventBookingsCount}
          color="#6366f1"
        />
      </Stack>

      {/* ── Tabs ── */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{
          mb: 3,
          borderBottom: "1px solid rgba(100,116,139,0.15)",
          "& .MuiTab-root": {
            color: "#475569",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.875rem",
          },
          "& .Mui-selected": { color: "#F59E0B !important" },
          "& .MuiTabs-indicator": { background: "#F59E0B" },
        }}
      >
        <Tab value="info" label="Info & Edit" />
        <Tab value="operations" label="Ticket Operations" />
        <Tab
          value="bookings"
          label={`PP Bookings (${booked.length + used.length})`}
        />
        <Tab
          value="events"
          label={`Events (${(plot?.partyPlotEvents || []).length})`}
        />
        <Tab
          value="eventBookings"
          label={`Event Bookings (${(plot?.partyPlotEvents || []).reduce((a, e) => a + (e.eventTicketBookings?.reduce((b, b2) => b + (b2.total_tickets || 0), 0) || 0), 0)} tickets)`}
        />
      </Tabs>

      {/* ── Tab Content ── */}
      {tab === "info" && (
        <EditTab
          plot={plot}
          isAdmin={isAdmin}
          actionLoading={actionLoading}
          onSave={handleSave}
        />
      )}

      {tab === "operations" && (
        <OperationsTab
          plotId={id}
          isAdmin={isAdmin}
          actionLoading={actionLoading}
          onCreateTickets={handleCreateTickets}
          onBookTickets={handleBookTickets}
          onScan={handleScan}
        />
      )}

      {/* {tab === "bookings" && <BookingsTab tickets={tickets} />} */}
      {tab === "bookings" && (
        <BookingsTab plotId={id} events={plot?.partyPlotEvents || []} />
      )}

      {tab === "events" && (
        <Box>
          {(plot?.partyPlotEvents || []).length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography sx={{ fontSize: 40, mb: 2 }}>🎪</Typography>
              <Typography sx={{ color: "#64748B" }}>No events yet.</Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
                gap: 2,
              }}
            >
              {(plot?.partyPlotEvents || []).map((event) => (
                <Box
                  key={event.id}
                  sx={{
                    background: "#0F172A",
                    border: "1px solid rgba(30,41,59,1)",
                    borderRadius: 2.5,
                    p: 2,
                  }}
                >
                  {event.banner_url && (
                    <Box
                      component="img"
                      src={event.banner_url}
                      sx={{
                        width: "100%",
                        height: 110,
                        objectFit: "cover",
                        borderRadius: 1.5,
                        mb: 1.5,
                      }}
                    />
                  )}
                  <Typography
                    sx={{ color: "#F1F5F9", fontWeight: 700, fontSize: 14 }}
                  >
                    {event.title}
                  </Typography>
                  <Typography sx={{ color: "#64748B", fontSize: 12, mt: 0.5 }}>
                    📅{" "}
                    {new Date(event.event_date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                    {" • "}
                    {event.start_time}
                  </Typography>
                  <Typography sx={{ color: "#64748B", fontSize: 12, mt: 0.3 }}>
                    📍 {event.city || "—"}
                  </Typography>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={1.5}
                  >
                    <Chip
                      label={event.status}
                      size="small"
                      sx={{
                        background:
                          event.status === "approved"
                            ? "rgba(34,197,94,0.15)"
                            : "rgba(100,116,139,0.15)",
                        color:
                          event.status === "approved" ? "#22C55E" : "#94A3B8",
                        fontSize: 10,
                        fontWeight: 700,
                      }}
                    />
                    <Typography
                      sx={{ color: "#F59E0B", fontWeight: 700, fontSize: 12 }}
                    >
                      {event.sold_tickets}/{event.total_tickets} sold
                    </Typography>
                  </Stack>
                  <Stack direction="row" gap={1} mt={1.5}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      onClick={() => setSelectedEvent(event)}
                      sx={{
                        borderColor: "#22C55E40",
                        color: "#22C55E",
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "none",
                        borderRadius: 1.5,
                        "&:hover": {
                          borderColor: "#22C55E",
                          background: "rgba(34,197,94,0.08)",
                        },
                      }}
                    >
                      Book Tickets
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      onClick={() => navigate(`/events/${event.id}`)}
                      sx={{
                        borderColor: "#38BDF840",
                        color: "#38BDF8",
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "none",
                        borderRadius: 1.5,
                        "&:hover": {
                          borderColor: "#38BDF8",
                          background: "rgba(56,189,248,0.08)",
                        },
                      }}
                    >
                      View Event
                    </Button>
                  </Stack>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}

      {tab === "eventBookings" && (
        <Box>
          {(plot?.partyPlotEvents || []).every(
            (e) => !e.eventTicketBookings?.length,
          ) ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography sx={{ fontSize: 40, mb: 2 }}>🎫</Typography>
              <Typography sx={{ color: "#64748B" }}>
                No event bookings yet.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={1.5}>
              {(plot?.partyPlotEvents || []).map((event) =>
                (event.eventTicketBookings || []).map((booking) => (
                  <Box
                    key={booking.id}
                    sx={{
                      background: "#0F172A",
                      border: "1px solid rgba(30,41,59,1)",
                      borderRadius: 2.5,
                      p: 2,
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box>
                        <Typography
                          sx={{
                            color: "#F1F5F9",
                            fontWeight: 700,
                            fontSize: 13,
                          }}
                        >
                          {booking.user?.name || "—"}
                        </Typography>
                        <Typography sx={{ color: "#64748B", fontSize: 11 }}>
                          {booking.user?.email}
                        </Typography>
                        <Typography
                          sx={{ color: "#94A3B8", fontSize: 11, mt: 0.5 }}
                        >
                          Event: {event.title}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography
                          sx={{
                            color: "#F59E0B",
                            fontWeight: 700,
                            fontSize: 12,
                          }}
                        >
                          {booking.booking_ref}
                        </Typography>
                        <Typography sx={{ color: "#94A3B8", fontSize: 11 }}>
                          Tickets: {booking.total_tickets}
                        </Typography>
                        <Typography
                          sx={{
                            color: "#22C55E",
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        >
                          ₹{booking.total_amount}
                        </Typography>
                        <Chip
                          label={booking.status}
                          size="small"
                          sx={{
                            mt: 0.5,
                            background:
                              booking.status === "confirmed"
                                ? "rgba(34,197,94,0.15)"
                                : "rgba(100,116,139,0.15)",
                            color:
                              booking.status === "confirmed"
                                ? "#22C55E"
                                : "#94A3B8",
                            fontSize: 10,
                            fontWeight: 700,
                          }}
                        />
                      </Box>
                    </Stack>
                  </Box>
                )),
              )}
            </Stack>
          )}
        </Box>
      )}
      {/* Event Booking Dialog */}
      <Dialog
        open={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            background: "#0F172A",
            border: "1px solid #1E293B",
            borderRadius: 3,
            color: "#fff",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: "1.1rem" }}>
          Book Tickets — {selectedEvent?.title}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#64748B", fontSize: 12, mb: 2 }}>
            Available:{" "}
            {(selectedEvent?.total_tickets || 0) -
              (selectedEvent?.sold_tickets || 0)}{" "}
            tickets • ₹{selectedEvent?.ticket_price} each
          </Typography>
          <TextField
            type="number"
            label="Number of Tickets"
            value={eventBookingCount}
            onChange={(e) => setEventBookingCount(Number(e.target.value))}
            fullWidth
            inputProps={{
              min: 1,
              max:
                (selectedEvent?.total_tickets || 0) -
                (selectedEvent?.sold_tickets || 0),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#F1F5F9",
                "& fieldset": { borderColor: "rgba(100,116,139,0.25)" },
              },
              "& .MuiInputLabel-root": { color: "#64748B" },
            }}
          />
          <Typography
            sx={{ color: "#22C55E", fontWeight: 700, fontSize: 13, mt: 1.5 }}
          >
            Total: ₹
            {(
              eventBookingCount * Number(selectedEvent?.ticket_price || 0)
            ).toLocaleString("en-IN")}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={() => setSelectedEvent(null)}
            sx={{ color: "#64748B", textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleBookEventTickets}
            disabled={eventBookingLoading || eventBookingCount < 1}
            sx={{
              background: "linear-gradient(135deg,#22C55E,#16A34A)",
              textTransform: "none",
              fontWeight: 700,
              px: 3,
              borderRadius: 2,
            }}
          >
            {eventBookingLoading ? (
              <CircularProgress size={18} />
            ) : (
              "Confirm Booking"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
