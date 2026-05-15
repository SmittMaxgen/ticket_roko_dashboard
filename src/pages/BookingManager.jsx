import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchBookingsThunk,
  fetchBookingLayoutThunk,
  createBookingThunk,
  cancelBookingThunk,
} from "../features/bookings/bookingThunks";

import {
  selectBookingLayout,
  selectBookingList,
  selectBookingLoading,
  selectIsBookingCreating,
} from "../features/bookings/bookingSelectors";

import {
  fetchSectionsThunk,
  updateSeatLabelThunk,
} from "../features/options/optionsThunks";
import { selectSections } from "../features/options/optionsSelectors";
import { useSnackbar } from "notistack";

export default function BookingManager({ eventId }) {
  const dispatch = useDispatch();
  const { id } = useParams();

  const layout = useSelector(selectBookingLayout);
  const bookings = useSelector(selectBookingList);
  const loading = useSelector(selectBookingLoading);
  const creating = useSelector(selectIsBookingCreating);

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Zoom & Pan State
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);

  const [tooltip, setTooltip] = useState(null);

  // ── Admin Select Tool ─────────────────────────────
  const [adminTool, setAdminTool] = useState(null); // null | "select"
  const [labelSeatIds, setLabelSeatIds] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const DRAW_SECTIONS = useSelector(selectSections);

  const wrapRef = useRef(null);

  const MIN_ZOOM = 0.45;
  const MAX_ZOOM = 3;
  const SEAT_SIZE = 22;

  // NEW — add this
  const selectedSeatObjects = useMemo(() => {
    return (layout?.seats || [])?.filter((s) => selectedSeats?.includes(s.id));
  }, [layout?.seats, selectedSeats]);

  const selectedTotal = useMemo(() => {
    return selectedSeatObjects.reduce(
      (sum, s) => sum + Number(s.price || 0),
      0,
    );
  }, [selectedSeatObjects]);
  // Load Data
  useEffect(() => {
    const event_id = eventId || id;
    if (event_id) {
      dispatch(fetchBookingsThunk({ event_id }));
      dispatch(fetchBookingLayoutThunk(event_id));
    }
    dispatch(fetchSectionsThunk());
  }, [dispatch, eventId, id]);

  // Toggle Seat Selection
  const toggleSeat = useCallback((seat) => {
    if (seat.status === "sold") return;

    setSelectedSeats((prev) =>
      prev.includes(seat.id)
        ? prev?.filter((id) => id !== seat.id)
        : [...prev, seat.id],
    );
  }, []);

  // Create Booking
  const handleCreateBooking = async () => {
    if (!selectedSeats.length) return;

    const event_id = eventId || id;

    const result = await dispatch(
      createBookingThunk({
        event_id,
        seat_ids: selectedSeats,
        payment_method: "cash",
      }),
    );

    if (createBookingThunk.fulfilled.match(result)) {
      setSelectedSeats([]);
      // Refresh layout and bookings
      dispatch(fetchBookingLayoutThunk(event_id));
      dispatch(fetchBookingsThunk({ event_id }));
    }
  };

  // Cancel Booking
  const handleCancelBooking = async (bookingId) => {
    if (!bookingId) return;
    await dispatch(cancelBookingThunk(bookingId));
    const event_id = eventId || id;
    dispatch(fetchBookingLayoutThunk(event_id));
    dispatch(fetchBookingsThunk({ event_id }));
  };

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    const q = search.toLowerCase();
    return bookings?.filter((b) => {
      const matchSearch =
        b.customer_name?.toLowerCase().includes(q) ||
        b.mobile?.includes(q) ||
        String(b.id).includes(q);

      const matchStatus =
        statusFilter === "all" ||
        b.status?.toLowerCase() === statusFilter?.toLowerCase();

      return matchSearch && matchStatus;
    });
  }, [bookings, search, statusFilter]);

  // Stats
  const stats = useMemo(() => {
    const revenue = bookings?.reduce(
      (sum, b) => sum + Number(b.amount || 0),
      0,
    );
    const paid = bookings?.filter((b) => b.status === "paid").length;
    const cancelled = bookings?.filter((b) => b.status === "cancelled").length;

    return { total: bookings.length, paid, cancelled, revenue };
  }, [bookings]);

  // Zoom Controls
  const zoomIn = () =>
    setZoom((z) => Math.min(MAX_ZOOM, Number((z + 0.15).toFixed(2))));
  const zoomOut = () =>
    setZoom((z) => Math.max(MIN_ZOOM, Number((z - 0.15).toFixed(2))));
  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const dir = e.deltaY > 0 ? -0.12 : 0.12;
    setZoom((z) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z + dir)));
  };

  const startPan = (e) => {
    if (e.button !== 0) return;
    setDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const movePan = (e) => {
    if (!dragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const stopPan = () => setDragging(false);

  // Seat Colors (consistent with BookingView)
  const validColor = (fill) =>
    /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(fill) ? fill : "#64748B";

  const getSeatFill = (seat) => {
    const color = validColor(seat.fill);
    if (labelSeatIds.includes(seat.id)) return color + "99";
    if (selectedSeats.includes(seat.id)) return "#2563EB";
    if (seat.status === "sold") return "#2a1116";
    return color + "22";
  };

  const getSeatStroke = (seat) => {
    const color = validColor(seat.fill);
    if (labelSeatIds.includes(seat.id)) return "#fff";
    if (selectedSeats.includes(seat.id)) return "#60A5FA";
    if (seat.status === "sold") return "#c92c4b";
    return color;
  };

  if (loading) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#050816",
          color: "#64748B",
        }}
      >
        Loading booking layout...
      </div>
    );
  }

  const canvasW = layout?.canvas_width || 1000;
  const canvasH = layout?.canvas_height || 700;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 340px",
        height: "100%",
        background: "#050816",
      }}
    >
      {/* LEFT: SEAT MAP */}
      <div
        style={{
          padding: 24,
          position: "relative",
          background:
            "radial-gradient(circle at top,#0b1228 0%,#050816 55%,#04050f 100%)",
        }}
      >
        {/* Toolbar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
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
          <div style={{ color: "#94A3B8", fontSize: 12, fontWeight: 700 }}>
            {Math.round(zoom * 100)}%
          </div>
        </div>

        {/* Stage */}
        {/* Admin Toolbar */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 12,
            alignItems: "center",
          }}
        >
          <span style={{ color: "#475569", fontSize: 11, fontWeight: 600 }}>
            ADMIN:
          </span>
          <button
            onClick={() => {
              setAdminTool((prev) => (prev === "select" ? null : "select"));
              setLabelSeatIds([]);
            }}
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              border: `1px solid ${adminTool === "select" ? "#2563EB" : "#1e293b"}`,
              background: adminTool === "select" ? "#1e293b" : "transparent",
              color: adminTool === "select" ? "#60A5FA" : "#64748B",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            ⊹ Select Tool {adminTool === "select" ? "(ON)" : ""}
          </button>

          {labelSeatIds.length > 0 && (
            <>
              <span style={{ color: "#64748B", fontSize: 11 }}>
                {labelSeatIds.length} selected
              </span>
              <button
                onClick={async () => {
                  const title = prompt(
                    "Enter title for selected seats (e.g. Teachers):",
                  );
                  if (!title?.trim()) return;
                  const hallId = layout?.hall?.id;
                  if (!hallId) {
                    enqueueSnackbar("Hall ID not found", { variant: "error" });
                    return;
                  }
                  const result = await dispatch(
                    updateSeatLabelThunk({
                      hallId,
                      seat_ids: labelSeatIds,
                      section_label: title.trim(),
                      event_id: eventId || id,
                    }),
                  );
                  if (updateSeatLabelThunk.fulfilled.match(result)) {
                    enqueueSnackbar(
                      `✅ "${title}" applied to ${labelSeatIds.length} seats`,
                      { variant: "success" },
                    );
                    dispatch(fetchBookingLayoutThunk(eventId || id));
                  } else {
                    enqueueSnackbar(result.payload || "Failed", {
                      variant: "error",
                    });
                  }
                  setLabelSeatIds([]);
                  setAdminTool(null);
                }}
                style={{
                  padding: "6px 14px",
                  borderRadius: 8,
                  border: "none",
                  background: "#1D4ED8",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                🏷 Add Title
              </button>
              <button
                onClick={() => setLabelSeatIds([])}
                style={{
                  padding: "6px 10px",
                  borderRadius: 8,
                  border: "1px solid #334155",
                  background: "transparent",
                  color: "#64748B",
                  fontSize: 11,
                  cursor: "pointer",
                }}
              >
                Clear
              </button>
            </>
          )}

          {adminTool === "select" && labelSeatIds.length === 0 && (
            <span style={{ color: "#475569", fontSize: 11 }}>
              Click row to select · Ctrl+click for single seat
            </span>
          )}
        </div>

        {/* Stage */}
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          {" "}
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

        {/* Canvas */}
        <div
          ref={wrapRef}
          onWheel={handleWheel}
          onMouseDown={startPan}
          onMouseMove={movePan}
          onMouseUp={stopPan}
          onMouseLeave={stopPan}
          style={{
            height: "calc(100% - 100px)",
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
                background: "#040612",
                borderRadius: 16,
                border: "1px solid #111827",
              }}
            >
              <defs>
                <pattern
                  id="seatgrid"
                  width={28}
                  height={28}
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="1.4" cy="1.4" r="1" fill="#182038" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#seatgrid)" />

              {/* Section label text per row group */}
              {(() => {
                const rowLabels = {};
                (layout?.seats || [])
                  ?.filter((s) => !s.is_space)
                  ?.forEach((s) => {
                    const key = s.row_label;
                    if (!rowLabels[key]) rowLabels[key] = s;
                  });
                return Object.values(rowLabels).map((s) => (
                  <text
                    key={`lbl_${s.row_label}`}
                    x={Number(s.x_pos) - SEAT_SIZE / 2 - 6}
                    y={Number(s.y_pos) + 5}
                    textAnchor="end"
                    fontSize="9"
                    fill={s.fill || "#64748B"}
                    fontWeight="700"
                  >
                    {s.section_label || s.row_label}
                  </text>
                ));
              })()}

              {(layout?.seats || []).map((seat) => {
                if (seat.is_space) return null;
                const x = Number(seat.x_pos) - SEAT_SIZE / 2;
                const y = Number(seat.y_pos) - SEAT_SIZE / 2;

                return (
                  <rect
                    key={seat.id}
                    x={x}
                    y={y}
                    width={SEAT_SIZE}
                    height={SEAT_SIZE}
                    rx={selectedSeats.includes(seat.id) ? 11 : 6}
                    fill={getSeatFill(seat)}
                    stroke={getSeatStroke(seat)}
                    strokeWidth={1.8}
                    style={{
                      cursor:
                        seat.status === "sold" ? "not-allowed" : "pointer",
                      transition: "all 0.15s ease",
                    }}
                    onClick={(e) => {
                      if (adminTool === "select") {
                        e.stopPropagation();
                        if (e.ctrlKey || e.metaKey) {
                          setLabelSeatIds((prev) =>
                            prev?.includes(seat.id)
                              ? prev?.filter((x) => x !== seat.id)
                              : [...prev, seat.id],
                          );
                        } else {
                          // select all seats in same row_label
                          const rowSeats = (layout?.seats || [])
                            ?.filter(
                              (s) =>
                                s.row_label === seat.row_label && !s.is_space,
                            )
                            .map((s) => s.id);
                          const allSel = rowSeats.every((sid) =>
                            labelSeatIds.includes(sid),
                          );
                          setLabelSeatIds((prev) =>
                            allSel
                              ? prev?.filter((x) => !rowSeats.includes(x))
                              : [...new Set([...prev, ...rowSeats])],
                          );
                        }
                        return;
                      }
                      toggleSeat(seat);
                    }}
                    onMouseEnter={(e) =>
                      setTooltip({
                        seat,
                        x: e.clientX,
                        y: e.clientY,
                      })
                    }
                    onMouseLeave={() => setTooltip(null)}
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
          <svg
            width={canvasW}
            height={canvasH}
            style={{ transform: "scale(0.18)", transformOrigin: "top left" }}
          >
            <rect width="100%" height="100%" fill="#040612" />
            {(layout?.seats || []).map((seat) => {
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

      {/* RIGHT PANEL - Sidebar */}
      <div
        style={{
          background: "#0b1020",
          borderLeft: "1px solid #172036",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div style={{ padding: 20, borderBottom: "1px solid #172036" }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>
            Booking Manager
          </div>
          <div style={{ color: "#64748B", fontSize: 12, marginTop: 4 }}>
            Event ID: {eventId || id}
          </div>

          {/* Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 8,
              marginTop: 16,
            }}
          >
            <StatCard label="Total" value={stats.total} />
            <StatCard label="Paid" value={stats.paid} color="#4ADE80" />
            <StatCard
              label="Cancelled"
              value={stats.cancelled}
              color="#F87171"
            />
            <StatCard
              label="Revenue"
              value={`₹${stats.revenue}`}
              color="#60A5FA"
            />
          </div>

          {/* Section Summary */}
          {(layout?.sectionSummary || []).length > 0 && (
            <div style={{ marginTop: 14 }}>
              <div
                style={{
                  fontSize: 10,
                  color: "#475569",
                  fontWeight: 600,
                  letterSpacing: 1,
                  marginBottom: 8,
                }}
              >
                SECTIONS
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2,1fr)",
                  gap: 6,
                }}
              >
                {(layout?.sectionSummary || []).map((sec) => (
                  <div
                    key={sec.label}
                    style={{
                      background: sec.fill + "14",
                      border: `1px solid ${sec.fill}33`,
                      borderRadius: 8,
                      padding: "8px 10px",
                    }}
                  >
                    <div
                      style={{ color: sec.fill, fontWeight: 700, fontSize: 15 }}
                    >
                      {sec.available}
                    </div>
                    <div
                      style={{ fontSize: 10, color: "#94A3B8", marginTop: 2 }}
                    >
                      {sec.label}
                    </div>
                    <div
                      style={{ fontSize: 9, color: "#475569", marginTop: 1 }}
                    >
                      {sec.sold} sold / {sec.total} total
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div style={{ padding: 20, borderBottom: "1px solid #172036" }}>
          <input
            placeholder="Search customer, mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 10,
              background: "#111827",
              border: "1px solid #1E293B",
              color: "#fff",
              marginBottom: 10,
            }}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 10,
              background: "#111827",
              border: "1px solid #1E293B",
              color: "#fff",
            }}
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {selectedSeats.length > 0 && (
            <button
              onClick={handleCreateBooking}
              disabled={creating}
              style={{
                marginTop: 12,
                width: "100%",
                padding: 14,
                border: "none",
                borderRadius: 12,
                background: creating
                  ? "#334155"
                  : "linear-gradient(135deg,#2563EB,#1D4ED8)",
                color: "#fff",
                fontWeight: 700,
                cursor: creating ? "not-allowed" : "pointer",
              }}
            >
              {creating
                ? "Creating..."
                : `Create Booking (${selectedSeats.length})`}
            </button>
          )}
        </div>

        {/* Booking List */}
        <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
          {filteredBookings?.length === 0 ? (
            <div
              style={{
                color: "#64748B",
                textAlign: "center",
                padding: "40px 20px",
              }}
            >
              No bookings found
            </div>
          ) : (
            filteredBookings?.map((booking) => (
              <div
                key={booking.id}
                onClick={() => setSelectedBooking(booking)}
                style={{
                  background:
                    selectedBooking?.id === booking.id ? "#0F172A" : "#111827",
                  border:
                    selectedBooking?.id === booking.id
                      ? "1px solid #2563EB"
                      : "1px solid #1E293B",
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 12,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <div style={{ color: "#60A5FA", fontWeight: 700 }}>
                    #{booking.id}
                  </div>
                  <StatusChip status={booking.status} />
                </div>
                <div style={{ fontWeight: 600, color: "#fff" }}>
                  {booking.customer_name}
                </div>
                <div style={{ color: "#64748B", fontSize: 13 }}>
                  {booking.mobile}
                </div>

                <div
                  style={{
                    marginTop: 10,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {(booking.seats || []).map((s, i) => (
                      <span
                        key={i}
                        style={{
                          background: "#1E293B",
                          padding: "2px 8px",
                          borderRadius: 6,
                          fontSize: 11,
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <div style={{ color: "#22C55E", fontWeight: 700 }}>
                    ₹{booking.amount}
                  </div>
                </div>

                {booking.status !== "cancelled" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancelBooking(booking.id);
                    }}
                    style={{
                      marginTop: 10,
                      background: "#7F1D1D",
                      color: "#fff",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        {/* {selectedSeats.length > 0 && (
          <div
            style={{
              padding: 20,
              borderTop: "1px solid #172036",
              background: "#0a101f",
            }}
          >
            <div style={{ color: "#94A3B8", fontSize: 13, marginBottom: 8 }}>
              Selected Seats for New Booking
            </div>
            <div
              style={{
                color: "#fff",
                fontSize: 15,
                fontWeight: 600,
                marginBottom: 12,
              }}
            >
              {selectedSeats.join(", ")}
            </div>
          </div>
        )} */}
        {selectedSeats.length > 0 && (
          <div
            style={{
              padding: 20,
              borderTop: "1px solid #172036",
              background: "#0a101f",
            }}
          >
            <div style={{ color: "#94A3B8", fontSize: 12, marginBottom: 10 }}>
              Selected Seats
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                marginBottom: 12,
              }}
            >
              {selectedSeatObjects.map((s) => (
                <div
                  key={s.id}
                  style={{
                    background: "#1e293b",
                    borderRadius: 8,
                    padding: "4px 10px",
                    fontSize: 12,
                    color: "#fff",
                  }}
                >
                  {s.seat_name}
                  <span style={{ color: "#22C55E", marginLeft: 6 }}>
                    ₹{s.price}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: "1px solid #1e293b", paddingTop: 10 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  color: "#64748B",
                  marginBottom: 4,
                }}
              >
                <span>Subtotal</span>
                <span>₹{selectedTotal}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  color: "#64748B",
                  marginBottom: 8,
                }}
              >
                <span>Convenience (5%)</span>
                <span>₹{Math.round(selectedTotal * 0.05)}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: 700,
                  color: "#22C55E",
                  fontSize: 14,
                }}
              >
                <span>Total</span>
                <span>₹{selectedTotal + Math.round(selectedTotal * 0.05)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          style={{
            position: "fixed",
            left: tooltip.x + 14,
            top: tooltip.y - 70,
            background: "#0f172a",
            border: "1px solid #334155",
            borderRadius: 12,
            padding: "10px 14px",
            zIndex: 9999,
            pointerEvents: "none",
            boxShadow: "0 12px 28px rgba(0,0,0,0.45)",
          }}
        >
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>
            {tooltip.seat.seat_name || `Seat ${tooltip.seat.id}`}
          </div>
          <div style={{ color: "#2563EB", marginTop: 4, fontWeight: 700 }}>
            ₹{tooltip.seat.price || "—"}
          </div>
          <div style={{ color: "#64748B", fontSize: 11, marginTop: 2 }}>
            {tooltip.seat.section_label}
          </div>
        </div>
      )}
    </div>
  );
}

/* ────────────────────── Helper Components ────────────────────── */

function StatCard({ label, value, color = "#fff" }) {
  return (
    <div
      style={{
        background: "#111827",
        border: "1px solid #1E293B",
        borderRadius: 10,
        padding: 12,
      }}
    >
      <div style={{ fontSize: 11, color: "#64748B" }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 800, color, marginTop: 4 }}>
        {value}
      </div>
    </div>
  );
}

function StatusChip({ status }) {
  const styles = {
    paid: { bg: "#14532D", color: "#4ADE80" },
    pending: { bg: "#78350F", color: "#FBBF24" },
    cancelled: { bg: "#7F1D1D", color: "#F87171" },
    default: { bg: "#334155", color: "#CBD5E1" },
  };

  const s = styles[status?.toLowerCase()] || styles.default;

  return (
    <div
      style={{
        background: s.bg,
        color: s.color,
        padding: "4px 10px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 700,
        textTransform: "uppercase",
      }}
    >
      {status}
    </div>
  );
}

const toolBtn = () => ({
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid #1e293b",
  background: "#0f172a",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
});
