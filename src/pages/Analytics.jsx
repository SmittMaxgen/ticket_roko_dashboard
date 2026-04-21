// ── Analytics.jsx ─────────────────────────────────────────
import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import api from "../api/axios";

export function Analytics() {
  const [revenue, setRevenue] = useState([]);
  const [topEvents, setTopEvents] = useState([]);
  const [catStats, setCatStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/dashboard/revenue-chart?period=30"),
      api.get("/dashboard/top-events"),
      api.get("/dashboard/category-stats"),
    ])
      .then(([rv, te, cs]) => {
        setRevenue(
          rv.data.data.map((d) => ({ ...d, revenue: +d.revenue || 0 })),
        );
        setTopEvents(te.data.data);
        setCatStats(cs.data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const COLORS = [
    "#2563EB",
    "#f59e0b",
    "#22c55e",
    "#f472b6",
    "#14b8a6",
    "#8b5cf6",
    "#ef4444",
    "#f97316",
  ];

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", pt: 10 }}>
        <CircularProgress sx={{ color: "#2563EB" }} />
      </Box>
    );

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ color: "#F8FAFC" }}>
          Analytics
        </Typography>
        <Typography sx={{ color: "#64748B", fontSize: 13 }}>
          Sales, revenue and event performance reports
        </Typography>
      </Box>

      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ background: "#1E293B", height: 320 }}>
            <CardContent sx={{ height: "100%", pb: "16px !important" }}>
              <Typography
                sx={{ fontSize: 14, fontWeight: 600, color: "#F8FAFC", mb: 2 }}
              >
                Daily Revenue — Last 30 days
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={revenue}>
                  <defs>
                    <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#64748B", fontSize: 10 }}
                    tickFormatter={(d) => d?.slice(5)}
                  />
                  <YAxis
                    tick={{ fill: "#64748B", fontSize: 10 }}
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#0F172A",
                      border: "1px solid #334155",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    formatter={(v) => [
                      `₹${Number(v).toLocaleString("en-IN")}`,
                      "Revenue",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2563EB"
                    strokeWidth={2}
                    fill="url(#rg)"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={{ background: "#1E293B", height: 320 }}>
            <CardContent sx={{ height: "100%", pb: "16px !important" }}>
              <Typography
                sx={{ fontSize: 14, fontWeight: 600, color: "#F8FAFC", mb: 1 }}
              >
                Revenue by Category
              </Typography>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={catStats}
                    cx="50%"
                    cy="45%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="revenue"
                    nameKey="name"
                    paddingAngle={3}
                  >
                    {catStats.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend
                    iconSize={8}
                    wrapperStyle={{ fontSize: 11, color: "#94A3B8" }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#0F172A",
                      border: "1px solid #334155",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    formatter={(v) => [
                      `₹${Number(v || 0).toLocaleString("en-IN")}`,
                      "Revenue",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ background: "#1E293B" }}>
        <CardContent>
          <Typography
            sx={{ fontSize: 14, fontWeight: 600, color: "#F8FAFC", mb: 2 }}
          >
            Top Events by Revenue
          </Typography>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={topEvents.slice(0, 8)}
              layout="vertical"
              margin={{ left: 10 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#334155"
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fill: "#64748B", fontSize: 11 }}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              />
              <YAxis
                type="category"
                dataKey="title"
                tick={{ fill: "#94A3B8", fontSize: 11 }}
                width={140}
                tickFormatter={(v) =>
                  v?.length > 20 ? v.slice(0, 20) + "…" : v
                }
              />
              <Tooltip
                contentStyle={{
                  background: "#0F172A",
                  border: "1px solid #334155",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(v) => [
                  `₹${Number(v).toLocaleString("en-IN")}`,
                  "Revenue",
                ]}
              />
              <Bar dataKey="revenue" fill="#2563EB" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Analytics;
