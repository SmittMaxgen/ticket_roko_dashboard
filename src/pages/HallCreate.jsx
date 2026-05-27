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
  fetchBookingLayoutThunk,
  createHallThunk,
  serialiseDrawLayout,
  updateHallThunk,
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
} from "../features/hallSeat/seatSelectors";

import {
  fetchSectionsThunk,
  fetchDrawToolsThunk,
  fetchSeatShapesThunk,
  createSectionThunk,
  deleteSectionThunk,
  updateSeatLabelThunk,
} from "../features/options/optionsThunks";
import {
  selectSections,
  selectDrawTools,
  selectSeatShapes,
} from "../features/options/optionsSelectors";

// import { useParams } from "react-router-dom";
import { useParams } from "react-router-dom";
import BookingManager from "./BookingManager";
import Partyplote from "../components/Partyplote";
import { clearCurrentHall } from "../features/halls/hallSlice";
import PartyPlotPanel from "../components/Partyplote";
import { io as socketIO } from "socket.io-client";
import { API_BASE_URL } from "../api/axios";
// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────
const MODES = ["Book Seats", "Admin: Draw Mode", "Bookings", "Party Plot"];

// const DRAW_SECTIONS = [
//   {
//     id: "premium",
//     label: "Premium",
//     color: "#f59e0b",
//     price: 800,
//     seat_type: "vip",
//   },
//   {
//     id: "executive",
//     label: "Executive",
//     color: "#818cf8",
//     price: 500,
//     seat_type: "standard",
//   },
//   {
//     id: "general",
//     label: "General",
//     color: "#34d399",
//     price: 250,
//     seat_type: "standard",
//   },
//   { id: "vip", label: "VIP", color: "#f472b6", price: 1200, seat_type: "vip" },
//   {
//     id: "standard",
//     label: "Standard",
//     color: "#001170",
//     price: 250,
//     seat_type: "standard",
//   },
// ];

// const DRAW_TOOLS = [
//   { id: "row", icon: "▬", label: "Add Row" },
//   { id: "seat", icon: "◻", label: "Add Seat" },
//   { id: "erase", icon: "⌫", label: "Erase" },
// ];

// const SEAT_SHAPES = [
//   { id: "rounded", r: 4, label: "Rounded" },
//   { id: "square", r: 1, label: "Square" },
//   { id: "circle", r: 11, label: "Circle" },
// ];
// REPLACE the deleted static constants with these:

const HALL_TYPES = ["end_stage", "arena", "proscenium", "traverse", "custom"];

// Seat size + gap on draw canvas
const S = 22;
const GAP = 5;

// ─────────────────────────────────────────────────────────────
// GEOMETRY
// ─────────────────────────────────────────────────────────────
// function seatsAlongLine(x1, y1, x2, y2) {
//   const dx = x2 - x1,
//     dy = y2 - y1;
//   const dist = Math.sqrt(dx * dx + dy * dy);
//   const count = Math.max(1, Math.round(dist / (S + GAP)) + 1);
//   const ux = dist === 0 ? 1 : dx / dist;
//   const uy = dist === 0 ? 0 : dy / dist;
//   return Array.from({ length: count }, (_, i) => ({
//     x: x1 + ux * i * (S + GAP),
//     y: y1 + uy * i * (S + GAP),
//   }));
// }

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
// function SaveHallDialog({ open, onClose, onSave, saving }) {
//   const [form, setForm] = useState({
//     name: "",
//     description: "",
//     hall_type: "end_stage",
//     city: "",
//     address: "",
//   });
function SaveHallDialog({ open, onClose, onSave, saving, initialData = null }) {
  const [form, setForm] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    hall_type: initialData?.hall_type || "end_stage",
    city: initialData?.city || "",
    address: initialData?.address || "",
  });

  useEffect(() => {
    if (open && initialData) {
      setForm({
        name: initialData.name || "",
        description: initialData.description || "",
        hall_type: initialData.hall_type || "end_stage",
        city: initialData.city || "",
        address: initialData.address || "",
      });
    }
  }, [open, initialData]);
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
        sx: {
          background: "#0f172a",
          border: "1px solid #334155",
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle sx={{ color: "#F8FAFC", fontWeight: 700, fontSize: 16 }}>
        Save Hall Layout
      </DialogTitle>
      <DialogContent sx={{ pt: 1, pb: 2, background: "#0c1220" }}>
        <Grid container spacing={2}>
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
                "& .MuiOutlinedInput-root": {
                  color: "#F8FAFC",
                  background: "#0b1323",
                },
                "& .MuiInputLabel-root": { color: "#94A3B8" },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl size="small" fullWidth>
              <InputLabel sx={{ color: "#94A3B8" }}>Hall Type</InputLabel>
              <Select
                label="Hall Type"
                value={form.hall_type}
                onChange={(e) =>
                  setForm({ ...form, hall_type: e.target.value })
                }
                sx={{
                  "& fieldset": { borderColor: "#334155" },
                  color: "#F8FAFC",
                  background: "#0b1323",
                }}
              >
                {HALL_TYPES?.map((t) => (
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
                "& .MuiOutlinedInput-root": {
                  color: "#F8FAFC",
                  background: "#0b1323",
                },
                "& .MuiInputLabel-root": { color: "#94A3B8" },
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
                "& .MuiOutlinedInput-root": {
                  color: "#F8FAFC",
                  background: "#0b1323",
                },
                "& .MuiInputLabel-root": { color: "#94A3B8" },
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
                "& .MuiOutlinedInput-root": {
                  color: "#F8FAFC",
                  background: "#0b1323",
                },
                "& .MuiInputLabel-root": { color: "#94A3B8" },
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: "16px 24px", gap: 1, background: "#0b1323" }}>
        <Button onClick={onClose} sx={{ color: "#94A3B8" }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={saving}
          sx={{
            background: "linear-gradient(135deg,#2563EB,#1D4ED8)",
            "&:hover": { background: "#1D4ED8" },
            minWidth: 120,
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

function BookingView({ hallId }) {
  const { id } = useParams();
  const dispatch = useDispatch();

  const hall = useSelector(selectCurrentHall);
  const loading = useSelector(selectHallLoading);

  const wrapRef = useRef(null);

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);

  const [tooltip, setTooltip] = useState(null);
  const [localSeats, setLocalSeats] = useState([]);

  const GRID = 28;
  const SEAT = 22;

  const MIN_ZOOM = 0.45;
  const MAX_ZOOM = 3;

  // ─────────────────────────────────────────────
  // Load Hall
  // ─────────────────────────────────────────────
  useEffect(() => {
    dispatch(clearCurrentHall()); // clear old hall first
    dispatch(fetchHallByIdThunk({ id: hallId || id }));
  }, [dispatch, hallId, id]);
  useEffect(() => {
    if (Array.isArray(hall?.seats)) {
      setLocalSeats(hall?.seats?.map((s) => ({ ...s })));
    }
  }, [hall]);

  // ── Real-time: mark seats sold instantly when another user books ──
  useEffect(() => {
    const event_id = id; // event id from URL params
    if (!event_id) return;

    const socket = socketIO(
      // import.meta.env?.VITE_API_URL ||
      //   process.env?.REACT_APP_API_URL ||
      API_BASE_URL,
    );

    socket.emit("join:event", event_id);

    socket.on("seats:booked", ({ seat_ids }) => {
      setLocalSeats((prev) =>
        prev.map((seat) =>
          seat_ids.includes(seat.id)
            ? { ...seat, status: "sold" } // mark sold immediately
            : seat,
        ),
      );
    });

    return () => {
      socket.emit("leave:event", event_id);
      socket.disconnect();
    };
  }, [id]);

  // ─────────────────────────────────────────────
  // Toggle Seat
  // ─────────────────────────────────────────────
  const toggleSeat = (seatId) => {
    setLocalSeats((prev) =>
      prev?.map((seat) => {
        if (seat.id !== seatId) return seat;
        if (seat.is_space) return seat;
        if (seat.status === "sold") return seat;

        return {
          ...seat,
          status: seat.status === "selected" ? "available" : "selected",
        };
      }),
    );
  };

  const selectedSeats = localSeats.filter((s) => s.status === "selected");

  const subtotal = selectedSeats.reduce((a, b) => a + Number(b.price || 0), 0);
  const fee = Math.round(subtotal * 0.05);
  const total = subtotal + fee;

  // ─────────────────────────────────────────────
  // Seat Styles
  // ─────────────────────────────────────────────
  const seatBg = (seat) => {
    if (seat.is_space) return "transparent";
    if (seat.status === "sold") return "#2a1116";
    if (seat.status === "selected") return "#2563EB";
    return (seat.fill || "#64748B") + "22";
  };

  const seatBorder = (seat) => {
    if (seat.is_space) return "transparent";
    if (seat.status === "sold") return "#7f1d1d";
    if (seat.status === "selected") return "#60A5FA";
    return seat.fill || "#475569";
  };

  const seatGlow = (seat) => {
    if (seat.status === "selected") {
      return "drop-shadow(0 0 8px rgba(37,99,235,.8))";
    }
    return "none";
  };

  // ─────────────────────────────────────────────
  // Summary
  // ─────────────────────────────────────────────
  const sectionSummary = {};

  localSeats
    .filter((s) => !s.is_space)
    .forEach((s) => {
      const key = s.section_label || "General";

      if (!sectionSummary[key]) {
        sectionSummary[key] = {
          label: key,
          color: s.fill || "#2563EB",
          total: 0,
          avail: 0,
        };
      }

      sectionSummary[key].total++;

      if (s.status === "available") {
        sectionSummary[key].avail++;
      }
    });

  // ─────────────────────────────────────────────
  // Zoom Helpers
  // ─────────────────────────────────────────────
  const zoomIn = () =>
    setZoom((z) => Math.min(MAX_ZOOM, Number((z + 0.15).toFixed(2))));

  const zoomOut = () =>
    setZoom((z) => Math.max(MIN_ZOOM, Number((z - 0.15).toFixed(2))));

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // ─────────────────────────────────────────────
  // Wheel Zoom
  // ─────────────────────────────────────────────
  const handleWheel = (e) => {
    e.preventDefault();

    const dir = e.deltaY > 0 ? -0.12 : 0.12;

    setZoom((z) => {
      const next = z + dir;
      return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, next));
    });
  };

  // ─────────────────────────────────────────────
  // Drag Pan
  // ─────────────────────────────────────────────
  const startPan = (e) => {
    if (e.button !== 0) return;

    if (
      e.target.tagName === "rect" &&
      e.target.dataset &&
      e.target.dataset.seat === "1"
    ) {
      return;
    }

    setDragging(true);

    setDragStart({
      x: e.clientX - pan.x,
      y: e.clientY - pan.y,
    });
  };

  const movePan = (e) => {
    if (!dragging) return;

    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const stopPan = () => {
    setDragging(false);
  };

  // ─────────────────────────────────────────────
  // Loading
  // ─────────────────────────────────────────────
  if (loading) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#050816",
          color: "#64748B",
          fontSize: 14,
        }}
      >
        Loading hall...
      </div>
    );
  }

  if (!hall) return null;

  const canvasW = hall.canvas_width || 1000;
  const canvasH = hall.canvas_height || 700;

  const miniScale = 0.18;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 320px",
        height: "100%",
        background: "#050816",
      }}
    >
      {/* ───────────────── LEFT MAP ───────────────── */}
      <div
        style={{
          padding: 24,
          overflow: "hidden",
          background:
            "radial-gradient(circle at top,#0b1228 0%,#050816 55%,#04050f 100%)",
          position: "relative",
        }}
      >
        {/* Toolbar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 10,
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={zoomOut} style={toolBtn()}>
              −
            </button>

            <button onClick={zoomIn} style={toolBtn()}>
              +
            </button>

            <button onClick={resetView} style={toolBtn()}>
              Reset
            </button>
          </div>

          <div
            style={{
              color: "#94A3B8",
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              fontWeight: 700,
            }}
          >
            {Math.round(zoom * 100)}%
          </div>
        </div>

        {/* Stage */}
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <div
            style={{
              width: 420,
              height: 8,
              margin: "0 auto 10px",
              borderRadius: 50,
              background:
                "linear-gradient(90deg,transparent,#60A5FA,#fff,transparent)",
              boxShadow: "0 0 18px rgba(96,165,250,.45)",
            }}
          />

          <div
            style={{
              color: "#94A3B8",
              fontSize: 11,
              letterSpacing: 5,
              fontWeight: 700,
            }}
          >
            SCREEN / STAGE
          </div>
        </div>

        {/* Canvas Wrap */}
        <div
          ref={wrapRef}
          onWheel={handleWheel}
          onMouseDown={startPan}
          onMouseMove={movePan}
          onMouseUp={stopPan}
          onMouseLeave={stopPan}
          style={{
            width: "100%",
            height: "calc(100% - 80px)",
            overflow: "hidden",
            borderRadius: 16,
            cursor: dragging ? "grabbing" : "grab",
            position: "relative",
          }}
        >
          <div
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: "top left",
              width: canvasW,
              height: canvasH,
            }}
          >
            <svg
              width={canvasW}
              height={canvasH}
              style={{
                display: "block",
                borderRadius: 16,
                background: "#040612",
                border: "1px solid #111827",
                boxShadow: "0 20px 60px rgba(0,0,0,.45)",
              }}
            >
              <defs>
                <pattern
                  id="seatgrid"
                  width={GRID}
                  height={GRID}
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="1.4" cy="1.4" r="1" fill="#182038" />
                </pattern>
              </defs>

              <rect width="100%" height="100%" fill="url(#seatgrid)" />

              {localSeats?.map((seat) => {
                if (seat.is_space) return null;

                const x = Number(seat.x_pos) - SEAT / 2;
                const y = Number(seat.y_pos) - SEAT / 2;

                return (
                  <rect
                    key={seat.id}
                    data-seat="1"
                    x={x}
                    y={y}
                    width={SEAT}
                    height={SEAT}
                    rx={seat.status === "selected" ? 11 : 6}
                    ry={seat.status === "selected" ? 11 : 6}
                    fill={seatBg(seat)}
                    stroke={seatBorder(seat)}
                    strokeWidth={1.5}
                    style={{
                      cursor:
                        seat.status === "sold" ? "not-allowed" : "pointer",
                      transition: "all .15s ease",
                      filter: seatGlow(seat),
                    }}
                    onMouseEnter={(e) =>
                      setTooltip({
                        seat,
                        x: e.clientX,
                        y: e.clientY,
                      })
                    }
                    onMouseLeave={() => setTooltip(null)}
                    onClick={() => toggleSeat(seat.id)}
                  />
                );
              })}
            </svg>
          </div>
        </div>

        {/* Minimap */}
        <div
          style={{
            position: "absolute",
            right: 24,
            bottom: 24,
            width: 220,
            height: 160,
            background: "#0b1020",
            border: "1px solid #1e293b",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              transform: `scale(${miniScale})`,
              transformOrigin: "top left",
              width: canvasW,
              height: canvasH,
            }}
          >
            <svg width={canvasW} height={canvasH}>
              <rect width="100%" height="100%" fill="#040612" />

              {localSeats?.map((seat) => {
                if (seat.is_space) return null;

                return (
                  <rect
                    key={seat.id}
                    x={seat.x_pos - 10}
                    y={seat.y_pos - 10}
                    width={20}
                    height={20}
                    rx="4"
                    fill={seat.fill || "#64748B"}
                  />
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* ───────────────── RIGHT PANEL ───────────────── */}
      <div
        style={{
          background: "#0b1020",
          borderLeft: "1px solid #172036",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: 20,
            borderBottom: "1px solid #172036",
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: "#fff",
            }}
          >
            {hall.name}
          </div>

          <div
            style={{
              color: "#64748B",
              fontSize: 12,
              marginTop: 4,
            }}
          >
            {hall.city}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2,1fr)",
              gap: 8,
              marginTop: 16,
            }}
          >
            {Object.values(sectionSummary)?.map((sec) => (
              <div
                key={sec.label}
                style={{
                  background: sec.color + "14",
                  border: `1px solid ${sec.color}33`,
                  borderRadius: 10,
                  padding: 10,
                }}
              >
                <div
                  style={{
                    color: sec.color,
                    fontWeight: 800,
                    fontSize: 18,
                  }}
                >
                  {sec.avail}
                </div>

                <div
                  style={{
                    fontSize: 10,
                    color: "#94A3B8",
                    marginTop: 2,
                  }}
                >
                  {sec.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 20,
          }}
        >
          <div
            style={{
              color: "#64748B",
              fontSize: 11,
              letterSpacing: 1,
              marginBottom: 12,
              fontWeight: 700,
            }}
          >
            SELECTED SEATS
          </div>

          {selectedSeats?.length === 0 ? (
            <div
              style={{
                color: "#475569",
                textAlign: "center",
                paddingTop: 50,
                fontSize: 13,
              }}
            >
              Click seats to select
            </div>
          ) : (
            selectedSeats?.map((seat) => (
              <div
                key={seat.id}
                style={{
                  background: "#111827",
                  border: `1px solid ${seat.fill || "#2563EB"}33`,
                  borderRadius: 10,
                  padding: "12px 14px",
                  marginBottom: 8,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 13,
                    }}
                  >
                    {seat.seat_name}
                  </div>

                  <div
                    style={{
                      color: "#64748B",
                      fontSize: 11,
                      marginTop: 2,
                    }}
                  >
                    {seat.section_label}
                  </div>
                </div>

                <div
                  style={{
                    color: seat.fill || "#2563EB",
                    fontWeight: 800,
                    fontSize: 14,
                  }}
                >
                  ₹{seat.price}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: 20,
            borderTop: "1px solid #172036",
          }}
        >
          <RowLine
            label={`Subtotal (${selectedSeats.length})`}
            value={subtotal}
          />
          <RowLine label="Convenience Fee" value={fee} small />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 16,
              paddingTop: 12,
              borderTop: "1px solid #172036",
              color: "#fff",
              fontWeight: 800,
              fontSize: 16,
            }}
          >
            <span>Total</span>
            <span style={{ color: "#2563EB" }}>₹{total}</span>
          </div>

          <button
            disabled={!selectedSeats?.length}
            style={{
              width: "100%",
              padding: 14,
              border: "none",
              borderRadius: 12,
              fontWeight: 800,
              fontSize: 14,
              cursor: selectedSeats?.length ? "pointer" : "not-allowed",
              background: selectedSeats?.length
                ? "linear-gradient(135deg,#2563EB,#1D4ED8)"
                : "#1e293b",
              color: selectedSeats?.length ? "#fff" : "#64748B",
            }}
          >
            {selectedSeats?.length > 0 ? "Proceed To Pay →" : "Select Seats"}
          </button>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          style={{
            position: "fixed",
            left: tooltip.x + 14,
            top: tooltip.y - 72,
            background: "#0f172a",
            border: "1px solid #334155",
            borderRadius: 12,
            padding: "10px 14px",
            zIndex: 9999,
            pointerEvents: "none",
            boxShadow: "0 12px 28px rgba(0,0,0,.45)",
          }}
        >
          <div
            style={{
              color: "#fff",
              fontWeight: 800,
              fontSize: 13,
            }}
          >
            {tooltip.seat.seat_name}
          </div>

          <div
            style={{
              color: "#2563EB",
              marginTop: 4,
              fontWeight: 700,
              fontSize: 12,
            }}
          >
            ₹{tooltip.seat.price}
          </div>

          <div
            style={{
              color: "#64748B",
              fontSize: 11,
              marginTop: 2,
            }}
          >
            {tooltip.seat.section_label}
          </div>
        </div>
      )}
    </div>
  );

  function toolBtn() {
    return {
      padding: "8px 12px",
      borderRadius: 8,
      border: "1px solid #1e293b",
      background: "#0f172a",
      color: "#fff",
      fontWeight: 700,
      cursor: "pointer",
    };
  }

  function RowLine({ label, value, small }) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 6,
          color: small ? "#64748B" : "#94A3B8",
          fontSize: small ? 12 : 13,
        }}
      >
        <span>{label}</span>
        <span>₹{value}</span>
      </div>
    );
  }
}
const getSeatName = (rowIndex, seatIndex) => {
  const rowLetter = String.fromCharCode(65 + rowIndex); // A, B, C...
  return `${rowLetter}${seatIndex + 1}`; // A1, A2...
};

function DrawMode({ hallId, is_edit = false, is_add = false }) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const hall = useSelector(selectCurrentHall);
  const saving = useSelector(selectHallActionLoading);
  const loading = useSelector(selectHallLoading);

  // Safe defaults
  const DRAW_SECTIONS = useSelector(selectSections) || [];
  const DRAW_TOOLS = useSelector(selectDrawTools) || [];
  const SEAT_SHAPES = useSelector(selectSeatShapes) || [];

  const svgRef = useRef(null);
  const wrapRef = useRef(null);

  const GRID = 28;
  const SEAT_SIZE = 22;
  const MIN_ZOOM = 0.35;
  const MAX_ZOOM = 3;

  const [tool, setTool] = useState("row");
  const [activeSec, setActiveSec] = useState(DRAW_SECTIONS[0]?.id || "premium");
  const [seatShape, setSeatShape] = useState("rounded");

  const [drawing, setDrawing] = useState(false);
  const [dragSeatId, setDragSeatId] = useState(null);
  const [startPos, setStartPos] = useState(null);
  const [liveEnd, setLiveEnd] = useState(null);

  const [placedRows, setPlacedRows] = useState([]);
  const [placedSeats, setPlacedSeats] = useState([]);
  const [saveOpen, setSaveOpen] = useState(false);
  const [loadedEdit, setLoadedEdit] = useState(false);
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [panning, setPanning] = useState(false);
  const [panStart, setPanStart] = useState(null);

  const [sectionDialogOpen, setSectionDialogOpen] = useState(false);
  const [sectionForm, setSectionForm] = useState({
    id_key: "",
    label: "",
    color: "#818cf8",
    price: "",
    seat_type: "standard",
  });
  const [sectionError, setSectionError] = useState("");

  const resetSectionForm = () => {
    setSectionForm({
      id_key: "",
      label: "",
      color: "#818cf8",
      price: "",
      seat_type: "standard",
    });
    setSectionError("");
  };

  const snap = (n) => Math.round(n / GRID) * GRID;
  const svgPoint = useCallback(
    (e) => {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return { x: 0, y: 0 };

      const rawX = (e.clientX - rect.left - pan.x) / zoom;
      const rawY = (e.clientY - rect.top - pan.y) / zoom;

      return { x: snap(rawX), y: snap(rawY) };
    },
    [pan, zoom, snap],
  );
  const zoomBtn = {
    padding: "6px 12px",
    background: "#1e2937",
    color: "#e2e8f0",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: 600,
  };
  const getSec = () => {
    if (DRAW_SECTIONS.length === 0)
      return { color: "#818cf8", id: "", label: "Default" };
    return DRAW_SECTIONS.find((s) => s.id === activeSec) || DRAW_SECTIONS[0];
  };

  const shapeRadius = (shape) =>
    SEAT_SHAPES.find((s) => s.id === shape)?.r ?? 4;

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  const seatsAlongLine = (x1, y1, x2, y2) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const count = Math.max(1, Math.round(dist / GRID));

    const pts = [];
    for (let i = 0; i <= count; i++) {
      const t = i / count;
      pts.push({ x: snap(x1 + dx * t), y: snap(y1 + dy * t) });
    }

    const map = {};
    return pts.filter((p) => {
      const key = `${p.x}_${p.y}`;
      if (map[key]) return false;
      map[key] = true;
      return true;
    });
  };

  // Load data
  useEffect(() => {
    dispatch(fetchSectionsThunk());
    dispatch(fetchDrawToolsThunk());
    dispatch(fetchSeatShapesThunk());
  }, [dispatch]);

  useEffect(() => {
    if (DRAW_SECTIONS.length > 0) {
      setActiveSec((prev) =>
        DRAW_SECTIONS.some((s) => s.id === prev) ? prev : DRAW_SECTIONS[0].id,
      );
    }
  }, [DRAW_SECTIONS]);

  useEffect(() => {
    if (SEAT_SHAPES.length > 0) {
      setSeatShape((prev) =>
        SEAT_SHAPES.some((s) => s.id === prev) ? prev : SEAT_SHAPES[0].id,
      );
    }
  }, [SEAT_SHAPES]);

  useEffect(() => {
    dispatch(clearCurrentHall());
    if (is_edit && hallId) {
      dispatch(fetchHallByIdThunk({ id: hallId }));
    }
    if (is_add) {
      setPlacedRows([]);
      setPlacedSeats([]);
      setLoadedEdit(false);
    }
  }, [dispatch, hallId, is_edit, is_add]);

  // Load existing hall for edit
  // Load existing hall for edit
  // Load existing hall for edit
  useEffect(() => {
    if (!is_edit || !hall?.seats || loadedEdit) return;

    const apiSeats = hall.seats.filter((s) => !s.is_space);

    const mapped = apiSeats.map((seat) => ({
      id: String(seat.id),
      x: snap(Number(seat.x_pos)),
      y: snap(Number(seat.y_pos)),
      color: seat.fill || "#64748B",
      sectionId: seat.section_id || DRAW_SECTIONS[0]?.id,
      shape: "rounded",
      seat_name: seat.seat_name,
      row_label: seat.row_label,
      customLabel: seat.section_label,
    }));

    setPlacedSeats(mapped);
    setLoadedEdit(true);
    enqueueSnackbar(`Hall "${hall.name}" loaded for editing`, {
      variant: "info",
    });
  }, [hall, is_edit, loadedEdit, DRAW_SECTIONS, snap, enqueueSnackbar]);
  // 🔥 IMPORTANT: Reset state when hall changes (critical for switching halls)
  useEffect(() => {
    if (!is_edit) return;

    setPlacedRows([]);
    setPlacedSeats([]);
    setLoadedEdit(false);
    setSelectedSeatIds([]);
  }, [hallId, is_edit]); // Reset when hallId changes
  // ---------------------------------------------------
  // ERASE
  // ---------------------------------------------------
  const eraseAt = (pos) => {
    const R = 20;

    setPlacedRows((prev) =>
      prev.filter(
        (row) => !row.pts.some((p) => Math.hypot(p.x - pos.x, p.y - pos.y) < R),
      ),
    );

    setPlacedSeats((prev) =>
      prev.filter((s) => Math.hypot(s.x - pos.x, s.y - pos.y) >= R),
    );
  };

  // ---------------------------------------------------
  // ZOOM WITH WHEEL
  // ---------------------------------------------------
  const handleWheel = (e) => {
    e.preventDefault();

    const rect = svgRef.current.getBoundingClientRect();

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const direction = e.deltaY > 0 ? -0.1 : 0.1;

    const nextZoom = clamp(zoom + direction, MIN_ZOOM, MAX_ZOOM);

    const scale = nextZoom / zoom;

    const nextPanX = mouseX - (mouseX - pan.x) * scale;
    const nextPanY = mouseY - (mouseY - pan.y) * scale;

    setZoom(nextZoom);
    setPan({
      x: nextPanX,
      y: nextPanY,
    });
  };
  // ---------------------------------------------------
  // WHEEL (non-passive fix)
  // ---------------------------------------------------
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [zoom, pan]);

  // ---------------------------------------------------
  // PAN START
  // ---------------------------------------------------
  const startPan = (e) => {
    setPanning(true);

    setPanStart({
      x: e.clientX - pan.x,
      y: e.clientY - pan.y,
    });
  };

  // ---------------------------------------------------
  // MOUSE DOWN
  // ---------------------------------------------------
  const handleMouseDown = (e) => {
    // if (e.button === 1 || e.button === 2 || e.altKey || e.shiftKey) {
    //   startPan(e);
    //   return;
    // }

    if (e.button !== 0 || e.altKey || e.shiftKey) {
      startPan(e);
      return;
    }
    if (tool === "select") return; // seats handle their own onClick

    const pos = svgPoint(e);

    if (tool === "erase") {
      eraseAt(pos);
      return;
    }

    if (tool === "seat") {
      setDrawing(true);
      setStartPos(pos);
      return;
    }

    if (tool === "row") {
      setDrawing(true);
      setStartPos(pos);
      setLiveEnd(pos);
    }
  };

  // ---------------------------------------------------
  // MOVE
  // ---------------------------------------------------
  const handleMouseMove = (e) => {
    if (panning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
      return;
    }

    const pos = svgPoint(e);

    if (dragSeatId) {
      setPlacedSeats((prev) =>
        prev?.map((s) =>
          s.id === dragSeatId ? { ...s, x: pos.x, y: pos.y } : s,
        ),
      );
      return;
    }

    // Smooth live preview - reduce vibration
    if (drawing && tool === "row") {
      setLiveEnd((prev) => {
        if (!prev || Math.hypot(prev.x - pos.x, prev.y - pos.y) > 3) {
          return pos;
        }
        return prev;
      });
    }
  };

  // ---------------------------------------------------
  // UP
  // ---------------------------------------------------
  const handleMouseUp = (e) => {
    console.log(
      "DEBUG hall.rows →",
      hall?.rows,
      "keys →",
      Object.keys(hall?.rows || {}),
    ); // ← ADD THIS

    if (panning) {
      setPanning(false);
      return;
    }

    const pos = svgPoint(e);

    if (dragSeatId) {
      setDragSeatId(null);
      return;
    }

    if (!drawing) return;

    const sec = getSec();

    if (tool === "row") {
      const pts = seatsAlongLine(startPos.x, startPos.y, pos.x, pos.y);

      if (pts.length > 0) {
        setPlacedRows((prev) => {
          // Calculate correct next row letter
          let dbRowCount = 0;
          if (is_edit && hall?.seats) {
            const letters = hall.seats
              .map((s) => s.seat_name?.match(/^([A-Z])/))
              .filter(Boolean)
              .map((m) => m[1].charCodeAt(0) - 64);

            dbRowCount = letters.length > 0 ? Math.max(...letters) : 0;
          }

          const rowIndex = prev.length + dbRowCount;
          const rowLetter = String.fromCharCode(65 + rowIndex);

          const ptsWithNames = pts.map((p, i) => ({
            ...p,
            seat_name: `${rowLetter}${i + 1}`,
          }));

          return [
            ...prev,
            {
              id: `r_${Date.now()}`,
              pts: ptsWithNames,
              color: sec.color,
              sectionId: sec.id,
              shape: seatShape,
              rowLetter,
            },
          ];
        });
      }
    }

    if (tool === "seat") {
      setPlacedSeats((prev) => [
        ...prev,
        {
          id: `s_${Date.now()}`,
          x: pos.x,
          y: pos.y,
          color: sec.color,
          sectionId: sec.id,
          shape: seatShape,
        },
      ]);
    }

    setDrawing(false);
    setStartPos(null);
    setLiveEnd(null);
  };

  // ---------------------------------------------------
  // DRAG EXISTING SEAT
  // ---------------------------------------------------
  const startSeatDrag = (id, e) => {
    e.stopPropagation();

    if (tool !== "seat") return;

    setDragSeatId(id);
  };

  // ---------------------------------------------------
  // RESET VIEW
  // ---------------------------------------------------
  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // ---------------------------------------------------
  // SAVE
  // ---------------------------------------------------
  const handleSave = async (hallMeta) => {
    const canvasWidth = 3000;
    const canvasHeight = 2000;

    // const layout = serialiseDrawLayout({
    //   placedRows,
    //   placedSeats,
    //   sections: DRAW_SECTIONS,
    //   canvasWidth,
    //   canvasHeight,
    // });

    // this already works because DRAW_SECTIONS is now dynamic from Redux
    const layout = serialiseDrawLayout({
      placedRows,
      placedSeats,
      sections: DRAW_SECTIONS, // ← now dynamic, no change needed
      canvasWidth,
      canvasHeight,
      rowOffset: is_edit ? Object.keys(hall?.rows || {}).length : 0,
    });
    if (!layout.seats.length) {
      enqueueSnackbar("Please create at least one seat", {
        variant: "warning",
      });
      return;
    }

    let result;

    // if (is_edit) {
    //   result = await dispatch(
    //     updateHallThunk({
    //       id: hallId,
    if (is_edit) {
      result = await dispatch(
        updateHallThunk({
          id: hallId || hall?.id,
          ...hallMeta,
          ...layout,
        }),
      );
    } else {
      result = await dispatch(
        createHallThunk({
          ...hallMeta,
          ...layout,
        }),
      );
    }

    if (
      createHallThunk.fulfilled.match(result) ||
      updateHallThunk.fulfilled.match(result)
    ) {
      enqueueSnackbar(
        is_edit ? "Hall updated successfully" : "Hall created successfully",
        { variant: "success" },
      );

      setSaveOpen(false);
    } else {
      enqueueSnackbar("Save failed", {
        variant: "error",
      });
    }
  };

  // ---------------------------------------------------
  // DERIVED
  // ---------------------------------------------------
  const previewPts =
    drawing && tool === "row" && startPos && liveEnd
      ? seatsAlongLine(startPos.x, startPos.y, liveEnd.x, liveEnd.y)
      : [];

  const totalSeats =
    placedRows?.reduce((a, r) => a + r.pts.length, 0) + placedSeats?.length;

  const secColor = getSec().color;

  // ---------------------------------------------------
  // LOADING
  // ---------------------------------------------------
  if (loading && is_edit && !loadedEdit) {
    return (
      <div
        style={{
          height: "100%",
          background: "#0d0d14",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  // ---------------------------------------------------
  // UI
  // ---------------------------------------------------
  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "220px 1fr 240px",
          height: "100%",
        }}
      >
        {/* LEFT */}
        <div
          style={{
            background: "#13131c",
            borderRight: "1px solid #1e1e2a",
            padding: 14,
          }}
        >
          {DRAW_SECTIONS.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSec(sec.id)}
              style={{
                width: "100%",
                padding: 10,
                marginBottom: 6,
                borderRadius: 8,
                border:
                  activeSec === sec.id
                    ? `1px solid ${sec.color}`
                    : "1px solid #1e1e2a",
                background: activeSec === sec.id ? sec.color + "20" : "#0d0d14",
                color: "#fff",
              }}
            >
              {sec.label}
            </button>
          ))}

          {/* <hr style={{ margin: "14px 0", borderColor: "#1e1e2a" }} /> */}
          <button
            onClick={() => {
              resetSectionForm();
              setSectionDialogOpen(true);
            }}
            style={{
              width: "100%",
              padding: "10px 12px",
              marginTop: 10,
              background: "#0b1220",
              border: "1px solid #334155",
              borderRadius: 10,
              color: "#8fbdfd",
              cursor: "pointer",
              fontSize: 13,
              transition: "all 160ms ease",
            }}
          >
            + Add Section
          </button>
          <Dialog
            open={sectionDialogOpen}
            onClose={() => setSectionDialogOpen(false)}
            maxWidth="xs"
            fullWidth
            PaperProps={{
              sx: {
                background: "#0b1220",
                border: "1px solid #1e293b",
                borderRadius: 2,
              },
            }}
          >
            <DialogTitle
              sx={{ color: "#F8FAFC", fontWeight: 700, fontSize: 16 }}
            >
              Add Section
            </DialogTitle>
            <DialogContent sx={{ pt: 1, pb: 2, background: "#0c1220" }}>
              {sectionError && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 2,
                    background: "#2d1515",
                    color: "#fca5a5",
                    fontSize: 12,
                  }}
                >
                  {sectionError}
                </Alert>
              )}
              <TextField
                label="Section"
                size="small"
                fullWidth
                value={sectionForm.id_key}
                onChange={(e) =>
                  setSectionForm({ ...sectionForm, id_key: e.target.value })
                }
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root fieldset": {
                    borderColor: "#334155",
                  },
                  "& .MuiOutlinedInput-root": {
                    color: "#F8FAFC",
                    background: "#0b1323",
                  },
                  "& .MuiInputLabel-root": { color: "#94A3B8" },
                }}
              />
              <TextField
                label="Label"
                size="small"
                fullWidth
                value={sectionForm.label}
                onChange={(e) =>
                  setSectionForm({ ...sectionForm, label: e.target.value })
                }
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root fieldset": {
                    borderColor: "#334155",
                  },
                  "& .MuiOutlinedInput-root": {
                    color: "#F8FAFC",
                    background: "#0b1323",
                  },
                  "& .MuiInputLabel-root": { color: "#94A3B8" },
                }}
              />
              <TextField
                label="Price"
                size="small"
                fullWidth
                type="number"
                value={sectionForm.price}
                onChange={(e) =>
                  setSectionForm({ ...sectionForm, price: e.target.value })
                }
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root fieldset": {
                    borderColor: "#334155",
                  },
                  "& .MuiOutlinedInput-root": {
                    color: "#F8FAFC",
                    background: "#0b1323",
                  },
                  "& .MuiInputLabel-root": { color: "#94A3B8" },
                }}
              />
              <FormControl size="small" fullWidth sx={{ mb: 2 }}>
                <InputLabel sx={{ color: "#94A3B8" }}>Seat Type</InputLabel>
                <Select
                  label="Seat Type"
                  value={sectionForm.seat_type}
                  onChange={(e) =>
                    setSectionForm({
                      ...sectionForm,
                      seat_type: e.target.value,
                    })
                  }
                  sx={{
                    "& fieldset": { borderColor: "#334155" },
                    color: "#F8FAFC",
                    background: "#0b1323",
                  }}
                >
                  <MenuItem value="standard">standard</MenuItem>
                  <MenuItem value="vip">vip</MenuItem>
                </Select>
              </FormControl>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  border: "1px solid #334155",
                  borderRadius: 10,
                  background: "#09101f",
                }}
              >
                <div style={{ color: "#94A3B8", fontSize: 13, minWidth: 88 }}>
                  Color
                </div>
                <input
                  type="color"
                  value={sectionForm.color}
                  onChange={(e) =>
                    setSectionForm({ ...sectionForm, color: e.target.value })
                  }
                  style={{
                    width: 44,
                    height: 44,
                    border: "none",
                    padding: 0,
                    background: "transparent",
                    cursor: "pointer",
                    borderRadius: 8,
                  }}
                />
                <span style={{ color: "#F8FAFC", fontSize: 13 }}>
                  {sectionForm.color}
                </span>
              </div>
            </DialogContent>
            <DialogActions
              sx={{ p: "16px 24px", gap: 1, background: "#0b1323" }}
            >
              <Button
                onClick={() => setSectionDialogOpen(false)}
                sx={{ color: "#94A3B8" }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  const id_key = sectionForm.id_key?.trim().toLowerCase();
                  if (!id_key) {
                    setSectionError("Section ID is required");
                    return;
                  }
                  const label = sectionForm.label?.trim() || id_key;
                  const price = Number(sectionForm.price) || 0;
                  const seat_type = sectionForm.seat_type || "standard";
                  dispatch(
                    createSectionThunk({
                      id_key,
                      label,
                      color: sectionForm.color || "#818cf8",
                      price,
                      seat_type,
                    }),
                  );
                  setSectionDialogOpen(false);
                }}
                sx={{
                  background: "linear-gradient(135deg,#2563EB,#1D4ED8)",
                  "&:hover": { background: "#1D4ED8" },
                  minWidth: 92,
                }}
              >
                Add
              </Button>
            </DialogActions>
          </Dialog>
          <hr style={{ margin: "14px 0", borderColor: "#1e1e2a" }} />
          {DRAW_TOOLS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTool(t.id)}
              style={{
                width: "100%",
                padding: 10,
                marginBottom: 6,
                borderRadius: 8,
                border:
                  tool === t.id ? "1px solid #2563EB" : "1px solid #1e1e2a",
                background: tool === t.id ? "#1e293b" : "#0d0d14",
                color: "#fff",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* CENTER */}
        {/* CENTER - Enhanced UI */}
        <div
          ref={wrapRef}
          style={{
            background: "#0a0a12",
            position: "relative",
            overflow: "hidden",
            border: "1px solid #1e2937",
          }}
        >
          {/* Top Status Bar */}
          <div
            style={{
              position: "absolute",
              top: 12,
              left: 16,
              zIndex: 60,
              background: "rgba(15, 23, 42, 0.96)",
              padding: "8px 16px",
              borderRadius: 10,
              fontSize: 13,
              color: "#94a3b8",
              border: "1px solid #334155",
              display: "flex",
              alignItems: "center",
              gap: 16,
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            }}
          >
            <div>
              Tool:{" "}
              <strong style={{ color: "#60a5fa" }}>{tool.toUpperCase()}</strong>
            </div>
            <div>
              Section:{" "}
              <strong style={{ color: secColor }}>{getSec().label}</strong>
            </div>
            <div>
              Next Row:{" "}
              <strong style={{ color: "#facc15" }}>
                {String.fromCharCode(
                  65 +
                    placedRows.length +
                    (is_edit && hall?.seats
                      ? Math.max(
                          0,
                          ...hall.seats.map((s) => {
                            const match = s.seat_name?.match(/^([A-Z])/);
                            return match ? match[1].charCodeAt(0) - 64 : 0;
                          }),
                        )
                      : 0),
                )}
              </strong>
            </div>
          </div>

          {/* Improved Zoom Controls */}
          <div
            style={{
              position: "absolute",
              top: 12,
              right: 16,
              zIndex: 60,
              display: "flex",
              gap: 6,
              background: "rgba(15, 23, 42, 0.96)",
              padding: 6,
              borderRadius: 12,
              border: "1px solid #334155",
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            }}
          >
            <button
              onClick={() =>
                setZoom((z) => clamp(z - 0.15, MIN_ZOOM, MAX_ZOOM))
              }
              style={zoomBtn}
            >
              −
            </button>
            <div
              style={{
                padding: "6px 14px",
                color: "#e2e8f0",
                fontWeight: 700,
                minWidth: 72,
                textAlign: "center",
                background: "#1e2937",
                borderRadius: 8,
              }}
            >
              {Math.round(zoom * 100)}%
            </div>
            <button
              onClick={() =>
                setZoom((z) => clamp(z + 0.15, MIN_ZOOM, MAX_ZOOM))
              }
              style={zoomBtn}
            >
              +
            </button>
            <button onClick={resetView} style={zoomBtn}>
              Reset
            </button>
          </div>

          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onContextMenu={(e) => e.preventDefault()}
            style={{
              cursor: panning
                ? "grabbing"
                : tool === "erase"
                  ? "crosshair"
                  : "default",
            }}
          >
            <defs>
              <pattern
                id="grid"
                width={GRID}
                height={GRID}
                patternUnits="userSpaceOnUse"
              >
                <circle cx="1" cy="1" r="1" fill="#1e2937" />
              </pattern>
            </defs>

            <rect width="100%" height="100%" fill="#0a0a12" />

            <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
              <rect width="6000" height="4000" fill="url(#grid)" />

              {/* Existing Rows */}
              {placedRows.map((row, rowIndex) =>
                row.pts.map((pt, i) => {
                  const name = pt?.seat_name || getSeatName(rowIndex, i);
                  const seatKey = `${row?.id}_${i}`;
                  const isSel = selectedSeatIds.includes(seatKey);

                  return (
                    <g
                      key={seatKey}
                      style={{
                        cursor: tool === "select" ? "pointer" : "default",
                      }}
                      onClick={(e) => {
                        if (tool !== "select") return;
                        // ... your existing onClick logic
                        e.stopPropagation();
                        if (e.ctrlKey || e.metaKey) {
                          setSelectedSeatIds((prev) =>
                            prev.includes(seatKey)
                              ? prev.filter((x) => x !== seatKey)
                              : [...prev, seatKey],
                          );
                        } else {
                          const rowKeys = row.pts.map(
                            (_, idx) => `${row.id}_${idx}`,
                          );
                          const allSel = rowKeys.every((k) =>
                            selectedSeatIds.includes(k),
                          );
                          setSelectedSeatIds((prev) =>
                            allSel
                              ? prev.filter((k) => !rowKeys.includes(k))
                              : [...new Set([...prev, ...rowKeys])],
                          );
                        }
                      }}
                    >
                      <rect
                        x={pt.x - SEAT_SIZE / 2}
                        y={pt.y - SEAT_SIZE / 2}
                        width={SEAT_SIZE}
                        height={SEAT_SIZE}
                        rx={shapeRadius(row.shape)}
                        fill={isSel ? row.color + "dd" : row.color + "44"}
                        stroke={isSel ? "#fff" : row.color}
                        strokeWidth={isSel ? 3 : 1.5}
                      />
                      <text
                        x={pt.x}
                        y={pt.y + 5}
                        textAnchor="middle"
                        fontSize="9"
                        fill="#fff"
                        fontWeight="600"
                        pointerEvents="none"
                      >
                        {name}
                      </text>
                    </g>
                  );
                }),
              )}

              {/* Individual Seats */}
              {placedSeats.map((seat) => {
                const isSel = selectedSeatIds.includes(String(seat.id));
                const name = seat.seat_name || "S1";

                return (
                  <g key={seat.id}>
                    <rect
                      x={seat.x - SEAT_SIZE / 2}
                      y={seat.y - SEAT_SIZE / 2}
                      width={SEAT_SIZE}
                      height={SEAT_SIZE}
                      rx={shapeRadius(seat.shape)}
                      fill={isSel ? seat.color + "dd" : seat.color + "44"}
                      stroke={isSel ? "#fff" : seat.color}
                      strokeWidth={isSel ? 3 : 1.5}
                      onMouseDown={(e) =>
                        tool !== "select" && startSeatDrag(seat.id, e)
                      }
                      onClick={(e) => {
                        if (tool !== "select") return;
                        e.stopPropagation();
                        setSelectedSeatIds((prev) =>
                          prev.includes(String(seat.id))
                            ? prev.filter((x) => x !== String(seat.id))
                            : [...prev, String(seat.id)],
                        );
                      }}
                    />
                    <text
                      x={seat.x}
                      y={seat.y + 5}
                      textAnchor="middle"
                      fontSize="9"
                      fill="#fff"
                      fontWeight="600"
                      pointerEvents="none"
                    >
                      {name}
                    </text>
                    {seat.customLabel && (
                      <text
                        x={seat.x}
                        y={seat.y - 18}
                        textAnchor="middle"
                        fontSize="7.5"
                        fill="#fbbf24"
                        fontWeight="700"
                        pointerEvents="none"
                      >
                        {seat.customLabel}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Live Preview */}
              {previewPts.map((pt, i) => (
                <rect
                  key={i}
                  x={pt.x - SEAT_SIZE / 2}
                  y={pt.y - SEAT_SIZE / 2}
                  width={SEAT_SIZE}
                  height={SEAT_SIZE}
                  rx={6}
                  fill={secColor + "33"}
                  stroke={secColor}
                  strokeDasharray="4 3"
                  strokeWidth="2"
                />
              ))}
            </g>
          </svg>

          {/* IMPROVED MINIMAP */}
          <div
            style={{
              position: "absolute",
              bottom: 16,
              right: 16,
              width: 210,
              height: 140,
              background: "#111827",
              border: "2px solid #334155",
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
              zIndex: 50,
            }}
          >
            <div
              style={{
                transform: `scale(0.18)`,
                transformOrigin: "top left",
                width: "6000px",
                height: "4000px",
              }}
            >
              <svg width="6000" height="4000" style={{ background: "#0a0a12" }}>
                {placedRows.flatMap((row) =>
                  row.pts.map((pt, i) => (
                    <rect
                      key={`mini-r-${row.id}-${i}`}
                      x={pt.x - 12}
                      y={pt.y - 12}
                      width="24"
                      height="24"
                      rx="4"
                      fill={row.color}
                    />
                  )),
                )}
                {placedSeats.map((seat) => (
                  <rect
                    key={`mini-s-${seat.id}`}
                    x={seat.x - 12}
                    y={seat.y - 12}
                    width="24"
                    height="24"
                    rx="4"
                    fill={seat.color}
                  />
                ))}
              </svg>
            </div>
            <div
              style={{
                position: "absolute",
                top: 6,
                left: 8,
                color: "#94a3b8",
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              MINIMAP
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div
          style={{
            background: "#13131c",
            borderLeft: "1px solid #1e1e2a",
            padding: 16,
          }}
        >
          <div style={{ color: "#64748B", fontSize: 12 }}>Summary</div>

          <div
            style={{
              fontSize: 30,
              fontWeight: 700,
              color: "#2563EB",
              marginTop: 10,
            }}
          >
            {totalSeats}
          </div>

          <div
            style={{
              color: "#64748B",
              fontSize: 12,
              marginBottom: 20,
            }}
          >
            Total Seats
          </div>

          {selectedSeatIds.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ color: "#64748B", fontSize: 11, marginBottom: 6 }}>
                {selectedSeatIds.length} seat
                {selectedSeatIds.length > 1 ? "s" : ""} selected
              </div>
              <button
                onClick={async () => {
                  const title = prompt("Enter title (e.g. Teachers):");
                  if (!title?.trim()) return;
                  const label = title.trim();

                  // ── Numeric IDs = DB seats (edit mode) ──────────
                  const dbIds = selectedSeatIds
                    ?.filter((id) => /^\d+$/.test(id))
                    ?.map(Number);

                  // ── Row keys = r_xxx_i (local placedRows) ────────
                  const rowKeys = selectedSeatIds?.filter((id) =>
                    id.startsWith("r_"),
                  );

                  // ── Local individual seat IDs = s_xxx ────────────
                  const localIds = selectedSeatIds?.filter((id) =>
                    id.startsWith("s_"),
                  );

                  console.log("Add Title →", {
                    label,
                    hallId,
                    dbIds,
                    rowKeys,
                    localIds,
                  });

                  // 1️⃣ Edit mode: call API for DB seats
                  const effectiveHallId = hallId || hall?.id;
                  if (dbIds.length > 0 && effectiveHallId) {
                    const result = await dispatch(
                      updateSeatLabelThunk({
                        hallId: effectiveHallId,
                        seat_ids: dbIds,
                        section_label: label,
                      }),
                    );
                    if (updateSeatLabelThunk.fulfilled.match(result)) {
                      const { seats = [], updated_count } = result.payload;

                      // ── Update placedSeats in UI immediately ──
                      if (seats.length > 0) {
                        setPlacedSeats((prev) =>
                          prev?.map((s) => {
                            const updated = seats?.find(
                              (u) => String(u.id) === String(s.id),
                            );
                            return updated
                              ? { ...s, customLabel: updated.section_label }
                              : s;
                          }),
                        );
                      }

                      enqueueSnackbar(
                        `✅ "${label}" applied to ${updated_count} seats`,
                        { variant: "success" },
                      );
                    } else {
                      enqueueSnackbar(
                        result.payload || "Failed to update labels",
                        { variant: "error" },
                      );
                    }
                  }

                  // 2️⃣ Add mode: update placedRows locally
                  if (rowKeys.length > 0) {
                    const rowIds = [
                      ...new Set(
                        rowKeys.map((k) => k.split("_").slice(0, 2).join("_")),
                      ),
                    ];
                    setPlacedRows((prev) =>
                      prev?.map((row) =>
                        rowIds.includes(row.id)
                          ? { ...row, customLabel: label }
                          : row,
                      ),
                    );
                    enqueueSnackbar(
                      `✅ "${label}" set on ${rowKeys.length} seats (save to persist)`,
                      { variant: "info" },
                    );
                  }

                  // 3️⃣ Add mode: update placedSeats locally
                  if (localIds.length > 0) {
                    setPlacedSeats((prev) =>
                      prev?.map((s) =>
                        localIds.includes(s.id)
                          ? { ...s, customLabel: label }
                          : s,
                      ),
                    );
                  }

                  if (
                    dbIds.length === 0 &&
                    rowKeys.length === 0 &&
                    localIds.length === 0
                  ) {
                    enqueueSnackbar("No valid seats selected", {
                      variant: "warning",
                    });
                  }

                  setSelectedSeatIds([]);
                }}
              >
                🏷 Add Title →
              </button>
              <button
                onClick={() => setSelectedSeatIds([])}
                style={{
                  width: "100%",
                  padding: 6,
                  border: "1px solid #334155",
                  borderRadius: 8,
                  background: "transparent",
                  color: "#64748B",
                  fontSize: 11,
                  cursor: "pointer",
                }}
              >
                Clear Selection
              </button>
            </div>
          )}

          <button
            disabled={saving || totalSeats === 0}
            onClick={() => setSaveOpen(true)}
            style={{
              width: "100%",
              padding: 12,
              border: "none",
              borderRadius: 10,
              background: "#2563EB",
              color: "#fff",
              fontWeight: 700,
            }}
          >
            {saving ? "Saving..." : is_edit ? "Update Hall" : "Create Hall"}
          </button>
        </div>
      </div>

      {/* <SaveHallDialog
        open={saveOpen}
        onClose={() => setSaveOpen(false)}
        onSave={handleSave}
        saving={saving}
      /> */}
      <SaveHallDialog
        open={saveOpen}
        onClose={() => setSaveOpen(false)}
        onSave={handleSave}
        saving={saving}
        initialData={is_edit ? hall : null}
      />
    </>
  );
}

export default function HallCreate({
  hallId,
  is_edit = false,
  is_add = false,
}) {
  const { id } = useParams();
  const [mode, setMode] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    if (is_add || is_edit) {
      setMode(1); // Auto activate Admin: Draw Mode
    }
  }, [is_add, is_edit]);

  useEffect(() => {
    dispatch(clearCurrentHall()); // clear old hall first
    dispatch(fetchHallByIdThunk({ id: hallId || id }));
  }, [dispatch, hallId, id]);
  const [activePanel, setActivePanel] = useState("draw"); // "draw" | "partyplot"
  return (
    <div
      style={{
        padding: "0",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#0B1120",
        color: "#fff",
        fontFamily: "'Inter', 'DM Sans', sans-serif",
        overflow: "hidden",
      }}
    >
      {/* PREMIUM TOP NAVBAR */}
      <div
        style={{
          height: 66,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          background:
            "linear-gradient(135deg,#020617 0%, #0F172A 50%, #111827 100%)",
          borderBottom: "1px solid #1E293B",
          boxShadow: "0 10px 30px rgba(0,0,0,.35)",
          zIndex: 10,
        }}
      >
        {/* LOGO */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            minWidth: 230,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: "linear-gradient(135deg,#2563EB,#1D4ED8,#60A5FA)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              boxShadow: "0 0 18px rgba(37,99,235,.45)",
            }}
          >
            🎭
          </div>

          <div>
            <div
              style={{
                fontWeight: 800,
                fontSize: 15,
                color: "#F8FAFC",
              }}
            >
              HallDesk Pro
            </div>

            <div
              style={{
                fontSize: 11,
                color: "#64748B",
                marginTop: 2,
              }}
            >
              Premium Venue Dashboard
            </div>
          </div>
        </div>

        {/* TABS */}
        {/* TABS */}
        <div style={{ display: "flex", gap: 8, marginLeft: 18 }}>
          {/* Main Tabs (only when not in add/edit) */}
          {!(is_add || is_edit) && (
            <>
              {MODES.map((m, i) => {
                const active = mode === i;
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setMode(i);
                      setActivePanel("draw");
                    }}
                    style={{
                      padding: "10px 18px",
                      borderRadius: 12,
                      border: active
                        ? "1px solid #2563EB55"
                        : "1px solid transparent",
                      background: active
                        ? "linear-gradient(135deg,#1D4ED8,#2563EB)"
                        : "transparent",
                      color: active ? "#fff" : "#94A3B8",
                      cursor: "pointer",
                      fontWeight: active ? 700 : 600,
                      fontSize: 13,
                      transition: "all .2s ease",
                      boxShadow: active
                        ? "0 10px 20px rgba(37,99,235,.25)"
                        : "none",
                    }}
                  >
                    {i === 0 && "🎟 "}
                    {i === 1 && "🛠 "}
                    {i === 2 && "📊 "}
                    {m}
                  </button>
                );
              })}
            </>
          )}

          {/* Draw Mode Tab (for Add/Edit mode) */}
          {(is_add || is_edit) && (
            <button
              onClick={() => setActivePanel("draw")}
              style={{
                padding: "10px 18px",
                borderRadius: 12,
                background:
                  activePanel === "draw"
                    ? "linear-gradient(135deg,#1D4ED8,#2563EB)"
                    : "transparent",
                color: activePanel === "draw" ? "#fff" : "#94A3B8",
                border: activePanel === "draw" ? "1px solid #2563EB55" : "none",
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              🛠 Draw Mode
            </button>
          )}

          {/* Party Plot Button */}
          <button
            onClick={() => setActivePanel("partyplot")}
            style={{
              background:
                activePanel === "partyplot"
                  ? "linear-gradient(135deg,#f59e0b,#d97706)"
                  : "transparent",
              border: "2px solid #f59e0b",
              borderRadius: 10,
              padding: "8px 20px",
              color: "#fff",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              boxShadow:
                activePanel === "partyplot" ? "0 0 16px #f59e0b66" : "none",
              marginLeft: 8,
            }}
          >
            🎪 Party Plot
          </button>
        </div>

        {/* RIGHT */}
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            gap: 10,
            alignItems: "center",
          }}
        >
          {/* HALL ID */}
          <div
            style={{
              padding: "8px 14px",
              borderRadius: 999,
              background: "#111827",
              border: "1px solid #1E293B",
              color: "#CBD5E1",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            Hall #{hallId || "—"}
          </div>

          {/* EVENT */}
          <div
            style={{
              padding: "8px 14px",
              borderRadius: 999,
              background: "#1E3A8A22",
              border: "1px solid #2563EB44",
              color: "#60A5FA",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            Event #{id || "—"}
          </div>

          {/* LIVE */}
          <div
            style={{
              padding: "8px 14px",
              borderRadius: 999,
              background: "#052E16",
              border: "1px solid #14532D",
              color: "#4ADE80",
              fontSize: 12,
              fontWeight: 700,
              display: "flex",
              gap: 8,
              alignItems: "center",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#22C55E",
                boxShadow: "0 0 8px #22C55E",
              }}
            />
            LIVE
          </div>
        </div>
      </div>

      {/* PAGE BODY */}
      <div
        style={{
          flex: 1,
          overflow: "hidden",
        }}
      >
        {/* MODE 0 */}
        {/* {mode === 0 && <BookingView hallId={hallId} />} */}

        {/* MODE 1 */}
        {/* {mode === 1 && (
          <DrawMode hallId={hallId} is_edit={is_edit} is_add={is_add} />
        )} */}

        {/* MODE 2 */}
        {/* {mode === 2 && <BookingManager eventId={id} />} */}

        {/* MODE 3 */}
        {/* {mode === 3 && <Partyplote />} */}
        {/* {mode === 1 && (
          <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <DrawMode />
            </div>
            <div
              style={{
                width: 420,
                borderLeft: "1px solid #1e1e2a",
                overflowY: "auto",
                background: "#0d0d14",
              }}
            >
              <Partyplote />
            </div>
          </div>
        )} */}
        <div style={{ flex: 1, overflow: "hidden" }}>
          {activePanel === "draw" && (
            <DrawMode hallId={hallId} is_edit={is_edit} is_add={is_add} />
          )}
          {activePanel === "partyplot" && <PartyPlotPanel />}
        </div>
      </div>
    </div>
  );
}
