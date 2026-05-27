import { useState, useMemo } from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TodayIcon from "@mui/icons-material/Today";

const STATUS_COLORS = {
  approved: "#22c55e",
  pending_approval: "#f59e0b",
  rejected: "#ef4444",
  cancelled: "#64748B",
  completed: "#3b82f6",
  draft: "#94a3b8",
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function EventCalendar({ events = [], onEventClick, user }) {
  const today = new Date();
  const [current, setCurrent] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });

  const prevMonth = () =>
    setCurrent((p) =>
      p.month === 0
        ? { year: p.year - 1, month: 11 }
        : { ...p, month: p.month - 1 },
    );

  const nextMonth = () =>
    setCurrent((p) =>
      p.month === 11
        ? { year: p.year + 1, month: 0 }
        : { ...p, month: p.month + 1 },
    );

  const goToday = () =>
    setCurrent({ year: today.getFullYear(), month: today.getMonth() });

  const calendarDays = useMemo(() => {
    const firstDay = new Date(current.year, current.month, 1);
    const lastDay = new Date(current.year, current.month + 1, 0);
    const days = [];
    for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) days.push(d);
    while (days.length % 7 !== 0) days.push(null);
    return days;
  }, [current]);

  const eventsByDate = useMemo(() => {
    const map = {};
    (events || []).forEach((ev) => {
      if (!ev.event_date) return;
      const d = new Date(ev.event_date);
      if (d.getFullYear() === current.year && d.getMonth() === current.month) {
        const key = d.getDate();
        if (!map[key]) map[key] = [];
        map[key].push(ev);
      }
    });
    return map;
  }, [events, current]);

  const isToday = (day) =>
    day === today.getDate() &&
    current.month === today.getMonth() &&
    current.year === today.getFullYear();

  return (
    <Box
      sx={{
        background: "#0F172A",
        borderRadius: 2,
        border: "1px solid #1E293B",
        overflow: "hidden",
      }}
    >
      {/* ── Header ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: "16px 20px",
          borderBottom: "1px solid #1E293B",
          background: "#1E293B",
        }}
      >
        <Typography sx={{ fontSize: 16, fontWeight: 800, color: "#F8FAFC" }}>
          {MONTHS[current.month]} {current.year}
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            size="small"
            onClick={goToday}
            sx={{
              color: "#64748B",
              border: "1px solid #334155",
              borderRadius: "8px",
              "&:hover": { color: "#2563EB", borderColor: "#2563EB55" },
            }}
          >
            <TodayIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={prevMonth}
            sx={{
              color: "#64748B",
              border: "1px solid #334155",
              borderRadius: "8px",
              "&:hover": { color: "#fff" },
            }}
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={nextMonth}
            sx={{
              color: "#64748B",
              border: "1px solid #334155",
              borderRadius: "8px",
              "&:hover": { color: "#fff" },
            }}
          >
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* ── Day Labels ── */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          borderBottom: "1px solid #1E293B",
          background: "#0b1120",
        }}
      >
        {DAYS.map((d) => (
          <Box key={d} sx={{ p: "10px 0", textAlign: "center" }}>
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 700,
                color: "#475569",
                letterSpacing: 0.5,
              }}
            >
              {d}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* ── Grid ── */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
        {calendarDays.map((day, i) => {
          const dayEvents = day ? eventsByDate[day] || [] : [];
          const todayCell = day && isToday(day);

          return (
            <Box
              key={i}
              sx={{
                minHeight: 110,
                p: "6px",
                borderRight: (i + 1) % 7 !== 0 ? "1px solid #1E293B" : "none",
                borderBottom: "1px solid #1E293B",
                background: todayCell ? "#2563EB08" : "transparent",
              }}
            >
              {day && (
                <>
                  <Box
                    sx={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: todayCell ? "#2563EB" : "transparent",
                      mb: 0.5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: todayCell ? 800 : 500,
                        color: todayCell ? "#fff" : "#64748B",
                      }}
                    >
                      {day}
                    </Typography>
                  </Box>

                  {dayEvents.slice(0, 3).map((ev) => (
                    <Tooltip
                      key={ev.id}
                      title={`${ev.title} · ${(ev.status || "").replace("_", " ")} · ₹${Number(ev.ticket_price || 0).toLocaleString("en-IN")}`}
                      arrow
                      placement="top"
                    >
                      <Box
                        onClick={() => onEventClick && onEventClick(ev)}
                        sx={{
                          mb: 0.4,
                          px: "6px",
                          py: "2px",
                          borderRadius: "4px",
                          background:
                            (STATUS_COLORS[ev.status] || "#64748B") + "22",
                          border: `1px solid ${STATUS_COLORS[ev.status] || "#64748B"}44`,
                          cursor: "pointer",
                          transition: "all 0.15s",
                          "&:hover": {
                            background:
                              (STATUS_COLORS[ev.status] || "#64748B") + "44",
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: 10,
                            fontWeight: 600,
                            color: STATUS_COLORS[ev.status] || "#94A3B8",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {ev.title}
                        </Typography>
                      </Box>
                    </Tooltip>
                  ))}

                  {dayEvents.length > 3 && (
                    <Typography
                      sx={{ fontSize: 9, color: "#475569", pl: "6px", mt: 0.2 }}
                    >
                      +{dayEvents.length - 3} more
                    </Typography>
                  )}
                </>
              )}
            </Box>
          );
        })}
      </Box>

      {/* ── Legend ── */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          p: "12px 20px",
          borderTop: "1px solid #1E293B",
          flexWrap: "wrap",
          background: "#0b1120",
        }}
      >
        {Object.entries(STATUS_COLORS).map(([status, color]) => (
          <Box
            key={status}
            sx={{ display: "flex", alignItems: "center", gap: 0.6 }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "2px",
                background: color,
              }}
            />
            <Typography
              sx={{
                fontSize: 10,
                color: "#64748B",
                textTransform: "capitalize",
              }}
            >
              {status.replace("_", " ")}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
