import { useState, useRef, useCallback } from "react";

const MODES = ["Book Seats", "Admin: Draw Mode"];

const INIT_SECTIONS = [
  {
    id: "premium",
    label: "PREMIUM",
    color: "#f59e0b",
    price: 800,
    rows: [
      {
        label: "A",
        seats: Array.from({ length: 12 }, (_, i) => ({
          id: `A${i + 1}`,
          num: i + 1,
          status: i === 3 || i === 7 ? "booked" : "available",
        })),
      },
      {
        label: "B",
        seats: Array.from({ length: 12 }, (_, i) => ({
          id: `B${i + 1}`,
          num: i + 1,
          status: i === 5 ? "booked" : "available",
        })),
      },
    ],
  },
  {
    id: "executive",
    label: "EXECUTIVE",
    color: "#818cf8",
    price: 500,
    rows: [
      {
        label: "C",
        seats: Array.from({ length: 16 }, (_, i) => ({
          id: `C${i + 1}`,
          num: i + 1,
          status: i === 2 || i === 9 || i === 10 ? "booked" : "available",
        })),
      },
      {
        label: "D",
        seats: Array.from({ length: 16 }, (_, i) => ({
          id: `D${i + 1}`,
          num: i + 1,
          status: i === 6 ? "booked" : "available",
        })),
      },
      {
        label: "E",
        seats: Array.from({ length: 16 }, (_, i) => ({
          id: `E${i + 1}`,
          num: i + 1,
          status: i === 1 || i === 14 ? "booked" : "available",
        })),
      },
    ],
  },
  {
    id: "general",
    label: "GENERAL",
    color: "#34d399",
    price: 250,
    rows: [
      {
        label: "F",
        seats: Array.from({ length: 20 }, (_, i) => ({
          id: `F${i + 1}`,
          num: i + 1,
          status: i === 0 || i === 11 ? "booked" : "available",
        })),
      },
      {
        label: "G",
        seats: Array.from({ length: 20 }, (_, i) => ({
          id: `G${i + 1}`,
          num: i + 1,
          status: i === 7 || i === 8 ? "booked" : "available",
        })),
      },
      {
        label: "H",
        seats: Array.from({ length: 20 }, (_, i) => ({
          id: `H${i + 1}`,
          num: i + 1,
          status: i === 4 || i === 19 ? "booked" : "available",
        })),
      },
      {
        label: "I",
        seats: Array.from({ length: 20 }, (_, i) => ({
          id: `I${i + 1}`,
          num: i + 1,
          status: i === 9 || i === 10 ? "booked" : "available",
        })),
      },
    ],
  },
];

const DRAW_TOOLS = [
  { id: "row", icon: "▬", label: "Add Row" },
  { id: "seat", icon: "◻", label: "Add Seat" },
  { id: "erase", icon: "⌫", label: "Erase" },
];

const DRAW_SECTIONS = [
  { id: "premium", label: "Premium", color: "#f59e0b" },
  { id: "executive", label: "Executive", color: "#818cf8" },
  { id: "general", label: "General", color: "#34d399" },
  { id: "vip", label: "VIP", color: "#f472b6" },
];

const SEAT_SHAPES = [
  { id: "rounded", r: 4, label: "Rounded" },
  { id: "square", r: 1, label: "Square" },
  { id: "circle", r: 11, label: "Circle" },
];

const S = 22;
const GAP = 5;

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

function BookingView({ sections: initSections }) {
  const [sections, setSections] = useState(() =>
    initSections.map((s) => ({
      ...s,
      rows: s.rows.map((r) => ({
        ...r,
        seats: r.seats.map((seat) => ({ ...seat })),
      })),
    })),
  );
  const [selected, setSelected] = useState([]);
  const [zoom, setZoom] = useState(1);
  const [tooltip, setTooltip] = useState(null);

  const toggleSeat = useCallback((secId, rowLabel, seatId) => {
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id !== secId) return sec;
        return {
          ...sec,
          rows: sec.rows.map((row) => {
            if (row.label !== rowLabel) return row;
            return {
              ...row,
              seats: row.seats.map((seat) => {
                if (seat.id !== seatId || seat.status === "booked") return seat;
                return {
                  ...seat,
                  status: seat.status === "selected" ? "available" : "selected",
                };
              }),
            };
          }),
        };
      }),
    );
    setSelected((prev) => {
      const sec = initSections.find((s) => s.id === secId);
      const key = `${secId}:${seatId}`;
      if (prev.find((s) => s.key === key))
        return prev.filter((s) => s.key !== key);
      return [
        ...prev,
        {
          key,
          secId,
          seatId,
          rowLabel,
          price: sec?.price || 0,
          color: sec?.color || "#fff",
        },
      ];
    });
  }, []);

  const total = selected.reduce((a, s) => a + s.price, 0);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 300px",
        height: "100%",
      }}
    >
      <div
        style={{
          background: "#0d0d14",
          overflowY: "auto",
          padding: "24px 20px",
        }}
      >
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
                background: zoom === z ? "#f59e0b" : "#1e1e2a",
                color: zoom === z ? "#000" : "#888",
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
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div
              style={{
                width: 340,
                height: 6,
                background:
                  "linear-gradient(90deg,transparent,#fff8,transparent)",
                borderRadius: 50,
                margin: "0 auto 6px",
              }}
            />
            <div
              style={{
                fontSize: 11,
                color: "#666",
                letterSpacing: 3,
                fontWeight: 500,
              }}
            >
              SCREEN
            </div>
          </div>
          {sections.map((sec) => (
            <div key={sec.id} style={{ marginBottom: 28 }}>
              <div style={{ textAlign: "center", marginBottom: 10 }}>
                <span
                  style={{
                    fontSize: 11,
                    color: sec.color,
                    letterSpacing: 2,
                    fontWeight: 600,
                    background: sec.color + "15",
                    padding: "3px 16px",
                    borderRadius: 20,
                    border: `1px solid ${sec.color}33`,
                  }}
                >
                  {sec.label} · ₹{sec.price}
                </span>
              </div>
              {sec.rows.map((row) => (
                <div
                  key={row.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 5,
                    marginBottom: 6,
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      color: "#444",
                      width: 18,
                      textAlign: "right",
                      fontFamily: "monospace",
                    }}
                  >
                    {row.label}
                  </span>
                  <div style={{ display: "flex", gap: 4 }}>
                    {row.seats.map((seat, si) => (
                      <div
                        key={seat.id}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        {sec.id === "general" && si === 9 && (
                          <div style={{ width: 14 }} />
                        )}
                        <div
                          onMouseEnter={(e) =>
                            setTooltip({
                              sec: sec.label,
                              row: row.label,
                              num: seat.num,
                              price: sec.price,
                              status: seat.status,
                              x: e.clientX,
                              y: e.clientY,
                            })
                          }
                          onMouseLeave={() => setTooltip(null)}
                          onClick={() => toggleSeat(sec.id, row.label, seat.id)}
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius:
                              seat.status === "selected" ? "50%" : "6px",
                            background:
                              seat.status === "booked"
                                ? "#1e1215"
                                : seat.status === "selected"
                                  ? sec.color
                                  : sec.color + "22",
                            border: `1.5px solid ${seat.status === "booked" ? "#4a1a2244" : seat.status === "selected" ? sec.color : sec.color + "55"}`,
                            cursor:
                              seat.status === "booked"
                                ? "not-allowed"
                                : "pointer",
                            transition: "all 0.15s",
                            transform:
                              seat.status === "selected"
                                ? "scale(1.1)"
                                : "scale(1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 8,
                            color:
                              seat.status === "selected"
                                ? "#000"
                                : "transparent",
                            fontWeight: 700,
                          }}
                        >
                          {seat.status === "selected" ? "✓" : ""}
                        </div>
                      </div>
                    ))}
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      color: "#444",
                      width: 18,
                      fontFamily: "monospace",
                    }}
                  >
                    {row.label}
                  </span>
                </div>
              ))}
            </div>
          ))}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 20,
              marginTop: 24,
              paddingTop: 20,
              borderTop: "1px solid #1e1e2a",
            }}
          >
            {[
              { label: "Available", bg: "#1e1e2a", border: "#444" },
              { label: "Selected", bg: "#f59e0b", border: "#f59e0b" },
              { label: "Booked", bg: "#1e1215", border: "#4a1a2244" },
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

      <div
        style={{
          background: "#13131c",
          borderLeft: "1px solid #1e1e2a",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{ padding: "20px 18px", borderBottom: "1px solid #1e1e2a" }}
        >
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>
            Grand Auditorium
          </div>
          <div style={{ fontSize: 12, color: "#666" }}>
            Saturday, 15 Mar · 7:30 PM
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            {sections.map((s) => {
              const avail = s.rows
                .flatMap((r) => r.seats)
                .filter((seat) => seat.status === "available").length;
              return (
                <div
                  key={s.id}
                  style={{
                    flex: 1,
                    background: s.color + "11",
                    borderRadius: 8,
                    padding: "8px 6px",
                    textAlign: "center",
                    border: `1px solid ${s.color}22`,
                  }}
                >
                  <div
                    style={{ fontSize: 16, fontWeight: 700, color: s.color }}
                  >
                    {avail}
                  </div>
                  <div style={{ fontSize: 9, color: "#666", marginTop: 2 }}>
                    {s.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px" }}>
          <div
            style={{
              fontSize: 12,
              color: "#666",
              fontWeight: 600,
              marginBottom: 10,
              letterSpacing: 1,
            }}
          >
            SELECTED SEATS
          </div>
          {selected.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "32px 0",
                color: "#444",
                fontSize: 13,
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>🎭</div>Click seats
              to select
            </div>
          ) : (
            selected.map((s) => (
              <div
                key={s.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#1a1a24",
                  borderRadius: 8,
                  padding: "10px 12px",
                  marginBottom: 6,
                  border: `1px solid ${s.color}22`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: s.color,
                    }}
                  />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>
                    Row {s.rowLabel} · {s.seatId}
                  </span>
                </div>
                <span style={{ fontSize: 13, color: s.color, fontWeight: 700 }}>
                  ₹{s.price}
                </span>
              </div>
            ))
          )}
        </div>
        <div style={{ padding: "16px 18px", borderTop: "1px solid #1e1e2a" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 13,
              marginBottom: 4,
            }}
          >
            <span style={{ color: "#888" }}>Subtotal</span>
            <span style={{ fontWeight: 600 }}>₹{total}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 12,
              marginBottom: 14,
            }}
          >
            <span style={{ color: "#555" }}>Convenience fee</span>
            <span style={{ color: "#555" }}>₹{Math.round(total * 0.05)}</span>
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
            <span>Total</span>
            <span style={{ color: "#f59e0b" }}>
              ₹{total + Math.round(total * 0.05)}
            </span>
          </div>
          <button
            disabled={selected.length === 0}
            style={{
              width: "100%",
              background: selected.length > 0 ? "#f59e0b" : "#1e1e2a",
              color: selected.length > 0 ? "#000" : "#444",
              border: "none",
              borderRadius: 10,
              padding: "13px",
              fontWeight: 700,
              fontSize: 14,
              cursor: selected.length > 0 ? "pointer" : "not-allowed",
              transition: "all 0.2s",
            }}
          >
            {selected.length > 0 ? "Proceed to Pay  →" : "Select Seats"}
          </button>
        </div>
      </div>

      {tooltip && (
        <div
          style={{
            position: "fixed",
            left: tooltip.x + 12,
            top: tooltip.y - 60,
            background: "#1e1e2a",
            border: "1px solid #2a2a3a",
            borderRadius: 8,
            padding: "8px 12px",
            fontSize: 12,
            pointerEvents: "none",
            zIndex: 9999,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 2 }}>
            {tooltip.sec} · Row {tooltip.row} · Seat {tooltip.num}
          </div>
          <div
            style={{
              color: tooltip.status === "booked" ? "#ef4444" : "#f59e0b",
            }}
          >
            {tooltip.status === "booked"
              ? "Already Booked"
              : `₹${tooltip.price}`}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Draw Mode ────────────────────────────────────────────────────────────────
function DrawMode() {
  const svgRef = useRef(null);
  const [tool, setTool] = useState("row");
  const [activeSec, setActiveSec] = useState("premium");
  const [seatShape, setSeatShape] = useState("rounded");
  const [drawing, setDrawing] = useState(false);
  const [startPos, setStartPos] = useState(null);
  const [liveEnd, setLiveEnd] = useState(null);
  const [placedRows, setPlacedRows] = useState([]);
  const [placedSeats, setPlacedSeats] = useState([]);
  const [hoverPos, setHoverPos] = useState(null);

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
        setPlacedRows((prev) => [
          ...prev,
          {
            id: `r${Date.now()}`,
            pts,
            color: sec.color,
            sectionId: activeSec,
            shape: seatShape,
            label: sec.label,
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
      const RADIUS = 20;
      setPlacedRows((prev) =>
        prev.filter(
          (row) =>
            !row.pts.some((p) => Math.hypot(p.x - pos.x, p.y - pos.y) < RADIUS),
        ),
      );
      setPlacedSeats((prev) =>
        prev.filter((s) => Math.hypot(s.x - pos.x, s.y - pos.y) >= RADIUS),
      );
    }

    setDrawing(false);
    setStartPos(null);
    setLiveEnd(null);
  };

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
    placedRows.reduce((a, row) => a + row.pts.length, 0) + placedSeats.length;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "185px 1fr 205px",
        height: "100%",
      }}
    >
      {/* Left toolbar */}
      <div
        style={{
          background: "#13131c",
          borderRight: "1px solid #1e1e2a",
          padding: 14,
          display: "flex",
          flexDirection: "column",
          gap: 18,
          overflowY: "auto",
        }}
      >
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
                background: tool === t.id ? "#1e1e2e" : "transparent",
                border: `1px solid ${tool === t.id ? "#6366f1" : "transparent"}`,
                borderRadius: 8,
                color: tool === t.id ? "#fff" : "#666",
                cursor: "pointer",
                marginBottom: 4,
                fontSize: 13,
                fontWeight: tool === t.id ? 600 : 400,
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: 15 }}>{t.icon}</span> {t.label}
            </button>
          ))}
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
            SECTION
          </div>
          {DRAW_SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSec(s.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 10px",
                background: activeSec === s.id ? s.color + "22" : "transparent",
                border: `1px solid ${activeSec === s.id ? s.color + "66" : "transparent"}`,
                borderRadius: 8,
                color: activeSec === s.id ? s.color : "#666",
                cursor: "pointer",
                marginBottom: 4,
                fontSize: 12,
                fontWeight: activeSec === s.id ? 600 : 400,
                transition: "all 0.15s",
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: s.color,
                  flexShrink: 0,
                }}
              />{" "}
              {s.label}
            </button>
          ))}
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
                background: seatShape === s.id ? "#1e1e2e" : "transparent",
                border: `1px solid ${seatShape === s.id ? "#6366f1" : "transparent"}`,
                borderRadius: 8,
                color: seatShape === s.id ? "#fff" : "#666",
                cursor: "pointer",
                marginBottom: 4,
                fontSize: 12,
                transition: "all 0.15s",
              }}
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  background: seatShape === s.id ? "#6366f1" : "#333",
                  borderRadius: s.r >= 10 ? "50%" : s.r + "px",
                  flexShrink: 0,
                }}
              />{" "}
              {s.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            setPlacedRows([]);
            setPlacedSeats([]);
          }}
          style={{
            marginTop: "auto",
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

      {/* SVG Canvas */}
      <div
        style={{
          background: "#0d0d14",
          overflow: "hidden",
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "8px 16px",
            borderBottom: "1px solid #1a1a24",
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexShrink: 0,
            minHeight: 36,
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#22c55e",
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 12, color: "#555" }}>
            {tool === "row" &&
              "Click & drag freely in any direction — seats follow your path at any angle"}
            {tool === "seat" && "Click anywhere to drop a single seat"}
            {tool === "erase" && "Click on any seat or row to erase it"}
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
          {/* Dot grid */}
          <defs>
            <pattern
              id="dotgrid"
              width="27"
              height="27"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1" cy="1" r="1" fill="#2a2a35" />
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

          {/* Placed individual seats */}
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

          {/* Guide line while dragging */}
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

          {/* Live preview seats */}
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

          {/* Start anchor dot */}
          {drawing && startPos && (
            <circle
              cx={startPos.x}
              cy={startPos.y}
              r={5}
              fill={secColor}
              opacity={0.9}
            />
          )}

          {/* Single seat hover ghost */}
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

          {/* Eraser radius indicator */}
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

      {/* Right summary */}
      <div
        style={{
          background: "#13131c",
          borderLeft: "1px solid #1e1e2a",
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 16,
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
          <div style={{ background: "#0d0d14", borderRadius: 10, padding: 14 }}>
            {[
              { label: "Total seats", value: totalSeats, color: "#f59e0b" },
              { label: "Rows placed", value: placedRows.length, color: "#fff" },
              { label: "Individual", value: placedSeats.length, color: "#fff" },
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
                <span style={{ color: "#888" }}>{row.label}</span>
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
              marginBottom: 10,
              fontWeight: 600,
            }}
          >
            SECTIONS USED
          </div>
          {DRAW_SECTIONS.map((s) => {
            const cnt =
              placedRows
                .filter((r) => r.sectionId === s.id)
                .reduce((a, r) => a + r.pts.length, 0) +
              placedSeats.filter((p) => p.sectionId === s.id).length;
            if (cnt === 0) return null;
            return (
              <div
                key={s.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: s.color,
                    }}
                  />
                  <span style={{ fontSize: 12, color: "#888" }}>{s.label}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: s.color }}>
                  {cnt}
                </span>
              </div>
            );
          })}
          {totalSeats === 0 && (
            <div
              style={{
                fontSize: 12,
                color: "#333",
                textAlign: "center",
                padding: "16px 0",
              }}
            >
              No seats placed yet
            </div>
          )}
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
            ANGLE GUIDE
          </div>
          <svg width="100%" viewBox="0 0 160 90">
            {[0, 45, 90, 135, -45, -90, -135, 180].map((deg) => {
              const rad = (deg * Math.PI) / 180;
              const cx = 80,
                cy = 45,
                len = 30;
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
                    x={cx + Math.cos(rad) * (len + 12)}
                    y={cy + Math.sin(rad) * (len + 12) + 3}
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
                x2={80 + Math.cos((angleNow * Math.PI) / 180) * 28}
                y2={45 + Math.sin((angleNow * Math.PI) / 180) * 28}
                stroke={secColor}
                strokeWidth={2}
                opacity={0.9}
              />
            )}
          </svg>
          <div
            style={{
              fontSize: 10,
              color: "#444",
              textAlign: "center",
              marginTop: 2,
            }}
          >
            {angleNow !== null ? `Current: ${angleNow}°` : "Drag any direction"}
          </div>
        </div>

        <div style={{ marginTop: "auto" }}>
          <button
            disabled={totalSeats === 0}
            style={{
              width: "100%",
              background: totalSeats > 0 ? "#f59e0b" : "#1e1e2a",
              color: totalSeats > 0 ? "#000" : "#444",
              border: "none",
              borderRadius: 10,
              padding: "12px",
              fontWeight: 700,
              fontSize: 13,
              cursor: totalSeats > 0 ? "pointer" : "not-allowed",
              transition: "all 0.2s",
            }}
          >
            Save Layout →
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
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
      <div
        style={{
          background: "#13131c",
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
              background: "linear-gradient(135deg,#f59e0b,#ef4444)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
            }}
          >
            🎭
          </div>
          <span style={{ fontWeight: 700, fontSize: 15 }}>HallDesk</span>
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
              borderBottom: `2px solid ${mode === i ? "#f59e0b" : "transparent"}`,
              color: mode === i ? "#fff" : "#666",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: mode === i ? 600 : 400,
              transition: "all 0.2s",
            }}
          >
            {m}
          </button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <div
            style={{
              fontSize: 12,
              background: "#1e1e2a",
              padding: "4px 12px",
              borderRadius: 20,
              color: "#888",
            }}
          >
            Grand Auditorium
          </div>
          <div
            style={{
              fontSize: 12,
              background: "#f59e0b22",
              border: "1px solid #f59e0b44",
              padding: "4px 12px",
              borderRadius: 20,
              color: "#f59e0b",
            }}
          >
            Sat, 15 Mar · 7:30 PM
          </div>
        </div>
      </div>
      <div style={{ flex: 1, overflow: "hidden" }}>
        {mode === 0 ? <BookingView sections={INIT_SECTIONS} /> : <DrawMode />}
      </div>
    </div>
  );
}
