// src/pages/TheaterSeatApp.jsx
// ─────────────────────────────────────────────────────────────
// Two modes:
//  1. Book Seats  — loads hall from API, renders dynamic grid, lets user select & pay
//  2. Admin Draw  — free-draw canvas, saves hall + seats to API via Redux
// ─────────────────────────────────────────────────────────────
import { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Grid,
  Box,
  Typography,
  Chip,
} from "@mui/material";

import {
  fetchHallByIdThunk,
  createHallThunk,
  serialiseDrawLayout,
} from "../features/halls/hallThunks";
import {
  selectCurrentHall,
  selectHallLoading,
  selectHallActionLoading,
} from "../features/halls/hallSelectors";
import {
  toggleSeatSelected,
  clearSelections,
} from "../features/hallSeat/hallSeatSlice";
import {
  selectSelectedSeats,
  selectSelectedTotal,
  selectSeatsByRow,
} from "../features/hallSeat/seatSelectorsx";

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────
const MODES = ["Book Seats", "Admin: Draw Mode"];

const DRAW_SECTIONS = [
  {
    id: "premium",
    label: "Premium",
    color: "#f59e0b",
    price: 800,
    seat_type: "vip",
  },
  {
    id: "executive",
    label: "Executive",
    color: "#818cf8",
    price: 500,
    seat_type: "standard",
  },
  {
    id: "general",
    label: "General",
    color: "#34d399",
    price: 250,
    seat_type: "standard",
  },
  { id: "vip", label: "VIP", color: "#f472b6", price: 1200, seat_type: "vip" },
];

const DRAW_TOOLS = [
  { id: "row", icon: "▬", label: "Add Row" },
  { id: "seat", icon: "◻", label: "Add Seat" },
  { id: "erase", icon: "⌫", label: "Erase" },
];

const SEAT_SHAPES = [
  { id: "rounded", r: 4, label: "Rounded" },
  { id: "square", r: 1, label: "Square" },
  { id: "circle", r: 11, label: "Circle" },
];

const HALL_TYPES = ["end_stage", "arena", "proscenium", "traverse", "custom"];

// Seat size + gap on draw canvas
const S = 22;
const GAP = 5;

// ─────────────────────────────────────────────────────────────
// GEOMETRY
// ─────────────────────────────────────────────────────────────
function seatsAlongLine(x1, y1, x2, y2) {
  const dx = x2 - x1,
    dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const count = Math.max(1, Math.round(dist / (S + GAP)) + 1);
  const ux = dist === 0 ? 1 : dx / dist;
  const uy = dist === 0 ? 0 : dy / dist;
  return Array.from({ length: count }, (_, i) => ({
    x: x1 + ux * i * (S + GAP),
    y: y1 + uy * i * (S + GAP),
  }));
}

// Status → colours
const seatBg = (seat) => {
  if (seat.is_space) return "transparent";
  if (seat.status === "sold") return "#1e1215";
  if (seat.status === "selected") return seat.fill || "#f59e0b";
  return (seat.fill || "#b2b2b2") + "22";
};

const seatBorder = (seat) => {
  if (seat.is_space) return "transparent";
  if (seat.status === "sold") return "#4a1a2244";
  if (seat.status === "selected") return seat.fill || "#f59e0b";
  return (seat.fill || "#b2b2b2") + "66";
};

// ─────────────────────────────────────────────────────────────
// SAVE HALL DIALOG (used inside DrawMode)
// ─────────────────────────────────────────────────────────────
function SaveHallDialog({ open, onClose, onSave, saving }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    hall_type: "end_stage",
    city: "",
    address: "",
  });
  const [err, setErr] = useState("");

  const handleSubmit = () => {
    if (!form.name.trim()) {
      setErr("Hall name is required");
      return;
    }
    if (!form.city.trim()) {
      setErr("City is required");
      return;
    }
    if (!form.address.trim()) {
      setErr("Address is required");
      return;
    }
    setErr("");
    onSave(form);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { background: "#1E293B", border: "1px solid #334155" },
      }}
    >
      <DialogTitle sx={{ color: "#F8FAFC", fontWeight: 700, fontSize: 16 }}>
        Save Hall Layout
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          {err && (
            <Grid item xs={12}>
              <Alert
                severity="error"
                sx={{ background: "#2d1515", color: "#fca5a5", fontSize: 12 }}
              >
                {err}
              </Alert>
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField
              label="Hall Name"
              size="small"
              fullWidth
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              sx={{
                "& .MuiOutlinedInput-root fieldset": { borderColor: "#334155" },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl size="small" fullWidth>
              <InputLabel sx={{ color: "#64748B" }}>Hall Type</InputLabel>
              <Select
                label="Hall Type"
                value={form.hall_type}
                onChange={(e) =>
                  setForm({ ...form, hall_type: e.target.value })
                }
                sx={{
                  "& fieldset": { borderColor: "#334155" },
                  color: "#F8FAFC",
                }}
              >
                {HALL_TYPES.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t.replace("_", " ")}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="City"
              size="small"
              fullWidth
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              sx={{
                "& .MuiOutlinedInput-root fieldset": { borderColor: "#334155" },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Address"
              size="small"
              fullWidth
              multiline
              rows={2}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              sx={{
                "& .MuiOutlinedInput-root fieldset": { borderColor: "#334155" },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description (optional)"
              size="small"
              fullWidth
              multiline
              rows={2}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              sx={{
                "& .MuiOutlinedInput-root fieldset": { borderColor: "#334155" },
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: "16px 24px", gap: 1 }}>
        <Button onClick={onClose} sx={{ color: "#64748B" }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={saving}
          sx={{
            background: "linear-gradient(135deg,#2563EB,#1D4ED8)",
            "&:hover": { background: "#1D4ED8" },
          }}
        >
          {saving ? (
            <CircularProgress size={18} sx={{ color: "#fff" }} />
          ) : (
            "Save Hall →"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────
// BOOKING VIEW — loads from API via Redux
// ─────────────────────────────────────────────────────────────
function BookingView({ hallId }) {
  const dispatch = useDispatch();
  const hall = useSelector(selectCurrentHall);
  const loading = useSelector(selectHallLoading);
  const selectedSeats = useSelector(selectSelectedSeats);
  const total = useSelector(selectSelectedTotal);

  const [zoom, setZoom] = useState(1);
  const [tooltip, setTooltip] = useState(null);
  // Local seat state (copy from API data for interactive selection)
  const [localSeats, setLocalSeats] = useState([]);

  // Load hall when hallId changes
  useEffect(() => {
    if (hallId) {
      dispatch(fetchHallByIdThunk({ id: hallId }));
    }
  }, [hallId, dispatch]);

  // Sync local seats when API data arrives
  useEffect(() => {
    if (hall?.seats) {
      setLocalSeats(hall.seats.map((s) => ({ ...s })));
    }
  }, [hall]);

  const toggleSeat = useCallback((seatId) => {
    setLocalSeats((prev) =>
      prev.map((s) => {
        if (s.id !== seatId || s.is_space || s.status === "sold") return s;
        return {
          ...s,
          status: s.status === "selected" ? "available" : "selected",
        };
      }),
    );
  }, []);

  const selectedLocal = localSeats.filter((s) => s.status === "selected");
  const localTotal = selectedLocal.reduce(
    (a, s) => a + Number(s.price || 0),
    0,
  );

  // Group by row_label for rendering
  const rowMap = {};
  localSeats
    .slice()
    .sort(
      (a, b) =>
        a.row_label.localeCompare(b.row_label) || a.col_index - b.col_index,
    )
    .forEach((seat) => {
      const key = seat.row_label || "__AISLE__";
      if (!rowMap[key]) rowMap[key] = [];
      rowMap[key].push(seat);
    });

  // Unique sections (for summary cards)
  const sectionSummary = {};
  localSeats
    .filter((s) => !s.is_space)
    .forEach((s) => {
      const k = s.section_label || "General";
      if (!sectionSummary[k])
        sectionSummary[k] = { label: k, color: s.fill, avail: 0, total: 0 };
      sectionSummary[k].total++;
      if (s.status === "available") sectionSummary[k].avail++;
    });

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          background: "#0d0d14",
        }}
      >
        <CircularProgress sx={{ color: "#2563EB" }} />
        <span style={{ color: "#64748B", marginLeft: 12, fontSize: 14 }}>
          Loading hall layout…
        </span>
      </div>
    );
  }

  if (!hall && !loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          background: "#0d0d14",
          color: "#475569",
          gap: 12,
        }}
      >
        <div style={{ fontSize: 48 }}>🎭</div>
        <div style={{ fontSize: 14 }}>
          No hall selected. Select a hall to view the seat map.
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 300px",
        height: "100%",
      }}
    >
      {/* ── Hall map ───────────────────────────────────────── */}
      <div
        style={{
          background: "#0d0d14",
          overflowY: "auto",
          padding: "24px 20px",
        }}
      >
        {/* Zoom controls */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 6,
            marginBottom: 16,
          }}
        >
          {[0.75, 1, 1.25, 1.5].map((z) => (
            <button
              key={z}
              onClick={() => setZoom(z)}
              style={{
                padding: "4px 10px",
                background: zoom === z ? "#2563EB" : "#1e1e2a",
                color: zoom === z ? "#fff" : "#888",
                border: "none",
                borderRadius: 6,
                fontSize: 12,
                cursor: "pointer",
                fontWeight: zoom === z ? 700 : 400,
              }}
            >
              {Math.round(z * 100)}%
            </button>
          ))}
        </div>

        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "top center",
            transition: "transform 0.2s",
          }}
        >
          {/* Screen */}
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div
              style={{
                width: 340,
                height: 6,
                background:
                  "linear-gradient(90deg,transparent,#fff8,transparent)",
                borderRadius: 50,
                margin: "0 auto 8px",
              }}
            />
            <div
              style={{
                fontSize: 11,
                color: "#555",
                letterSpacing: 4,
                fontWeight: 600,
              }}
            >
              SCREEN / STAGE
            </div>
          </div>

          {/* Rows */}
          {Object.entries(rowMap).map(([rowLabel, seats]) => (
            <div
              key={rowLabel}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
                marginBottom: 7,
              }}
            >
              {/* Row label */}
              <span
                style={{
                  fontSize: 10,
                  color: "#444",
                  width: 18,
                  textAlign: "right",
                  fontFamily: "monospace",
                  fontWeight: 600,
                }}
              >
                {rowLabel !== "__AISLE__" ? rowLabel : ""}
              </span>

              <div style={{ display: "flex", gap: 4 }}>
                {seats.map((seat) => (
                  <div
                    key={seat.id}
                    onMouseEnter={(e) =>
                      !seat.is_space &&
                      setTooltip({ seat, x: e.clientX, y: e.clientY })
                    }
                    onMouseLeave={() => setTooltip(null)}
                    onClick={() =>
                      !seat.is_space &&
                      seat.status !== "sold" &&
                      toggleSeat(seat.id)
                    }
                    title={
                      seat.is_space
                        ? ""
                        : `${seat.section_label || ""} · ${seat.seat_name} · ₹${seat.price}`
                    }
                    style={{
                      width: seat.is_space ? 14 : 26,
                      height: 26,
                      borderRadius: seat.status === "selected" ? "50%" : "6px",
                      background: seatBg(seat),
                      border: `1.5px solid ${seatBorder(seat)}`,
                      cursor: seat.is_space
                        ? "default"
                        : seat.status === "sold"
                          ? "not-allowed"
                          : "pointer",
                      transition: "all 0.15s",
                      transform:
                        seat.status === "selected" ? "scale(1.12)" : "scale(1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 8,
                      color:
                        seat.status === "selected" ? "#000" : "transparent",
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {seat.status === "selected" ? "✓" : ""}
                  </div>
                ))}
              </div>

              <span
                style={{
                  fontSize: 10,
                  color: "#444",
                  width: 18,
                  fontFamily: "monospace",
                  fontWeight: 600,
                }}
              >
                {rowLabel !== "__AISLE__" ? rowLabel : ""}
              </span>
            </div>
          ))}

          {/* Legend */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 20,
              marginTop: 28,
              paddingTop: 20,
              borderTop: "1px solid #1e1e2a",
            }}
          >
            {[
              { label: "Available", bg: "#1e1e2a", border: "#444" },
              { label: "Selected", bg: "#2563EB", border: "#2563EB" },
              { label: "Sold", bg: "#1e1215", border: "#4a1a2244" },
            ].map((l) => (
              <div
                key={l.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  fontSize: 12,
                  color: "#888",
                }}
              >
                <div
                  style={{
                    width: 14,
                    height: 14,
                    background: l.bg,
                    border: `1.5px solid ${l.border}`,
                    borderRadius: 4,
                  }}
                />
                {l.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Booking panel ──────────────────────────────────── */}
      <div
        style={{
          background: "#13131c",
          borderLeft: "1px solid #1e1e2a",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Hall info */}
        <div
          style={{ padding: "20px 18px", borderBottom: "1px solid #1e1e2a" }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              marginBottom: 2,
              color: "#F8FAFC",
            }}
          >
            {hall?.name || "Hall"}
          </div>
          <div style={{ fontSize: 12, color: "#64748B", marginBottom: 12 }}>
            {hall?.city} · {hall?.hall_type?.replace("_", " ")}
          </div>

          {/* Section summary cards */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {Object.values(sectionSummary).map((sec) => (
              <div
                key={sec.label}
                style={{
                  flex: "1 1 60px",
                  minWidth: 60,
                  background: sec.color + "15",
                  borderRadius: 8,
                  padding: "7px 6px",
                  textAlign: "center",
                  border: `1px solid ${sec.color}30`,
                }}
              >
                <div
                  style={{ fontSize: 15, fontWeight: 700, color: sec.color }}
                >
                  {sec.avail}
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: "#64748B",
                    marginTop: 1,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {sec.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected seat list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px" }}>
          <div
            style={{
              fontSize: 11,
              color: "#64748B",
              fontWeight: 600,
              marginBottom: 10,
              letterSpacing: 1,
            }}
          >
            SELECTED SEATS
          </div>
          {selectedLocal.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "32px 0",
                color: "#374151",
                fontSize: 13,
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>🎭</div>
              Click seats to select
            </div>
          ) : (
            selectedLocal.map((seat) => (
              <div
                key={seat.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#0F172A",
                  borderRadius: 8,
                  padding: "10px 12px",
                  marginBottom: 6,
                  border: `1px solid ${seat.fill || "#2563EB"}33`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: seat.fill || "#2563EB",
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#F8FAFC",
                      }}
                    >
                      {seat.seat_name}
                    </div>
                    <div style={{ fontSize: 10, color: "#64748B" }}>
                      {seat.section_label}
                    </div>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 13,
                    color: seat.fill || "#2563EB",
                    fontWeight: 700,
                  }}
                >
                  ₹{Number(seat.price).toLocaleString("en-IN")}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Summary + Pay */}
        <div style={{ padding: "16px 18px", borderTop: "1px solid #1e1e2a" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 13,
              marginBottom: 4,
            }}
          >
            <span style={{ color: "#64748B" }}>
              Subtotal ({selectedLocal.length} seats)
            </span>
            <span style={{ fontWeight: 600, color: "#F8FAFC" }}>
              ₹{localTotal.toLocaleString("en-IN")}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 12,
              marginBottom: 14,
            }}
          >
            <span style={{ color: "#475569" }}>Convenience fee (5%)</span>
            <span style={{ color: "#475569" }}>
              ₹{Math.round(localTotal * 0.05).toLocaleString("en-IN")}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 16,
              fontWeight: 700,
              marginBottom: 16,
              paddingTop: 10,
              borderTop: "1px solid #1e1e2a",
            }}
          >
            <span style={{ color: "#F8FAFC" }}>Total</span>
            <span style={{ color: "#2563EB" }}>
              ₹
              {(localTotal + Math.round(localTotal * 0.05)).toLocaleString(
                "en-IN",
              )}
            </span>
          </div>
          <button
            disabled={selectedLocal.length === 0}
            style={{
              width: "100%",
              background:
                selectedLocal.length > 0
                  ? "linear-gradient(135deg,#2563EB,#1D4ED8)"
                  : "#1e1e2a",
              color: selectedLocal.length > 0 ? "#fff" : "#444",
              border: "none",
              borderRadius: 10,
              padding: "13px",
              fontWeight: 700,
              fontSize: 14,
              cursor: selectedLocal.length > 0 ? "pointer" : "not-allowed",
              transition: "all 0.2s",
              boxShadow:
                selectedLocal.length > 0
                  ? "0 4px 16px rgba(37,99,235,0.4)"
                  : "none",
            }}
          >
            {selectedLocal.length > 0 ? `Proceed to Pay  →` : "Select Seats"}
          </button>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && !tooltip.seat.is_space && (
        <div
          style={{
            position: "fixed",
            left: tooltip.x + 12,
            top: tooltip.y - 70,
            background: "#0F172A",
            border: "1px solid #334155",
            borderRadius: 10,
            padding: "10px 14px",
            fontSize: 12,
            pointerEvents: "none",
            zIndex: 9999,
            boxShadow: "0 8px 24px #000a",
          }}
        >
          <div style={{ fontWeight: 600, color: "#F8FAFC", marginBottom: 3 }}>
            {tooltip.seat.section_label} · {tooltip.seat.seat_name}
          </div>
          <div
            style={{
              color: tooltip.seat.status === "sold" ? "#ef4444" : "#2563EB",
              fontWeight: 700,
            }}
          >
            {tooltip.seat.status === "sold"
              ? "Already Sold"
              : `₹${Number(tooltip.seat.price).toLocaleString("en-IN")}`}
          </div>
          <div
            style={{
              color: "#475569",
              fontSize: 11,
              marginTop: 2,
              textTransform: "capitalize",
            }}
          >
            {tooltip.seat.seat_type}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DRAW MODE — free canvas, saves to API
// ─────────────────────────────────────────────────────────────
function DrawMode() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const saving = useSelector(selectHallActionLoading);

  const svgRef = useRef(null);

  const [tool, setTool] = useState("row");
  const [activeSec, setActiveSec] = useState("premium");
  const [seatShape, setSeatShape] = useState("rounded");
  const [drawing, setDrawing] = useState(false);
  const [startPos, setStartPos] = useState(null);
  const [liveEnd, setLiveEnd] = useState(null);
  const [hoverPos, setHoverPos] = useState(null);
  const [placedRows, setPlacedRows] = useState([]);
  const [placedSeats, setPlacedSeats] = useState([]);
  const [saveOpen, setSaveOpen] = useState(false);

  const getSec = () => DRAW_SECTIONS.find((s) => s.id === activeSec);
  const getShape = () => SEAT_SHAPES.find((s) => s.id === seatShape);

  const svgPoint = (e) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    const pos = svgPoint(e);
    setDrawing(true);
    setStartPos(pos);
    setLiveEnd(pos);
  };

  const handleMouseMove = (e) => {
    const pos = svgPoint(e);
    setHoverPos(pos);
    if (drawing) setLiveEnd(pos);
  };

  const handleMouseUp = (e) => {
    if (!drawing || !startPos) return;
    const pos = svgPoint(e);
    const sec = getSec();

    if (tool === "row") {
      const pts = seatsAlongLine(startPos.x, startPos.y, pos.x, pos.y);
      if (pts.length > 0) {
        const angle = Math.round(
          (Math.atan2(pos.y - startPos.y, pos.x - startPos.x) * 180) / Math.PI,
        );
        setPlacedRows((prev) => [
          ...prev,
          {
            id: `r${Date.now()}`,
            pts,
            color: sec.color,
            sectionId: activeSec,
            shape: seatShape,
            startX: startPos.x,
            startY: startPos.y,
            endX: pos.x,
            endY: pos.y,
            angle,
          },
        ]);
      }
    } else if (tool === "seat") {
      setPlacedSeats((prev) => [
        ...prev,
        {
          id: `s${Date.now()}`,
          x: pos.x,
          y: pos.y,
          color: sec.color,
          sectionId: activeSec,
          shape: seatShape,
        },
      ]);
    } else if (tool === "erase") {
      const R = 20;
      setPlacedRows((prev) =>
        prev.filter(
          (row) =>
            !row.pts.some((p) => Math.hypot(p.x - pos.x, p.y - pos.y) < R),
        ),
      );
      setPlacedSeats((prev) =>
        prev.filter((s) => Math.hypot(s.x - pos.x, s.y - pos.y) >= R),
      );
    }

    setDrawing(false);
    setStartPos(null);
    setLiveEnd(null);
  };

  // ── Save to API ────────────────────────────────────────────
  const handleSave = async (hallMeta) => {
    const svgEl = svgRef.current;
    const canvasWidth = svgEl?.clientWidth || 800;
    const canvasHeight = svgEl?.clientHeight || 600;

    const layout = serialiseDrawLayout({
      placedRows,
      placedSeats,
      sections: DRAW_SECTIONS,
      canvasWidth,
      canvasHeight,
    });

    if (!layout.seats.length) {
      enqueueSnackbar("Draw at least one row of seats first", {
        variant: "warning",
      });
      return;
    }

    const result = await dispatch(createHallThunk({ ...hallMeta, ...layout }));

    if (createHallThunk.fulfilled.match(result)) {
      const count = layout.seats.filter((s) => !s.is_space).length;
      enqueueSnackbar(`✅ Hall "${hallMeta.name}" saved with ${count} seats!`, {
        variant: "success",
      });
      setSaveOpen(false);
      setPlacedRows([]);
      setPlacedSeats([]);
    } else {
      enqueueSnackbar(result.payload || "Failed to save hall", {
        variant: "error",
      });
    }
  };

  // Derived
  const previewPts =
    drawing && startPos && liveEnd && tool === "row"
      ? seatsAlongLine(startPos.x, startPos.y, liveEnd.x, liveEnd.y)
      : [];

  const angleNow =
    drawing && startPos && liveEnd
      ? Math.round(
          (Math.atan2(liveEnd.y - startPos.y, liveEnd.x - startPos.x) * 180) /
            Math.PI,
        )
      : null;

  const shapeR = getShape().r;
  const secColor = getSec().color;
  const totalSeats =
    placedRows.reduce((a, r) => a + r.pts.length, 0) + placedSeats.length;

  const sectionCounts = DRAW_SECTIONS.map((s) => ({
    ...s,
    count:
      placedRows
        .filter((r) => r.sectionId === s.id)
        .reduce((a, r) => a + r.pts.length, 0) +
      placedSeats.filter((p) => p.sectionId === s.id).length,
  }));

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "220px 1fr 200px",
          height: "100%",
        }}
      >
        {/* ── LEFT TOOLBAR ───────────────────────────────────── */}
        <div
          style={{
            background: "#13131c",
            borderRight: "1px solid #1e1e2a",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          {/* Section picker — most prominent */}
          <div
            style={{
              padding: "14px 14px 12px",
              borderBottom: "1px solid #1e1e2a",
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: "#555",
                letterSpacing: 1,
                marginBottom: 10,
                fontWeight: 600,
              }}
            >
              DRAWING SECTION
            </div>
            {DRAW_SECTIONS.map((s) => {
              const active = activeSec === s.id;
              const cnt = sectionCounts.find((x) => x.id === s.id)?.count || 0;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSec(s.id)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    marginBottom: 6,
                    background: active ? s.color + "18" : "#0d0d14",
                    border: `1.5px solid ${active ? s.color : "#1e1e2a"}`,
                    borderRadius: 10,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: s.color,
                      boxShadow: active ? `0 0 8px ${s.color}99` : "none",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: active ? 700 : 400,
                        color: active ? s.color : "#888",
                      }}
                    >
                      {s.label}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: active ? s.color + "bb" : "#444",
                      }}
                    >
                      ₹{s.price} · {cnt} seats
                    </div>
                  </div>
                  {active && (
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: s.color,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tools */}
          <div
            style={{ padding: "12px 14px", borderBottom: "1px solid #1e1e2a" }}
          >
            <div
              style={{
                fontSize: 10,
                color: "#555",
                letterSpacing: 1,
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              TOOLS
            </div>
            {DRAW_TOOLS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTool(t.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 12px",
                  marginBottom: 4,
                  background: tool === t.id ? "#1e1e2e" : "transparent",
                  border: `1px solid ${tool === t.id ? "#2563EB" : "transparent"}`,
                  borderRadius: 8,
                  color: tool === t.id ? "#fff" : "#666",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: tool === t.id ? 600 : 400,
                  transition: "all 0.15s",
                }}
              >
                <span style={{ fontSize: 15 }}>{t.icon}</span> {t.label}
              </button>
            ))}
          </div>

          {/* Seat shape */}
          <div style={{ padding: "12px 14px" }}>
            <div
              style={{
                fontSize: 10,
                color: "#555",
                letterSpacing: 1,
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              SEAT SHAPE
            </div>
            {SEAT_SHAPES.map((s) => (
              <button
                key={s.id}
                onClick={() => setSeatShape(s.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 10px",
                  marginBottom: 4,
                  background: seatShape === s.id ? "#1e1e2e" : "transparent",
                  border: `1px solid ${seatShape === s.id ? "#2563EB" : "transparent"}`,
                  borderRadius: 8,
                  color: seatShape === s.id ? "#fff" : "#666",
                  cursor: "pointer",
                  fontSize: 12,
                  transition: "all 0.15s",
                }}
              >
                <div
                  style={{
                    width: 14,
                    height: 14,
                    background: seatShape === s.id ? "#2563EB" : "#333",
                    borderRadius: s.r >= 10 ? "50%" : s.r + "px",
                    flexShrink: 0,
                  }}
                />
                {s.label}
              </button>
            ))}
          </div>

          <div style={{ padding: "0 14px 14px", marginTop: "auto" }}>
            <button
              onClick={() => {
                setPlacedRows([]);
                setPlacedSeats([]);
              }}
              style={{
                width: "100%",
                padding: "8px",
                background: "transparent",
                border: "1px solid #ef444433",
                borderRadius: 8,
                color: "#ef4444",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              Clear All
            </button>
          </div>
        </div>

        {/* ── SVG CANVAS ─────────────────────────────────────── */}
        <div
          style={{
            background: "#0d0d14",
            overflow: "hidden",
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Hint bar */}
          <div
            style={{
              padding: "8px 16px",
              borderBottom: "1px solid #1a1a24",
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexShrink: 0,
              minHeight: 38,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: secColor + "15",
                border: `1px solid ${secColor}33`,
                padding: "3px 10px",
                borderRadius: 20,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: secColor,
                }}
              />
              <span style={{ fontSize: 11, color: secColor, fontWeight: 600 }}>
                {getSec().label}
              </span>
            </div>
            <span style={{ fontSize: 12, color: "#555" }}>
              {tool === "row" && "Drag to draw a row of seats at any angle"}
              {tool === "seat" && "Click to place a single seat"}
              {tool === "erase" && "Click to erase seats / rows"}
            </span>
            {angleNow !== null && (
              <span
                style={{
                  marginLeft: "auto",
                  fontSize: 12,
                  color: secColor,
                  fontWeight: 600,
                  background: secColor + "15",
                  padding: "2px 10px",
                  borderRadius: 12,
                }}
              >
                {previewPts.length} seats · {angleNow}°
              </span>
            )}
          </div>

          <svg
            ref={svgRef}
            style={{
              flex: 1,
              width: "100%",
              display: "block",
              cursor: "crosshair",
              userSelect: "none",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => {
              setHoverPos(null);
              if (drawing) {
                setDrawing(false);
                setStartPos(null);
                setLiveEnd(null);
              }
            }}
          >
            <defs>
              <pattern
                id="dotgrid"
                width="27"
                height="27"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="1" cy="1" r="1" fill="#1e1e2a" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dotgrid)" />

            {/* Stage */}
            <rect
              x="50%"
              y="18"
              width="180"
              height="28"
              rx="6"
              fill="#1a1a24"
              stroke="#2a2a35"
              strokeWidth="1"
              transform="translate(-90,0)"
            />
            <text
              x="50%"
              y="36"
              textAnchor="middle"
              fill="#444"
              fontSize="11"
              letterSpacing="3"
              fontFamily="DM Sans,sans-serif"
              fontWeight="500"
            >
              STAGE
            </text>

            {/* Placed rows */}
            {placedRows.map((row) => {
              const r2 = SEAT_SHAPES.find((s) => s.id === row.shape)?.r ?? 4;
              return row.pts.map((pt, i) => (
                <rect
                  key={`${row.id}-${i}`}
                  x={pt.x - S / 2}
                  y={pt.y - S / 2}
                  width={S}
                  height={S}
                  rx={r2}
                  ry={r2}
                  fill={row.color + "30"}
                  stroke={row.color + "99"}
                  strokeWidth={1.5}
                />
              ));
            })}

            {/* Individual seats */}
            {placedSeats.map((seat) => {
              const r2 = SEAT_SHAPES.find((s) => s.id === seat.shape)?.r ?? 4;
              return (
                <rect
                  key={seat.id}
                  x={seat.x - S / 2}
                  y={seat.y - S / 2}
                  width={S}
                  height={S}
                  rx={r2}
                  ry={r2}
                  fill={seat.color + "30"}
                  stroke={seat.color + "99"}
                  strokeWidth={1.5}
                />
              );
            })}

            {/* Guide line */}
            {drawing && startPos && liveEnd && tool === "row" && (
              <line
                x1={startPos.x}
                y1={startPos.y}
                x2={liveEnd.x}
                y2={liveEnd.y}
                stroke={secColor + "50"}
                strokeWidth={1}
                strokeDasharray="4 3"
              />
            )}

            {/* Preview */}
            {previewPts.map((pt, i) => (
              <rect
                key={`prev-${i}`}
                x={pt.x - S / 2}
                y={pt.y - S / 2}
                width={S}
                height={S}
                rx={shapeR}
                ry={shapeR}
                fill={secColor + "30"}
                stroke={secColor}
                strokeWidth={1.5}
                strokeDasharray="3 2"
                opacity={0.8}
              />
            ))}

            {drawing && startPos && (
              <circle
                cx={startPos.x}
                cy={startPos.y}
                r={5}
                fill={secColor}
                opacity={0.9}
              />
            )}

            {!drawing && hoverPos && tool === "seat" && (
              <rect
                x={hoverPos.x - S / 2}
                y={hoverPos.y - S / 2}
                width={S}
                height={S}
                rx={shapeR}
                ry={shapeR}
                fill={secColor + "30"}
                stroke={secColor}
                strokeWidth={1.5}
                strokeDasharray="3 2"
                opacity={0.6}
                style={{ pointerEvents: "none" }}
              />
            )}

            {tool === "erase" && hoverPos && (
              <circle
                cx={hoverPos.x}
                cy={hoverPos.y}
                r={20}
                fill="none"
                stroke="#ef444877"
                strokeWidth={1.5}
                strokeDasharray="4 3"
                style={{ pointerEvents: "none" }}
              />
            )}
          </svg>
        </div>

        {/* ── RIGHT SUMMARY ──────────────────────────────────── */}
        <div
          style={{
            background: "#13131c",
            borderLeft: "1px solid #1e1e2a",
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 14,
            overflowY: "auto",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                color: "#555",
                letterSpacing: 1,
                marginBottom: 10,
                fontWeight: 600,
              }}
            >
              LAYOUT SUMMARY
            </div>
            <div
              style={{ background: "#0d0d14", borderRadius: 10, padding: 14 }}
            >
              {[
                { label: "Total seats", value: totalSeats, color: "#2563EB" },
                {
                  label: "Rows drawn",
                  value: placedRows.length,
                  color: "#F8FAFC",
                },
                {
                  label: "Individual",
                  value: placedSeats.length,
                  color: "#F8FAFC",
                },
              ].map((row) => (
                <div
                  key={row.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                    marginBottom: 8,
                  }}
                >
                  <span style={{ color: "#64748B" }}>{row.label}</span>
                  <span style={{ fontWeight: 700, color: row.color }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: 10,
                color: "#555",
                letterSpacing: 1,
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              SECTIONS
            </div>
            {sectionCounts.map((s) => (
              <div
                key={s.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 8,
                  opacity: s.count === 0 ? 0.3 : 1,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                      background: s.color,
                    }}
                  />
                  <span style={{ fontSize: 12, color: "#64748B" }}>
                    {s.label}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: s.count > 0 ? s.color : "#334155",
                  }}
                >
                  {s.count}
                </span>
              </div>
            ))}
          </div>

          {/* Angle compass */}
          <div style={{ background: "#0d0d14", borderRadius: 10, padding: 12 }}>
            <div
              style={{
                fontSize: 10,
                color: "#555",
                letterSpacing: 1,
                marginBottom: 6,
                fontWeight: 600,
              }}
            >
              ANGLE
            </div>
            <svg width="100%" viewBox="0 0 160 90">
              {[0, 45, 90, 135, -45, -90, -135, 180].map((deg) => {
                const rad = (deg * Math.PI) / 180;
                const cx = 80,
                  cy = 45,
                  len = 28;
                const isActive =
                  angleNow !== null && Math.abs(angleNow - deg) < 25;
                return (
                  <g key={deg}>
                    <line
                      x1={cx}
                      y1={cy}
                      x2={cx + Math.cos(rad) * len}
                      y2={cy + Math.sin(rad) * len}
                      stroke={isActive ? secColor : "#2a2a35"}
                      strokeWidth={isActive ? 2 : 1}
                    />
                    <text
                      x={cx + Math.cos(rad) * (len + 11)}
                      y={cy + Math.sin(rad) * (len + 11) + 3}
                      fill={isActive ? secColor : "#444"}
                      fontSize="8"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      {deg}°
                    </text>
                  </g>
                );
              })}
              <circle cx="80" cy="45" r="3" fill={secColor} />
              {angleNow !== null && (
                <line
                  x1="80"
                  y1="45"
                  x2={80 + Math.cos((angleNow * Math.PI) / 180) * 26}
                  y2={45 + Math.sin((angleNow * Math.PI) / 180) * 26}
                  stroke={secColor}
                  strokeWidth={2}
                  opacity={0.9}
                />
              )}
            </svg>
            <div
              style={{ fontSize: 10, color: "#475569", textAlign: "center" }}
            >
              {angleNow !== null ? `${angleNow}°` : "drag to set angle"}
            </div>
          </div>

          <div style={{ marginTop: "auto" }}>
            <button
              disabled={totalSeats === 0 || saving}
              onClick={() => setSaveOpen(true)}
              style={{
                width: "100%",
                background:
                  totalSeats > 0
                    ? "linear-gradient(135deg,#2563EB,#1D4ED8)"
                    : "#1e1e2a",
                color: totalSeats > 0 ? "#fff" : "#444",
                border: "none",
                borderRadius: 10,
                padding: "12px",
                fontWeight: 700,
                fontSize: 13,
                cursor: totalSeats > 0 ? "pointer" : "not-allowed",
                transition: "all 0.2s",
                boxShadow:
                  totalSeats > 0 ? "0 4px 16px rgba(37,99,235,0.35)" : "none",
              }}
            >
              {saving ? "Saving…" : `Save Hall → (${totalSeats} seats)`}
            </button>
          </div>
        </div>
      </div>

      <SaveHallDialog
        open={saveOpen}
        onClose={() => setSaveOpen(false)}
        onSave={handleSave}
        saving={saving}
      />
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────────────────────
export default function TheaterSeatApp({ hallId }) {
  const [mode, setMode] = useState(0);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#0d0d14",
        fontFamily: "'DM Sans', sans-serif",
        color: "#fff",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Top nav */}
      <div
        style={{
          background: "#0F172A",
          borderBottom: "1px solid #1e1e2a",
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          height: 52,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginRight: 28,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: "linear-gradient(135deg,#2563EB,#1D4ED8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              boxShadow: "0 0 12px rgba(37,99,235,0.4)",
            }}
          >
            🎭
          </div>
          <span style={{ fontWeight: 700, fontSize: 15, color: "#F8FAFC" }}>
            HallDesk
          </span>
        </div>

        {MODES.map((m, i) => (
          <button
            key={i}
            onClick={() => setMode(i)}
            style={{
              padding: "0 18px",
              height: "100%",
              background: "transparent",
              border: "none",
              borderBottom: `2px solid ${mode === i ? "#2563EB" : "transparent"}`,
              color: mode === i ? "#F8FAFC" : "#64748B",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: mode === i ? 600 : 400,
              transition: "all 0.2s",
            }}
          >
            {m}
          </button>
        ))}

        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          {mode === 0 && (
            <div
              style={{
                fontSize: 12,
                background: "#1e1e2a",
                padding: "4px 12px",
                borderRadius: 20,
                color: "#64748B",
              }}
            >
              Hall ID: {hallId || "—"}
            </div>
          )}
          <div
            style={{
              fontSize: 12,
              background: "#2563EB22",
              border: "1px solid #2563EB44",
              padding: "4px 12px",
              borderRadius: 20,
              color: "#2563EB",
              fontWeight: 600,
            }}
          >
            {mode === 0 ? "Live Booking" : "Admin Mode"}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: "hidden" }}>
        {mode === 0 ? <BookingView hallId={hallId} /> : <DrawMode />}
      </div>
    </div>
  );
}
