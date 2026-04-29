// // ── Bookings.jsx ──────────────────────────────────────────
// import { useState, useEffect, useCallback } from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Chip,
//   IconButton,
//   TextField,
//   InputAdornment,
//   Tab,
//   Tabs,
//   Tooltip,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   Button,
//   DialogActions,
// } from "@mui/material";
// import { DataGrid } from "@mui/x-data-grid";
// import SearchIcon from "@mui/icons-material/Search";
// import VisibilityIcon from "@mui/icons-material/VisibilityOutlined";
// import CancelIcon from "@mui/icons-material/CancelOutlined";
// import api from "../api/axios";
// import { useSnackbar } from "notistack";

// const PAY_COLOR = {
//   paid: "success",
//   pending: "warning",
//   failed: "error",
//   refunded: "info",
// };
// const STATUS_COLOR = {
//   confirmed: "success",
//   pending: "warning",
//   cancelled: "error",
// };

// export function Bookings() {
//   const { enqueueSnackbar } = useSnackbar();
//   const [rows, setRows] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [tab, setTab] = useState("all");
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(0);
//   const [detail, setDetail] = useState(null);

//   const load = useCallback(async () => {
//     setLoading(true);
//     try {
//       const params = { page: page + 1, limit: 20, search };
//       if (tab !== "all") params.status = tab;
//       const { data } = await api.get("/bookings", { params });
//       setRows(data.data);
//       setTotal(data.total);
//     } catch {
//       enqueueSnackbar("Failed to load", { variant: "error" });
//     } finally {
//       setLoading(false);
//     }
//   }, [page, search, tab]);

//   useEffect(() => {
//     load();
//   }, [load]);

//   const viewDetail = async (id) => {
//     const { data } = await api.get(`/bookings/${id}`);
//     setDetail(data.data);
//   };

//   const cancelBooking = async (id) => {
//     await api.patch(`/bookings/${id}/cancel`);
//     enqueueSnackbar("Booking cancelled", { variant: "info" });
//     load();
//   };

//   const columns = [
//     {
//       field: "booking_ref",
//       headerName: "Ref #",
//       width: 130,
//       renderCell: ({ value }) => (
//         <Typography
//           sx={{
//             fontSize: 12,
//             fontFamily: "monospace",
//             color: "#2563EB",
//             fontWeight: 700,
//           }}
//         >
//           {value}
//         </Typography>
//       ),
//     },
//     {
//       field: "user_name",
//       headerName: "Customer",
//       flex: 1,
//       minWidth: 160,
//       renderCell: ({ row }) => (
//         <Box>
//           <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#F8FAFC" }}>
//             {row.user_name}
//           </Typography>
//           <Typography sx={{ fontSize: 11, color: "#64748B" }}>
//             {row.user_email}
//           </Typography>
//         </Box>
//       ),
//     },
//     {
//       field: "event_title",
//       headerName: "Event",
//       flex: 1.5,
//       minWidth: 180,
//       renderCell: ({ row }) => (
//         <Box>
//           <Typography sx={{ fontSize: 12, fontWeight: 500, color: "#F8FAFC" }}>
//             {row.event_title}
//           </Typography>
//           <Typography sx={{ fontSize: 11, color: "#64748B" }}>
//             {row.event_date
//               ? new Date(row.event_date).toLocaleDateString("en-IN")
//               : ""}
//           </Typography>
//         </Box>
//       ),
//     },
//     {
//       field: "total_seats",
//       headerName: "Seats",
//       width: 70,
//       renderCell: ({ value }) => (
//         <Typography sx={{ fontSize: 12, color: "#94A3B8" }}>{value}</Typography>
//       ),
//     },
//     {
//       field: "total_amount",
//       headerName: "Amount",
//       width: 110,
//       renderCell: ({ value }) => (
//         <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#22c55e" }}>
//           ₹{Number(value || 0).toLocaleString("en-IN")}
//         </Typography>
//       ),
//     },
//     {
//       field: "payment_status",
//       headerName: "Payment",
//       width: 110,
//       renderCell: ({ value }) => (
//         <Chip
//           label={value}
//           size="small"
//           color={PAY_COLOR[value] || "default"}
//           sx={{ fontSize: 10, height: 20 }}
//         />
//       ),
//     },
//     {
//       field: "status",
//       headerName: "Status",
//       width: 110,
//       renderCell: ({ value }) => (
//         <Chip
//           label={value}
//           size="small"
//           color={STATUS_COLOR[value] || "default"}
//           sx={{ fontSize: 10, height: 20 }}
//         />
//       ),
//     },
//     {
//       field: "actions",
//       headerName: "",
//       width: 90,
//       sortable: false,
//       renderCell: ({ row }) => (
//         <Box sx={{ display: "flex", gap: 0.5 }}>
//           <Tooltip title="View">
//             <IconButton
//               size="small"
//               onClick={() => viewDetail(row.id)}
//               sx={{ color: "#64748B", "&:hover": { color: "#2563EB" } }}
//             >
//               <VisibilityIcon fontSize="small" />
//             </IconButton>
//           </Tooltip>
//           {row.status === "confirmed" && (
//             <Tooltip title="Cancel">
//               <IconButton
//                 size="small"
//                 onClick={() => cancelBooking(row.id)}
//                 sx={{ color: "#64748B", "&:hover": { color: "#ef4444" } }}
//               >
//                 <CancelIcon fontSize="small" />
//               </IconButton>
//             </Tooltip>
//           )}
//         </Box>
//       ),
//     },
//   ];

//   return (
//     <Box>
//       <Box sx={{ mb: 3 }}>
//         <Typography variant="h5" sx={{ color: "#F8FAFC" }}>
//           Bookings
//         </Typography>
//         <Typography sx={{ color: "#64748B", fontSize: 13 }}>
//           View and manage all ticket bookings
//         </Typography>
//       </Box>
//       <Card sx={{ background: "#1E293B" }}>
//         <CardContent sx={{ pb: "0 !important" }}>
//           <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
//             <TextField
//               size="small"
//               placeholder="Search ref or customer…"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               sx={{ width: 280 }}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <SearchIcon sx={{ color: "#64748B", fontSize: 18 }} />
//                   </InputAdornment>
//                 ),
//               }}
//             />
//           </Box>
//           <Tabs
//             value={tab}
//             onChange={(_, v) => setTab(v)}
//             sx={{
//               mb: 1,
//               "& .MuiTab-root": {
//                 fontSize: 12,
//                 minHeight: 40,
//                 color: "#64748B",
//               },
//               "& .Mui-selected": { color: "#2563EB !important" },
//               "& .MuiTabs-indicator": { background: "#2563EB" },
//             }}
//           >
//             {["all", "confirmed", "pending", "cancelled"].map((t) => (
//               <Tab
//                 key={t}
//                 label={t.charAt(0).toUpperCase() + t.slice(1)}
//                 value={t}
//               />
//             ))}
//           </Tabs>
//         </CardContent>
//         <DataGrid
//           rows={rows}
//           columns={columns}
//           loading={loading}
//           rowCount={total}
//           paginationMode="server"
//           paginationModel={{ page, pageSize: 20 }}
//           onPaginationModelChange={(m) => setPage(m.page)}
//           autoHeight
//           disableRowSelectionOnClick
//           sx={{ border: "none" }}
//         />
//       </Card>

//       <Dialog
//         open={!!detail}
//         onClose={() => setDetail(null)}
//         maxWidth="sm"
//         fullWidth
//         PaperProps={{
//           sx: { background: "#1E293B", border: "1px solid #334155" },
//         }}
//       >
//         <DialogTitle sx={{ color: "#F8FAFC", fontWeight: 700 }}>
//           Booking #{detail?.booking_ref}
//         </DialogTitle>
//         <DialogContent>
//           {detail && (
//             <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
//               {[
//                 ["Customer", detail.user_name],
//                 ["Email", detail.user_email],
//                 ["Event", detail.event_title],
//                 ["Seats", detail.total_seats],
//                 [
//                   "Amount",
//                   `₹${Number(detail.total_amount).toLocaleString("en-IN")}`,
//                 ],
//                 ["Payment", detail.payment_status],
//                 ["Status", detail.status],
//               ].map(([k, v]) => (
//                 <Box
//                   key={k}
//                   sx={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     borderBottom: "1px solid #334155",
//                     pb: 1,
//                   }}
//                 >
//                   <Typography sx={{ fontSize: 12, color: "#64748B" }}>
//                     {k}
//                   </Typography>
//                   <Typography
//                     sx={{ fontSize: 13, fontWeight: 600, color: "#F8FAFC" }}
//                   >
//                     {v}
//                   </Typography>
//                 </Box>
//               ))}
//             </Box>
//           )}
//         </DialogContent>
//         <DialogActions sx={{ p: "16px 24px" }}>
//           <Button onClick={() => setDetail(null)}>Close</Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// }

// export default Bookings;

// ── Bookings.jsx (FULL UPDATED VERSION) ─────────────────────────────────────
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
  Avatar,
  Divider,
  Grid,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/VisibilityOutlined";
import CancelIcon from "@mui/icons-material/CancelOutlined";
import EventSeatIcon from "@mui/icons-material/EventSeat";
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

const fallbackImage = (title) =>
  `https://source.unsplash.com/800x500/?event,concert,${encodeURIComponent(
    title || "show",
  )}`;

export default function Bookings() {
  const { enqueueSnackbar } = useSnackbar();

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const [detail, setDetail] = useState(null);

  // LOAD BOOKINGS
  const load = useCallback(async () => {
    setLoading(true);

    try {
      const params = {
        page: page + 1,
        limit: 20,
        search,
      };

      if (tab !== "all") params.status = tab;

      const { data } = await api.get("/bookings", { params });

      setRows(data.data || []);
      setTotal(data.total || 0);
    } catch (err) {
      enqueueSnackbar("Failed to load bookings", { variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [page, search, tab]);

  useEffect(() => {
    load();
  }, [load]);

  // VIEW DETAIL
  const viewDetail = async (id) => {
    try {
      const { data } = await api.get(`/bookings/${id}`);
      setDetail(data.data);
    } catch {
      enqueueSnackbar("Failed to load booking detail", {
        variant: "error",
      });
    }
  };

  // CANCEL
  const cancelBooking = async (id) => {
    try {
      await api.patch(`/bookings/${id}/cancel`);
      enqueueSnackbar("Booking cancelled", { variant: "success" });
      load();
    } catch {
      enqueueSnackbar("Failed to cancel booking", { variant: "error" });
    }
  };

  // GRID COLUMNS
  const columns = [
    {
      field: "booking_ref",
      headerName: "Booking Ref",
      width: 160,
      renderCell: ({ value }) => (
        <Typography
          sx={{
            fontFamily: "monospace",
            color: "#38BDF8",
            fontWeight: 700,
            fontSize: 12,
          }}
        >
          {value}
        </Typography>
      ),
    },

    {
      field: "customer",
      headerName: "Customer",
      flex: 1,
      minWidth: 180,
      renderCell: ({ row }) => (
        <Box>
          <Typography sx={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>
            {row.user_name}
          </Typography>
          <Typography sx={{ color: "#94A3B8", fontSize: 11 }}>
            {row.user_email}
          </Typography>
        </Box>
      ),
    },

    {
      field: "event",
      headerName: "Event",
      flex: 1.2,
      minWidth: 220,
      renderCell: ({ row }) => (
        <Box>
          <Typography sx={{ color: "#fff", fontSize: 13 }}>
            {row.event_title}
          </Typography>
          <Typography sx={{ color: "#64748B", fontSize: 11 }}>
            {row.event_date
              ? new Date(row.event_date).toLocaleDateString("en-IN")
              : "-"}
          </Typography>
        </Box>
      ),
    },

    {
      field: "total_seats",
      headerName: "Seats",
      width: 80,
    },

    {
      field: "total_amount",
      headerName: "Amount",
      width: 120,
      renderCell: ({ value }) => (
        <Typography sx={{ color: "#22C55E", fontWeight: 700 }}>
          ₹{Number(value || 0).toLocaleString("en-IN")}
        </Typography>
      ),
    },

    {
      field: "payment_status",
      headerName: "Payment",
      width: 120,
      renderCell: ({ value }) => (
        <Chip
          label={value}
          size="small"
          color={PAY_COLOR[value] || "default"}
        />
      ),
    },

    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: ({ value }) => (
        <Chip
          label={value}
          size="small"
          color={STATUS_COLOR[value] || "default"}
        />
      ),
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 110,
      sortable: false,
      renderCell: ({ row }) => (
        <Box>
          <Tooltip title="View">
            <IconButton onClick={() => viewDetail(row.id)}>
              <VisibilityIcon sx={{ color: "#38BDF8" }} />
            </IconButton>
          </Tooltip>

          {row.status === "confirmed" && (
            <Tooltip title="Cancel">
              <IconButton onClick={() => cancelBooking(row.id)}>
                <CancelIcon sx={{ color: "#EF4444" }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box>
      {/* HEADER */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ color: "#fff", fontWeight: 800 }}>
          Bookings
        </Typography>

        <Typography sx={{ color: "#94A3B8", fontSize: 13 }}>
          View every booking with full details
        </Typography>
      </Box>

      {/* CARD */}
      <Card sx={{ background: "#0F172A", borderRadius: 3 }}>
        <CardContent>
          {/* SEARCH */}
          <TextField
            fullWidth
            size="small"
            placeholder="Search booking..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#64748B" }} />
                </InputAdornment>
              ),
            }}
          />

          {/* TABS */}
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              mb: 2,
              "& .MuiTab-root": { color: "#64748B" },
              "& .Mui-selected": { color: "#38BDF8 !important" },
            }}
          >
            {["all", "confirmed", "pending", "cancelled"].map((x) => (
              <Tab
                key={x}
                value={x}
                label={x.charAt(0).toUpperCase() + x.slice(1)}
              />
            ))}
          </Tabs>

          {/* TABLE */}
          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            rowCount={total}
            autoHeight
            pageSizeOptions={[20]}
            paginationMode="server"
            paginationModel={{ page, pageSize: 20 }}
            onPaginationModelChange={(m) => setPage(m.page)}
            disableRowSelectionOnClick
            sx={{
              border: "none",
              color: "#fff",
            }}
          />
        </CardContent>
      </Card>

      {/* DETAIL MODAL */}
      <Dialog
        open={!!detail}
        onClose={() => setDetail(null)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            background: "#0F172A",
            color: "#fff",
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          Booking #{detail?.booking_ref}
        </DialogTitle>

        <DialogContent>
          {detail && (
            <Box>
              {/* EVENT IMAGE */}
              <Box
                component="img"
                src={
                  detail?.event?.banner_url
                    ? detail.event.banner_url
                    : `https://plus.unsplash.com/premium_photo-1684923604860-64e661f2ff72?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`
                }
                onError={(e) => {
                  e.target.src =
                    "https://plus.unsplash.com/premium_photo-1684923604860-64e661f2ff72?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
                }}
                sx={{
                  width: "100%",
                  height: 240,
                  objectFit: "cover",
                  borderRadius: 2,
                  mb: 3,
                }}
              />

              {/* BOOKING INFO */}
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Info title="Customer" value={detail.user_name} />
                  <Info title="Email" value={detail.user_email} />
                  <Info title="Booking Ref" value={detail.booking_ref} />
                  <Info title="Payment Method" value={detail.payment_method} />
                  <Info title="Payment Status" value={detail.payment_status} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Info title="Event" value={detail.event?.title} />
                  <Info title="City" value={detail.event?.city} />
                  <Info title="Hall" value={detail.event?.hall?.name} />
                  <Info
                    title="Date"
                    value={new Date(
                      detail.event?.event_date,
                    ).toLocaleDateString("en-IN")}
                  />
                  <Info
                    title="Time"
                    value={`${detail.event?.start_time} - ${detail.event?.end_time}`}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3, borderColor: "#1E293B" }} />

              {/* SEATS */}
              <Typography sx={{ fontWeight: 800, mb: 2 }}>
                Seats Booked
              </Typography>

              <Grid container spacing={2}>
                {detail.seats?.map((seat) => (
                  <Grid item xs={12} sm={6} md={4} key={seat.id}>
                    <Card
                      sx={{
                        background: "#111827",
                        border: "1px solid #1E293B",
                        borderRadius: 2,
                      }}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 1,
                          }}
                        >
                          <EventSeatIcon sx={{ color: "#F59E0B" }} />
                          <Typography sx={{ fontWeight: 700 }}>
                            {seat.seat_name}
                          </Typography>
                        </Box>

                        <Typography sx={{ color: "#94A3B8", fontSize: 13 }}>
                          Section: {seat.section_label}
                        </Typography>

                        <Typography sx={{ color: "#94A3B8", fontSize: 13 }}>
                          Type: {seat.seat_type}
                        </Typography>

                        <Typography
                          sx={{
                            color: "#22C55E",
                            fontWeight: 700,
                            mt: 1,
                          }}
                        >
                          ₹{seat.bookedPrice}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Divider sx={{ my: 3, borderColor: "#1E293B" }} />

              {/* TOTAL */}
              <Info title="Subtotal" value={`₹${detail.subtotal}`} />
              <Info
                title="Convenience Fee"
                value={`₹${detail.convenience_fee}`}
              />
              <Info
                title="Total Amount"
                value={`₹${detail.total_amount}`}
                green
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDetail(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// SMALL COMPONENT
function Info({ title, value, green }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        py: 1,
        borderBottom: "1px solid #1E293B",
      }}
    >
      <Typography sx={{ color: "#94A3B8", fontSize: 13 }}>{title}</Typography>

      <Typography
        sx={{
          fontWeight: 700,
          color: green ? "#22C55E" : "#fff",
          fontSize: 13,
        }}
      >
        {value || "-"}
      </Typography>
    </Box>
  );
}
