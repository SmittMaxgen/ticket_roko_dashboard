// ── Bookings.jsx ──────────────────────────────────────────
import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Tab,
  Tabs,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  DialogActions,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/VisibilityOutlined";
import CancelIcon from "@mui/icons-material/CancelOutlined";
import api from "../api/axios";
import { useSnackbar } from "notistack";

const PAY_COLOR = {
  paid: "success",
  pending: "warning",
  failed: "error",
  refunded: "info",
};
const STATUS_COLOR = {
  confirmed: "success",
  pending: "warning",
  cancelled: "error",
};

export function Bookings() {
  const { enqueueSnackbar } = useSnackbar();
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [detail, setDetail] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: page + 1, limit: 20, search };
      if (tab !== "all") params.status = tab;
      const { data } = await api.get("/bookings", { params });
      setRows(data.data);
      setTotal(data.total);
    } catch {
      enqueueSnackbar("Failed to load", { variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [page, search, tab]);

  useEffect(() => {
    load();
  }, [load]);

  const viewDetail = async (id) => {
    const { data } = await api.get(`/bookings/${id}`);
    setDetail(data.data);
  };

  const cancelBooking = async (id) => {
    await api.patch(`/bookings/${id}/cancel`);
    enqueueSnackbar("Booking cancelled", { variant: "info" });
    load();
  };

  const columns = [
    {
      field: "booking_ref",
      headerName: "Ref #",
      width: 130,
      renderCell: ({ value }) => (
        <Typography
          sx={{
            fontSize: 12,
            fontFamily: "monospace",
            color: "#2563EB",
            fontWeight: 700,
          }}
        >
          {value}
        </Typography>
      ),
    },
    {
      field: "user_name",
      headerName: "Customer",
      flex: 1,
      minWidth: 160,
      renderCell: ({ row }) => (
        <Box>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#F8FAFC" }}>
            {row.user_name}
          </Typography>
          <Typography sx={{ fontSize: 11, color: "#64748B" }}>
            {row.user_email}
          </Typography>
        </Box>
      ),
    },
    {
      field: "event_title",
      headerName: "Event",
      flex: 1.5,
      minWidth: 180,
      renderCell: ({ row }) => (
        <Box>
          <Typography sx={{ fontSize: 12, fontWeight: 500, color: "#F8FAFC" }}>
            {row.event_title}
          </Typography>
          <Typography sx={{ fontSize: 11, color: "#64748B" }}>
            {row.event_date
              ? new Date(row.event_date).toLocaleDateString("en-IN")
              : ""}
          </Typography>
        </Box>
      ),
    },
    {
      field: "total_seats",
      headerName: "Seats",
      width: 70,
      renderCell: ({ value }) => (
        <Typography sx={{ fontSize: 12, color: "#94A3B8" }}>{value}</Typography>
      ),
    },
    {
      field: "total_amount",
      headerName: "Amount",
      width: 110,
      renderCell: ({ value }) => (
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#22c55e" }}>
          ₹{Number(value || 0).toLocaleString("en-IN")}
        </Typography>
      ),
    },
    {
      field: "payment_status",
      headerName: "Payment",
      width: 110,
      renderCell: ({ value }) => (
        <Chip
          label={value}
          size="small"
          color={PAY_COLOR[value] || "default"}
          sx={{ fontSize: 10, height: 20 }}
        />
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 110,
      renderCell: ({ value }) => (
        <Chip
          label={value}
          size="small"
          color={STATUS_COLOR[value] || "default"}
          sx={{ fontSize: 10, height: 20 }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "",
      width: 90,
      sortable: false,
      renderCell: ({ row }) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Tooltip title="View">
            <IconButton
              size="small"
              onClick={() => viewDetail(row.id)}
              sx={{ color: "#64748B", "&:hover": { color: "#2563EB" } }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {row.status === "confirmed" && (
            <Tooltip title="Cancel">
              <IconButton
                size="small"
                onClick={() => cancelBooking(row.id)}
                sx={{ color: "#64748B", "&:hover": { color: "#ef4444" } }}
              >
                <CancelIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ color: "#F8FAFC" }}>
          Bookings
        </Typography>
        <Typography sx={{ color: "#64748B", fontSize: 13 }}>
          View and manage all ticket bookings
        </Typography>
      </Box>
      <Card sx={{ background: "#1E293B" }}>
        <CardContent sx={{ pb: "0 !important" }}>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              size="small"
              placeholder="Search ref or customer…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ width: 280 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#64748B", fontSize: 18 }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              mb: 1,
              "& .MuiTab-root": {
                fontSize: 12,
                minHeight: 40,
                color: "#64748B",
              },
              "& .Mui-selected": { color: "#2563EB !important" },
              "& .MuiTabs-indicator": { background: "#2563EB" },
            }}
          >
            {["all", "confirmed", "pending", "cancelled"].map((t) => (
              <Tab
                key={t}
                label={t.charAt(0).toUpperCase() + t.slice(1)}
                value={t}
              />
            ))}
          </Tabs>
        </CardContent>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          rowCount={total}
          paginationMode="server"
          paginationModel={{ page, pageSize: 20 }}
          onPaginationModelChange={(m) => setPage(m.page)}
          autoHeight
          disableRowSelectionOnClick
          sx={{ border: "none" }}
        />
      </Card>

      <Dialog
        open={!!detail}
        onClose={() => setDetail(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { background: "#1E293B", border: "1px solid #334155" },
        }}
      >
        <DialogTitle sx={{ color: "#F8FAFC", fontWeight: 700 }}>
          Booking #{detail?.booking_ref}
        </DialogTitle>
        <DialogContent>
          {detail && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {[
                ["Customer", detail.user_name],
                ["Email", detail.user_email],
                ["Event", detail.event_title],
                ["Seats", detail.total_seats],
                [
                  "Amount",
                  `₹${Number(detail.total_amount).toLocaleString("en-IN")}`,
                ],
                ["Payment", detail.payment_status],
                ["Status", detail.status],
              ].map(([k, v]) => (
                <Box
                  key={k}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #334155",
                    pb: 1,
                  }}
                >
                  <Typography sx={{ fontSize: 12, color: "#64748B" }}>
                    {k}
                  </Typography>
                  <Typography
                    sx={{ fontSize: 13, fontWeight: 600, color: "#F8FAFC" }}
                  >
                    {v}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: "16px 24px" }}>
          <Button onClick={() => setDetail(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Bookings;
