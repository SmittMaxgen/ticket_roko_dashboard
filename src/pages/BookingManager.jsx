import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  fetchBookingsThunk,
  fetchBookingByIdThunk,
  cancelBookingThunk,
  fetchBookingStatsThunk,
  createBookingThunk,
  fetchBookingLayoutThunk,
} from "../features/bookings/bookingThunks";

import {
  selectBookingLayout,
  selectBookingList,
  selectBookingLoading,
  selectIsBookingCreating,
} from "../features/bookings/bookingSelectors";

import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

export default function BookingManager({ eventId }) {
  const dispatch = useDispatch();
  const { id } = useParams();

  // const [layout, setLayout] = useState(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);

  // ✅ NEW STATE (seat booking)
  const [selectedSeats, setSelectedSeats] = useState([]);
  // const [creating, setCreating] = useState(false);
  const layout = useSelector(selectBookingLayout);

  const bookings = useSelector(selectBookingList);
  const loading = useSelector(selectBookingLoading);
  const creating = useSelector(selectIsBookingCreating);

  const API = "https://ticket-roko-dashboard.vercel.app/api";

  // --------------------------------------------------
  // LOAD DATA
  // --------------------------------------------------
  useEffect(() => {
    loadAll();
  }, [eventId, id]);
  const loadAll = async () => {
    try {
      await Promise.all([
        dispatch(fetchBookingsThunk({ event_id: eventId || id })),
        dispatch(fetchBookingLayoutThunk(eventId || id)),
      ]);
    } catch (err) {
      console.error(err);
    }
  };
  // --------------------------------------------------
  // TOGGLE SEAT (NEW)
  // --------------------------------------------------
  const toggleSeat = (seat) => {
    if (seat.status === "sold") return;

    setSelectedSeats((prev) => {
      const exists = prev.includes(seat.id);
      if (exists) return prev.filter((id) => id !== seat.id);
      return [...prev, seat.id];
    });
  };

  // --------------------------------------------------
  // CREATE BOOKING (NEW)
  // --------------------------------------------------
  const createBooking = async () => {
    if (!selectedSeats.length) return;

    try {
      setCreating(true);

      dispatch(
        createBookingThunk({
          event_id: eventId || id,
          seat_ids: selectedSeats,
        }),
      );

      setSelectedSeats([]);
      await loadAll();
    } catch (err) {
      console.error(err);
      alert("Booking failed");
    } finally {
      setCreating(false);
    }
  };

  // --------------------------------------------------
  // FILTER
  // --------------------------------------------------
  const filtered = useMemo(() => {
    return bookings?.filter((b) => {
      const q = search.toLowerCase();

      const matchSearch =
        b.customer_name?.toLowerCase().includes(q) ||
        b.mobile?.includes(q) ||
        String(b.id).includes(q);

      const matchStatus =
        status === "all"
          ? true
          : b.status?.toLowerCase() === status.toLowerCase();

      return matchSearch && matchStatus;
    });
  }, [bookings, search, status]);

  // --------------------------------------------------
  // STATS
  // --------------------------------------------------
  const stats = useMemo(() => {
    const revenue = bookings.reduce((a, b) => a + Number(b.amount || 0), 0);
    const paid = bookings.filter((x) => x.status === "paid").length;
    const cancelled = bookings.filter((x) => x.status === "cancelled").length;

    return {
      total: bookings.length,
      paid,
      cancelled,
      revenue,
    };
  }, [bookings]);

  // --------------------------------------------------
  // ACTIVE SEATS FROM BOOKING
  // --------------------------------------------------
  const activeSeats = useMemo(() => {
    if (!selectedBooking) return [];
    return selectedBooking.seats || [];
  }, [selectedBooking]);

  // --------------------------------------------------
  // CANCEL BOOKING
  // --------------------------------------------------
  const cancelBooking = async (id) => {
    try {
      await dispatch(cancelBookingThunk(id)).unwrap();
      await dispatch(fetchBookingLayoutThunk(eventId || id));
    } catch (err) {
      alert(err || "Cancel failed");
    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------
  if (loading) {
    return (
      <div style={loaderWrap}>
        <div style={loaderBox}>Loading bookings...</div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "430px 1fr",
        height: "100%",
        background: "#0B1120",
      }}
    >
      {/* LEFT PANEL */}
      <div style={leftPanel}>
        {/* HEADER */}
        <div style={headerBox}>
          <div style={title}>Booking Manager</div>
          <div style={subTitle}>Event ID: {eventId}</div>

          {/* STATS */}
          <div style={statsGrid}>
            <StatCard label="Total" value={stats.total} />
            <StatCard label="Paid" value={stats.paid} />
            <StatCard label="Cancelled" value={stats.cancelled} />
            <StatCard label="Revenue" value={`₹${stats.revenue}`} blue />
          </div>

          {/* SEARCH */}
          <input
            placeholder="Search booking / mobile / customer"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={searchInput}
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={searchInput}
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* CREATE BOOKING BUTTON */}
          {selectedSeats.length > 0 && (
            <button onClick={createBooking} disabled={creating} style={btn}>
              {creating
                ? "Creating..."
                : `Create Booking (${selectedSeats.length})`}
            </button>
          )}
        </div>

        {/* BOOKING LIST */}
        <div style={listBox}>
          {filtered.map((b) => {
            const active = selectedBooking?.id === b.id;

            return (
              <div
                key={b.id}
                onClick={() => setSelectedBooking(b)}
                style={{
                  ...bookingCard,
                  border: active ? "1px solid #2563EB" : "1px solid #1E293B",
                  background: active ? "#0F172A" : "#111827",
                }}
              >
                <div style={rowBetween}>
                  <div style={bookingNo}>#{b.id}</div>
                  <StatusChip status={b.status} />
                </div>

                <div style={custName}>{b.customer_name}</div>
                <div style={smallText}>{b.mobile}</div>

                <div style={rowBetween}>
                  <div style={seatPills}>
                    {(b.seats || []).map((s) => (
                      <span key={s} style={seatTag}>
                        {s}
                      </span>
                    ))}
                  </div>
                  <div style={amount}>₹{b.amount}</div>
                </div>

                <div style={rowBetween}>
                  <div style={smallText}>
                    {b.created_at
                      ? new Date(b.created_at).toLocaleString()
                      : ""}
                  </div>

                  {b.status !== "cancelled" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        cancelBooking(b.id);
                      }}
                      style={cancelBtn}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={rightPanel}>
        <div style={title}>Seat Layout</div>
        <div style={subTitle}>Click seats to select for new booking</div>

        {/* SEAT MAP */}
        <div style={mapWrap}>
          <svg width="100%" height="100%" viewBox="0 0 1000 700">
            <rect width="100%" height="100%" fill="#020617" />

            {(layout?.seats || []).map((seat) => {
              const selected = selectedSeats.includes(seat.id);
              const sold = seat.status === "sold";

              return (
                <rect
                  key={seat.id}
                  x={seat.x_pos - 10}
                  y={seat.y_pos - 10}
                  width="20"
                  height="20"
                  rx="5"
                  onClick={() => toggleSeat(seat)}
                  style={{ cursor: sold ? "not-allowed" : "pointer" }}
                  fill={
                    selected ? "#2563EB" : sold ? "#7F1D1D" : seat.fill + "22"
                  }
                  stroke={selected ? "#60A5FA" : sold ? "#EF4444" : seat.fill}
                />
              );
            })}
          </svg>
        </div>

        {/* NEW BOOKING INFO */}
        {selectedSeats.length > 0 && (
          <div style={detailCard}>
            <div style={title}>New Booking</div>
            <div style={detailRow}>
              Selected Seats:
              <span>{selectedSeats.join(", ")}</span>
            </div>
          </div>
        )}

        {/* SELECTED BOOKING DETAILS */}
        {selectedBooking && (
          <div style={detailCard}>
            <div style={title}>Booking Details</div>

            <div style={detailRow}>
              Customer: <span>{selectedBooking.customer_name}</span>
            </div>

            <div style={detailRow}>
              Mobile: <span>{selectedBooking.mobile}</span>
            </div>

            <div style={detailRow}>
              Seats: <span>{activeSeats.join(", ")}</span>
            </div>

            <div style={detailRow}>
              Amount: <span>₹{selectedBooking.amount}</span>
            </div>

            <div style={detailRow}>
              Status: <span>{selectedBooking.status}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------- */
/* COMPONENTS */
/* -------------------------------------------------- */

function StatCard({ label, value, blue }) {
  return (
    <div style={statCard}>
      <div style={{ fontSize: 11, color: "#64748B" }}>{label}</div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: blue ? "#60A5FA" : "#fff",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function StatusChip({ status }) {
  let bg = "#334155";
  let color = "#CBD5E1";

  if (status === "paid") {
    bg = "#14532D";
    color = "#4ADE80";
  }
  if (status === "pending") {
    bg = "#78350F";
    color = "#FBBF24";
  }
  if (status === "cancelled") {
    bg = "#7F1D1D";
    color = "#F87171";
  }

  return <div style={{ ...chip, background: bg, color }}>{status}</div>;
}

/* -------------------------------------------------- */
/* STYLES */
/* -------------------------------------------------- */

const leftPanel = {
  borderRight: "1px solid #1E293B",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

const rightPanel = {
  padding: 20,
  display: "flex",
  flexDirection: "column",
};

const headerBox = { padding: 16, borderBottom: "1px solid #1E293B" };

const title = { color: "#fff", fontSize: 20, fontWeight: 800 };
const subTitle = { color: "#64748B", fontSize: 12 };

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 10,
  marginTop: 12,
};

const searchInput = {
  width: "100%",
  padding: 10,
  marginTop: 10,
  borderRadius: 10,
  background: "#111827",
  border: "1px solid #1E293B",
  color: "#fff",
};

const btn = {
  marginTop: 10,
  width: "100%",
  padding: 12,
  borderRadius: 10,
  border: "none",
  background: "#2563EB",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};

const listBox = { flex: 1, overflowY: "auto", padding: 14 };

const bookingCard = {
  padding: 14,
  borderRadius: 14,
  marginBottom: 12,
  cursor: "pointer",
};

const rowBetween = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: 10,
};

const bookingNo = { color: "#60A5FA", fontWeight: 800 };
const custName = { color: "#fff", fontWeight: 700 };
const smallText = { color: "#64748B", fontSize: 12 };

const seatPills = { display: "flex", gap: 6, flexWrap: "wrap" };

const seatTag = {
  background: "#1E293B",
  color: "#CBD5E1",
  padding: "4px 8px",
  borderRadius: 8,
  fontSize: 11,
};

const amount = { color: "#22C55E", fontWeight: 800 };

const cancelBtn = {
  background: "#7F1D1D",
  border: "none",
  color: "#fff",
  padding: "6px 10px",
  borderRadius: 8,
};

const mapWrap = {
  flex: 1,
  marginTop: 16,
  border: "1px solid #1E293B",
  borderRadius: 14,
  overflow: "hidden",
};

const detailCard = {
  marginTop: 16,
  background: "#111827",
  border: "1px solid #1E293B",
  borderRadius: 14,
  padding: 14,
};

const detailRow = {
  display: "flex",
  justifyContent: "space-between",
  color: "#CBD5E1",
  marginTop: 10,
};

const statCard = {
  background: "#111827",
  border: "1px solid #1E293B",
  borderRadius: 12,
  padding: 12,
};

const chip = {
  padding: "4px 10px",
  borderRadius: 20,
  fontSize: 11,
  fontWeight: 700,
  textTransform: "uppercase",
};

const loaderWrap = {
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#0B1120",
};

const loaderBox = { color: "#94A3B8" };
