// import React, { useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import {
//   fetchBookingsThunk,
//   fetchBookingByIdThunk,
//   cancelBookingThunk,
//   fetchBookingStatsThunk,
//   createBookingThunk,
//   fetchBookingLayoutThunk,
// } from "../features/bookings/bookingThunks";

// import {
//   selectBookingLayout,
//   selectBookingList,
//   selectBookingLoading,
//   selectIsBookingCreating,
// } from "../features/bookings/bookingSelectors";

// import { useSelector, useDispatch } from "react-redux";
// import { useParams } from "react-router-dom";

// export default function BookingManager({ eventId }) {
//   const dispatch = useDispatch();
//   const { id } = useParams();

//   // const [layout, setLayout] = useState(null);

//   const [search, setSearch] = useState("");
//   const [status, setStatus] = useState("all");
//   const [selectedBooking, setSelectedBooking] = useState(null);

//   // ✅ NEW STATE (seat booking)
//   const [selectedSeats, setSelectedSeats] = useState([]);
//   // const [creating, setCreating] = useState(false);
//   const layout = useSelector(selectBookingLayout);

//   const bookings = useSelector(selectBookingList);
//   const loading = useSelector(selectBookingLoading);
//   const creating = useSelector(selectIsBookingCreating);

//   const API = "https://ticket-roko-dashboard.vercel.app/api";

//   // --------------------------------------------------
//   // LOAD DATA
//   // --------------------------------------------------
//   useEffect(() => {
//     loadAll();
//   }, [eventId, id]);
//   const loadAll = async () => {
//     try {
//       await Promise.all([
//         dispatch(fetchBookingsThunk({ event_id: eventId || id })),
//         dispatch(fetchBookingLayoutThunk(eventId || id)),
//       ]);
//     } catch (err) {
//       console.error(err);
//     }
//   };
//   // --------------------------------------------------
//   // TOGGLE SEAT (NEW)
//   // --------------------------------------------------
//   const toggleSeat = (seat) => {
//     if (seat.status === "sold") return;

//     setSelectedSeats((prev) => {
//       const exists = prev.includes(seat.id);
//       if (exists) return prev.filter((id) => id !== seat.id);
//       return [...prev, seat.id];
//     });
//   };

//   // --------------------------------------------------
//   // CREATE BOOKING (NEW)
//   // --------------------------------------------------
//   const createBooking = async () => {
//     if (!selectedSeats.length) return;

//     try {
//       setCreating(true);

//       dispatch(
//         createBookingThunk({
//           event_id: eventId || id,
//           seat_ids: selectedSeats,
//         }),
//       );

//       setSelectedSeats([]);
//       await loadAll();
//     } catch (err) {
//       console.error(err);
//       alert("Booking failed");
//     } finally {
//       setCreating(false);
//     }
//   };

//   // --------------------------------------------------
//   // FILTER
//   // --------------------------------------------------
//   const filtered = useMemo(() => {
//     return bookings?.filter((b) => {
//       const q = search.toLowerCase();

//       const matchSearch =
//         b.customer_name?.toLowerCase().includes(q) ||
//         b.mobile?.includes(q) ||
//         String(b.id).includes(q);

//       const matchStatus =
//         status === "all"
//           ? true
//           : b.status?.toLowerCase() === status.toLowerCase();

//       return matchSearch && matchStatus;
//     });
//   }, [bookings, search, status]);

//   // --------------------------------------------------
//   // STATS
//   // --------------------------------------------------
//   const stats = useMemo(() => {
//     const revenue = bookings.reduce((a, b) => a + Number(b.amount || 0), 0);
//     const paid = bookings.filter((x) => x.status === "paid").length;
//     const cancelled = bookings.filter((x) => x.status === "cancelled").length;

//     return {
//       total: bookings.length,
//       paid,
//       cancelled,
//       revenue,
//     };
//   }, [bookings]);

//   // --------------------------------------------------
//   // ACTIVE SEATS FROM BOOKING
//   // --------------------------------------------------
//   const activeSeats = useMemo(() => {
//     if (!selectedBooking) return [];
//     return selectedBooking.seats || [];
//   }, [selectedBooking]);

//   // --------------------------------------------------
//   // CANCEL BOOKING
//   // --------------------------------------------------
//   const cancelBooking = async (id) => {
//     try {
//       await dispatch(cancelBookingThunk(id)).unwrap();
//       await dispatch(fetchBookingLayoutThunk(eventId || id));
//     } catch (err) {
//       alert(err || "Cancel failed");
//     }
//   };

//   // --------------------------------------------------
//   // LOADING
//   // --------------------------------------------------
//   if (loading) {
//     return (
//       <div style={loaderWrap}>
//         <div style={loaderBox}>Loading bookings...</div>
//       </div>
//     );
//   }

//   return (
//     <div
//       style={{
//         display: "grid",
//         gridTemplateColumns: "430px 1fr",
//         height: "100%",
//         background: "#0B1120",
//       }}
//     >
//       {/* LEFT PANEL */}
//       <div style={leftPanel}>
//         {/* HEADER */}
//         <div style={headerBox}>
//           <div style={title}>Booking Manager</div>
//           <div style={subTitle}>Event ID: {eventId}</div>

//           {/* STATS */}
//           <div style={statsGrid}>
//             <StatCard label="Total" value={stats.total} />
//             <StatCard label="Paid" value={stats.paid} />
//             <StatCard label="Cancelled" value={stats.cancelled} />
//             <StatCard label="Revenue" value={`₹${stats.revenue}`} blue />
//           </div>

//           {/* SEARCH */}
//           <input
//             placeholder="Search booking / mobile / customer"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             style={searchInput}
//           />

//           <select
//             value={status}
//             onChange={(e) => setStatus(e.target.value)}
//             style={searchInput}
//           >
//             <option value="all">All Status</option>
//             <option value="paid">Paid</option>
//             <option value="pending">Pending</option>
//             <option value="cancelled">Cancelled</option>
//           </select>

//           {/* CREATE BOOKING BUTTON */}
//           {selectedSeats.length > 0 && (
//             <button onClick={createBooking} disabled={creating} style={btn}>
//               {creating
//                 ? "Creating..."
//                 : `Create Booking (${selectedSeats.length})`}
//             </button>
//           )}
//         </div>

//         {/* BOOKING LIST */}
//         <div style={listBox}>
//           {filtered.map((b) => {
//             const active = selectedBooking?.id === b.id;

//             return (
//               <div
//                 key={b.id}
//                 onClick={() => setSelectedBooking(b)}
//                 style={{
//                   ...bookingCard,
//                   border: active ? "1px solid #2563EB" : "1px solid #1E293B",
//                   background: active ? "#0F172A" : "#111827",
//                 }}
//               >
//                 <div style={rowBetween}>
//                   <div style={bookingNo}>#{b.id}</div>
//                   <StatusChip status={b.status} />
//                 </div>

//                 <div style={custName}>{b.customer_name}</div>
//                 <div style={smallText}>{b.mobile}</div>

//                 <div style={rowBetween}>
//                   <div style={seatPills}>
//                     {(b.seats || []).map((s) => (
//                       <span key={s} style={seatTag}>
//                         {s}
//                       </span>
//                     ))}
//                   </div>
//                   <div style={amount}>₹{b.amount}</div>
//                 </div>

//                 <div style={rowBetween}>
//                   <div style={smallText}>
//                     {b.created_at
//                       ? new Date(b.created_at).toLocaleString()
//                       : ""}
//                   </div>

//                   {b.status !== "cancelled" && (
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         cancelBooking(b.id);
//                       }}
//                       style={cancelBtn}
//                     >
//                       Cancel
//                     </button>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* RIGHT PANEL */}
//       <div style={rightPanel}>
//         <div style={title}>Seat Layout</div>
//         <div style={subTitle}>Click seats to select for new booking</div>

//         {/* SEAT MAP */}
//         <div style={mapWrap}>
//           <svg width="100%" height="100%" viewBox="0 0 1000 700">
//             <rect width="100%" height="100%" fill="#020617" />

//             {(layout?.seats || []).map((seat) => {
//               const selected = selectedSeats.includes(seat.id);
//               const sold = seat.status === "sold";

//               return (
//                 <rect
//                   key={seat.id}
//                   x={seat.x_pos - 10}
//                   y={seat.y_pos - 10}
//                   width="20"
//                   height="20"
//                   rx="5"
//                   onClick={() => toggleSeat(seat)}
//                   style={{ cursor: sold ? "not-allowed" : "pointer" }}
//                   fill={
//                     selected ? "#2563EB" : sold ? "#7F1D1D" : seat.fill + "22"
//                   }
//                   stroke={selected ? "#60A5FA" : sold ? "#EF4444" : seat.fill}
//                 />
//               );
//             })}
//           </svg>
//         </div>

//         {/* NEW BOOKING INFO */}
//         {selectedSeats.length > 0 && (
//           <div style={detailCard}>
//             <div style={title}>New Booking</div>
//             <div style={detailRow}>
//               Selected Seats:
//               <span>{selectedSeats.join(", ")}</span>
//             </div>
//           </div>
//         )}

//         {/* SELECTED BOOKING DETAILS */}
//         {selectedBooking && (
//           <div style={detailCard}>
//             <div style={title}>Booking Details</div>

//             <div style={detailRow}>
//               Customer: <span>{selectedBooking.customer_name}</span>
//             </div>

//             <div style={detailRow}>
//               Mobile: <span>{selectedBooking.mobile}</span>
//             </div>

//             <div style={detailRow}>
//               Seats: <span>{activeSeats.join(", ")}</span>
//             </div>

//             <div style={detailRow}>
//               Amount: <span>₹{selectedBooking.amount}</span>
//             </div>

//             <div style={detailRow}>
//               Status: <span>{selectedBooking.status}</span>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// /* -------------------------------------------------- */
// /* COMPONENTS */
// /* -------------------------------------------------- */

// function StatCard({ label, value, blue }) {
//   return (
//     <div style={statCard}>
//       <div style={{ fontSize: 11, color: "#64748B" }}>{label}</div>
//       <div
//         style={{
//           fontSize: 22,
//           fontWeight: 800,
//           color: blue ? "#60A5FA" : "#fff",
//         }}
//       >
//         {value}
//       </div>
//     </div>
//   );
// }

// function StatusChip({ status }) {
//   let bg = "#334155";
//   let color = "#CBD5E1";

//   if (status === "paid") {
//     bg = "#14532D";
//     color = "#4ADE80";
//   }
//   if (status === "pending") {
//     bg = "#78350F";
//     color = "#FBBF24";
//   }
//   if (status === "cancelled") {
//     bg = "#7F1D1D";
//     color = "#F87171";
//   }

//   return <div style={{ ...chip, background: bg, color }}>{status}</div>;
// }

// /* -------------------------------------------------- */
// /* STYLES */
// /* -------------------------------------------------- */

// const leftPanel = {
//   borderRight: "1px solid #1E293B",
//   display: "flex",
//   flexDirection: "column",
//   overflow: "hidden",
// };

// const rightPanel = {
//   padding: 20,
//   display: "flex",
//   flexDirection: "column",
// };

// const headerBox = { padding: 16, borderBottom: "1px solid #1E293B" };

// const title = { color: "#fff", fontSize: 20, fontWeight: 800 };
// const subTitle = { color: "#64748B", fontSize: 12 };

// const statsGrid = {
//   display: "grid",
//   gridTemplateColumns: "1fr 1fr",
//   gap: 10,
//   marginTop: 12,
// };

// const searchInput = {
//   width: "100%",
//   padding: 10,
//   marginTop: 10,
//   borderRadius: 10,
//   background: "#111827",
//   border: "1px solid #1E293B",
//   color: "#fff",
// };

// const btn = {
//   marginTop: 10,
//   width: "100%",
//   padding: 12,
//   borderRadius: 10,
//   border: "none",
//   background: "#2563EB",
//   color: "#fff",
//   fontWeight: 700,
//   cursor: "pointer",
// };

// const listBox = { flex: 1, overflowY: "auto", padding: 14 };

// const bookingCard = {
//   padding: 14,
//   borderRadius: 14,
//   marginBottom: 12,
//   cursor: "pointer",
// };

// const rowBetween = {
//   display: "flex",
//   justifyContent: "space-between",
//   marginTop: 10,
// };

// const bookingNo = { color: "#60A5FA", fontWeight: 800 };
// const custName = { color: "#fff", fontWeight: 700 };
// const smallText = { color: "#64748B", fontSize: 12 };

// const seatPills = { display: "flex", gap: 6, flexWrap: "wrap" };

// const seatTag = {
//   background: "#1E293B",
//   color: "#CBD5E1",
//   padding: "4px 8px",
//   borderRadius: 8,
//   fontSize: 11,
// };

// const amount = { color: "#22C55E", fontWeight: 800 };

// const cancelBtn = {
//   background: "#7F1D1D",
//   border: "none",
//   color: "#fff",
//   padding: "6px 10px",
//   borderRadius: 8,
// };

// const mapWrap = {
//   flex: 1,
//   marginTop: 16,
//   border: "1px solid #1E293B",
//   borderRadius: 14,
//   overflow: "hidden",
// };

// const detailCard = {
//   marginTop: 16,
//   background: "#111827",
//   border: "1px solid #1E293B",
//   borderRadius: 14,
//   padding: 14,
// };

// const detailRow = {
//   display: "flex",
//   justifyContent: "space-between",
//   color: "#CBD5E1",
//   marginTop: 10,
// };

// const statCard = {
//   background: "#111827",
//   border: "1px solid #1E293B",
//   borderRadius: 12,
//   padding: 12,
// };

// const chip = {
//   padding: "4px 10px",
//   borderRadius: 20,
//   fontSize: 11,
//   fontWeight: 700,
//   textTransform: "uppercase",
// };

// const loaderWrap = {
//   height: "100%",
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   background: "#0B1120",
// };

// const loaderBox = { color: "#94A3B8" };

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

  const wrapRef = useRef(null);

  const MIN_ZOOM = 0.45;
  const MAX_ZOOM = 3;
  const SEAT_SIZE = 22;

  // Load Data
  useEffect(() => {
    const event_id = eventId || id;
    if (event_id) {
      dispatch(fetchBookingsThunk({ event_id }));
      dispatch(fetchBookingLayoutThunk(event_id));
    }
  }, [dispatch, eventId, id]);

  // Toggle Seat Selection
  const toggleSeat = useCallback((seat) => {
    if (seat.status === "sold") return;

    setSelectedSeats((prev) =>
      prev.includes(seat.id)
        ? prev.filter((id) => id !== seat.id)
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
    return bookings.filter((b) => {
      const matchSearch =
        b.customer_name?.toLowerCase().includes(q) ||
        b.mobile?.includes(q) ||
        String(b.id).includes(q);

      const matchStatus =
        statusFilter === "all" ||
        b.status?.toLowerCase() === statusFilter.toLowerCase();

      return matchSearch && matchStatus;
    });
  }, [bookings, search, statusFilter]);

  // Stats
  const stats = useMemo(() => {
    const revenue = bookings.reduce((sum, b) => sum + Number(b.amount || 0), 0);
    const paid = bookings.filter((b) => b.status === "paid").length;
    const cancelled = bookings.filter((b) => b.status === "cancelled").length;

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
  const getSeatFill = (seat) => {
    const isSelected = selectedSeats.includes(seat.id);
    if (isSelected) return "#2563EB";
    if (seat.status === "sold") return "#2a1116";
    return seat.fill ? seat.fill + "22" : "#64748B22";
  };

  const getSeatStroke = (seat) => {
    const isSelected = selectedSeats.includes(seat.id);
    if (isSelected) return "#60A5FA";
    if (seat.status === "sold") return "#7f1d1d";
    return seat.fill || "#475569";
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
                    onClick={() => toggleSeat(seat)}
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
          {filteredBookings.length === 0 ? (
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
            filteredBookings.map((booking) => (
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
        {selectedSeats.length > 0 && (
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
