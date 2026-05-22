// import { useEffect, useState, useCallback } from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Chip,
//   IconButton,
//   TextField,
//   InputAdornment,
//   Tabs,
//   Tab,
//   Tooltip,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Divider,
//   Grid,
// } from "@mui/material";

// import { DataGrid } from "@mui/x-data-grid";

// import SearchIcon from "@mui/icons-material/Search";
// import VisibilityIcon from "@mui/icons-material/VisibilityOutlined";
// import CancelIcon from "@mui/icons-material/CancelOutlined";
// import EventSeatIcon from "@mui/icons-material/EventSeat";

// import { useDispatch, useSelector } from "react-redux";
// import { useSnackbar } from "notistack";

// import {
//   fetchBookingsThunk,
//   fetchUserBookingsThunk,
//   fetchBookingByIdThunk,
//   cancelBookingThunk,
// } from "../features/bookings/bookingThunks";

// import {
//   selectBookingList,
//   selectBookingTotal,
//   selectCurrentBooking,
//   selectBookingLoading,
// } from "../features/bookings/bookingSelectors";

// import { clearCurrentBooking } from "../features/bookings/bookingSlice";

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

// export default function Bookings({
//   myPage = false, // true = /my-bookings
//   userId = null, // optional
// }) {
//   const dispatch = useDispatch();
//   const { enqueueSnackbar } = useSnackbar();
//   const user = useSelector((state) => state.auth.user);

//   // Redux State
//   const rows = useSelector(selectBookingList);
//   const total = useSelector(selectBookingTotal);
//   const detail = useSelector(selectCurrentBooking);
//   const loading = useSelector(selectBookingLoading);

//   // Local State
//   const [page, setPage] = useState(0);
//   const [search, setSearch] = useState("");

//   // const [tab, setTab] = useState("all");
//   const [tab, setTab] = useState("all");
//   const [bookingType, setBookingType] = useState("hall");
//   // Load Data
//   const loadBookings = useCallback(() => {
//     const params = {
//       page: page + 1,
//       limit: 20,
//       search,
//     };

//     if (tab !== "all") {
//       params.status = tab;
//     }

//     // if (myPage && userId.role === "user") {
//     //   if (userId) params.userId = userId;
//     //   dispatch(fetchUserBookingsThunk(params));
//     // } else if (myPage && userId.role === "super_admin") {
//     //   dispatch(fetchBookingsThunk(params));
//     // }
//     if (bookingType === "hall") {
//       if (myPage && user?.role === "user") {
//         dispatch(fetchUserBookingsThunk(params));
//       } else {
//         dispatch(fetchBookingsThunk(params));
//       }
//     }

//     // PARTY PLOT BOOKINGS
//     else if (bookingType === "party_plot") {
//       dispatch(
//         fetchUserBookingsThunk({
//           ...params,
//           booking_type: "party_plot",
//         }),
//       );
//     }
//   }, [dispatch, page, search, tab, myPage, userId]);

//   useEffect(() => {
//     loadBookings();
//   }, [loadBookings]);

//   // View Detail
//   const handleView = (id) => {
//     dispatch(fetchBookingByIdThunk(id));
//   };

//   // Cancel
//   const handleCancel = (id) => {
//     dispatch(cancelBookingThunk(id))
//       .unwrap()
//       .then(() => {
//         enqueueSnackbar("Booking cancelled", {
//           variant: "success",
//         });
//       })
//       .catch((err) => {
//         enqueueSnackbar(err || "Failed to cancel", {
//           variant: "error",
//         });
//       });
//   };

//   // Close Detail
//   const closeDetail = () => {
//     dispatch(clearCurrentBooking());
//   };

//   const columns = [
//     {
//       field: "booking_ref",
//       headerName: "Ref #",
//       width: 150,
//       renderCell: ({ value }) => (
//         <Typography
//           sx={{
//             color: "#38BDF8",
//             fontWeight: 700,
//             fontFamily: "monospace",
//             fontSize: 12,
//           }}
//         >
//           {value}
//         </Typography>
//       ),
//     },

//     {
//       field: "customer",
//       headerName: "Customer",
//       flex: 1,
//       minWidth: 220,
//       renderCell: ({ row }) => (
//         <Box>
//           <Typography
//             sx={{
//               color: "#fff",
//               fontWeight: 700,
//               fontSize: 13,
//             }}
//           >
//             {row.user?.name || "-"}
//           </Typography>

//           <Typography
//             sx={{
//               color: "#94A3B8",
//               fontSize: 11,
//             }}
//           >
//             {row.user?.email || "-"}
//           </Typography>
//         </Box>
//       ),
//     },

//     {
//       field: "event",
//       headerName: bookingType === "party_plot" ? "Party Plot" : "Event",
//       flex: 1,
//       minWidth: 220,

//       renderCell: ({ row }) => (
//         <Box>
//           <Typography
//             sx={{
//               color: "#fff",
//               fontSize: 13,
//             }}
//           >
//             {bookingType === "party_plot"
//               ? row.partyPlot?.name || "-"
//               : row.event?.title || "-"}
//           </Typography>

//           <Typography
//             sx={{
//               color: "#64748B",
//               fontSize: 11,
//             }}
//           >
//             {bookingType === "party_plot"
//               ? row.partyPlot?.description || "-"
//               : row.event?.event_date
//                 ? new Date(row.event.event_date).toLocaleDateString("en-IN")
//                 : "-"}
//           </Typography>
//         </Box>
//       ),
//     },

//     {
//       field: "total_seats",
//       // headerName: "Seats",
//       headerName: bookingType === "party_plot" ? "Tickets" : "Seats",
//       width: 80,
//     },

//     {
//       field: "total_amount",
//       headerName: "Amount",
//       width: 130,
//       renderCell: ({ value }) => (
//         <Typography
//           sx={{
//             color: "#22C55E",
//             fontWeight: 700,
//           }}
//         >
//           ₹{Number(value || 0).toLocaleString("en-IN")}
//         </Typography>
//       ),
//     },

//     {
//       field: "payment_status",
//       headerName: "Payment",
//       width: 120,
//       renderCell: ({ value }) => (
//         <Chip
//           label={value}
//           size="small"
//           color={PAY_COLOR[value] || "default"}
//         />
//       ),
//     },

//     {
//       field: "status",
//       headerName: "Status",
//       width: 120,
//       renderCell: ({ value }) => (
//         <Chip
//           label={value}
//           size="small"
//           color={STATUS_COLOR[value] || "default"}
//         />
//       ),
//     },

//     {
//       field: "actions",
//       headerName: "Actions",
//       width: 120,
//       sortable: false,
//       renderCell: ({ row }) => (
//         <Box>
//           <Tooltip title="View">
//             <IconButton onClick={() => handleView(row.id)}>
//               <VisibilityIcon sx={{ color: "#38BDF8" }} />
//             </IconButton>
//           </Tooltip>

//           {row.status === "confirmed" && (
//             <Tooltip title="Cancel">
//               <IconButton onClick={() => handleCancel(row.id)}>
//                 <CancelIcon sx={{ color: "#EF4444" }} />
//               </IconButton>
//             </Tooltip>
//           )}
//         </Box>
//       ),
//     },
//   ];
//   return (
//     <Box>
//       {/* Header */}
//       <Box sx={{ mb: 3 }}>
//         <Typography
//           sx={{
//             color: "#fff",
//             fontSize: 28,
//             fontWeight: 800,
//           }}
//         >
//           {myPage ? "My Bookings" : "Bookings"}
//         </Typography>

//         <Typography sx={{ color: "#94A3B8", fontSize: 13 }}>
//           {myPage ? "View your booked tickets" : "Manage all customer bookings"}
//         </Typography>
//       </Box>

//       {/* Main Card */}
//       <Card
//         sx={{
//           background: "#0F172A",
//           borderRadius: 3,
//         }}
//       >
//         <CardContent>
//           {/* BOOKING TYPE TABS */}
//           <Box sx={{ mb: 2 }}>
//             <Tabs
//               value={bookingType}
//               onChange={(_, value) => {
//                 setBookingType(value);
//                 setPage(0);
//               }}
//               sx={{
//                 "& .MuiTab-root": {
//                   color: "#64748B",
//                   fontWeight: 700,
//                 },
//                 "& .Mui-selected": {
//                   color: "#F59E0B !important",
//                 },
//               }}
//             >
//               <Tab value="hall" label="Hall Bookings" />

//               <Tab value="party_plot" label="Party Plot Bookings" />
//             </Tabs>
//           </Box>
//           {/* Search */}
//           <TextField
//             fullWidth
//             size="small"
//             placeholder="Search booking..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             sx={{ mb: 2 }}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon sx={{ color: "#64748B" }} />
//                 </InputAdornment>
//               ),
//             }}
//           />

//           {/* Tabs */}
//           <Tabs
//             value={tab}
//             onChange={(_, v) => {
//               setTab(v);
//               setPage(0);
//             }}
//             sx={{
//               mb: 2,
//               "& .MuiTab-root": {
//                 color: "#64748B",
//               },
//               "& .Mui-selected": {
//                 color: "#38BDF8 !important",
//               },
//             }}
//           >
//             {["all", "confirmed", "pending", "cancelled"].map((x) => (
//               <Tab
//                 key={x}
//                 value={x}
//                 label={x.charAt(0).toUpperCase() + x.slice(1)}
//               />
//             ))}
//           </Tabs>

//           {/* Table */}
//           <DataGrid
//             rows={rows}
//             columns={columns}
//             loading={loading}
//             rowCount={total}
//             autoHeight
//             paginationMode="server"
//             pageSizeOptions={[20]}
//             paginationModel={{
//               page,
//               pageSize: 20,
//             }}
//             onPaginationModelChange={(m) => setPage(m.page)}
//             disableRowSelectionOnClick
//             sx={{
//               border: "none",
//               color: "#fff",
//             }}
//           />
//         </CardContent>
//       </Card>

//       {/* Detail Modal */}
//       <Dialog
//         open={!!detail}
//         onClose={closeDetail}
//         maxWidth="md"
//         fullWidth
//         PaperProps={{
//           sx: {
//             background: "#0F172A",
//             color: "#fff",
//             borderRadius: 3,
//           },
//         }}
//       >
//         <DialogTitle sx={{ fontWeight: 800 }}>
//           Booking #{detail?.booking_ref}
//         </DialogTitle>

//         <DialogContent>
//           {detail && (
//             <Box>
//               {/* Booking Info */}
//               <Grid container spacing={2}>
//                 <Grid item xs={12} md={6}>
//                   {/* <Info title="Customer" value={detail.user_name} />
//                   <Info title="Email" value={detail.user_email} /> */}
//                   <Info title="Customer" value={detail.user?.name} />
//                   <Info title="Email" value={detail.user?.email} />
//                   <Info title="Payment" value={detail.payment_status} />
//                   <Info title="Status" value={detail.status} />
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   {bookingType === "party_plot" ? (
//                     <>
//                       <Info title="Party Plot" value={detail.partyPlot?.name} />

//                       <Info
//                         title="Description"
//                         value={detail.partyPlot?.description}
//                       />

//                       <Info title="Tickets" value={detail.total_seats} />
//                     </>
//                   ) : (
//                     <>
//                       <Info title="Event" value={detail.event?.title} />

//                       <Info title="City" value={detail.event?.city} />

//                       <Info title="Hall" value={detail.event?.hall?.name} />
//                     </>
//                   )}
//                   <Info
//                     title="Date"
//                     value={
//                       detail.event?.event_date
//                         ? new Date(detail.event.event_date).toLocaleDateString(
//                             "en-IN",
//                           )
//                         : "-"
//                     }
//                   />
//                 </Grid>
//               </Grid>

//               <Divider
//                 sx={{
//                   my: 3,
//                   borderColor: "#1E293B",
//                 }}
//               />

//               {/* Seats */}
//               {bookingType !== "party_plot" && (
//                 <>
//                   {/* Seats */}
//                   <Typography sx={{ fontWeight: 800, mb: 2 }}>
//                     Seats Booked
//                   </Typography>

//                   <Grid container spacing={2}>
//                     {detail.seats?.map((seat) => (
//                       <Grid item xs={12} sm={6} md={4} key={seat.id}>
//                         <Card
//                           sx={{
//                             background: "#111827",
//                             border: "1px solid #1E293B",
//                           }}
//                         >
//                           <CardContent>
//                             <Box
//                               sx={{
//                                 display: "flex",
//                                 gap: 1,
//                                 alignItems: "center",
//                                 mb: 1,
//                               }}
//                             >
//                               <EventSeatIcon sx={{ color: "#F59E0B" }} />

//                               <Typography sx={{ fontWeight: 700 }}>
//                                 {seat.seat_name}
//                               </Typography>
//                             </Box>

//                             <Typography
//                               sx={{
//                                 color: "#94A3B8",
//                                 fontSize: 13,
//                               }}
//                             >
//                               {seat.section_label}
//                             </Typography>

//                             <Typography
//                               sx={{
//                                 color: "#22C55E",
//                                 fontWeight: 700,
//                                 mt: 1,
//                               }}
//                             >
//                               ₹{seat.bookedPrice}
//                             </Typography>
//                           </CardContent>
//                         </Card>
//                       </Grid>
//                     ))}
//                   </Grid>
//                 </>
//               )}

//               <Divider
//                 sx={{
//                   my: 3,
//                   borderColor: "#1E293B",
//                 }}
//               />

//               <Info
//                 title="Total Amount"
//                 value={`₹${detail.total_amount}`}
//                 green
//               />
//             </Box>
//           )}
//         </DialogContent>

//         <DialogActions>
//           <Button onClick={closeDetail}>Close</Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// }

// /* Small Row Component */
// function Info({ title, value, green }) {
//   return (
//     <Box
//       sx={{
//         display: "flex",
//         justifyContent: "space-between",
//         py: 1,
//         borderBottom: "1px solid #1E293B",
//       }}
//     >
//       <Typography sx={{ color: "#94A3B8", fontSize: 13 }}>{title}</Typography>

//       <Typography
//         sx={{
//           color: green ? "#22C55E" : "#fff",
//           fontWeight: 700,
//           fontSize: 13,
//         }}
//       >
//         {value || "-"}
//       </Typography>
//     </Box>
//   );
// }

import { useEffect, useState, useCallback } from "react";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Grid,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/VisibilityOutlined";
import CancelIcon from "@mui/icons-material/CancelOutlined";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";

import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import { useSnackbar } from "notistack";

/* HALL BOOKING THUNKS */
import {
  fetchBookingsThunk,
  fetchUserBookingsThunk,
  fetchBookingByIdThunk,
  cancelBookingThunk,
} from "../features/bookings/bookingThunks";

/* PARTY PLOT BOOKING THUNKS */
import {
  fetchPartyPlotBookingsThunk,
  fetchPartyPlotBookingByIdThunk,
} from "../features/partyPlot/partyPlotBookingThunks";

/* HALL SELECTORS */
import {
  selectBookingList,
  selectBookingTotal,
  selectCurrentBooking,
  selectBookingLoading,
} from "../features/bookings/bookingSelectors";

/* PARTY PLOT SELECTORS */
import {
  selectPartyPlotBookingList,
  selectPartyPlotBookingTotal,
  selectCurrentPartyPlotBooking,
  selectPartyPlotBookingLoading,
} from "../features/partyPlot/PartyPloteBookingSelectors";

/* SLICES */
import { clearCurrentBooking } from "../features/bookings/bookingSlice";

import { clearCurrentPartyPlotBooking } from "../features/partyPlot/partyPlotBookingSlice";

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

export default function Bookings({ myPage = false, userId = null }) {
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const user = useSelector((state) => state.auth.user);
  const [searchParams] = useSearchParams();

  /* BOOKING TYPE */
  const [bookingType, setBookingType] = useState("hall");

  /* COMMON STATES */
  const [page, setPage] = useState(0);

  const [search, setSearch] = useState("");

  const [tab, setTab] = useState("all");
  const eventId = searchParams.get("event_id");
  const partyPlotId = searchParams.get("party_plot_id");
  const queryBookingType = searchParams.get("bookingType");

  useEffect(() => {
    if (queryBookingType === "hall" || queryBookingType === "party_plot") {
      setBookingType(queryBookingType);
      setPage(0);
      return;
    }

    if (eventId) {
      setBookingType("hall");
      setPage(0);
      return;
    }

    if (partyPlotId) {
      setBookingType("party_plot");
      setPage(0);
    }
  }, [eventId, partyPlotId, queryBookingType]);

  /* =========================
        HALL BOOKING STATE
     ========================= */

  const hallRows = useSelector(selectBookingList);

  const hallTotal = useSelector(selectBookingTotal);

  const hallDetail = useSelector(selectCurrentBooking);

  const hallLoading = useSelector(selectBookingLoading);

  /* =========================
      PARTY PLOT STATE
     ========================= */

  const partyPlotRows = useSelector(selectPartyPlotBookingList);

  const partyPlotTotal = useSelector(selectPartyPlotBookingTotal);

  const partyPlotDetail = useSelector(selectCurrentPartyPlotBooking);

  const partyPlotLoading = useSelector(selectPartyPlotBookingLoading);

  /* =========================
          ACTIVE DATA
     ========================= */

  const rows = bookingType === "party_plot" ? partyPlotRows : hallRows;

  const total = bookingType === "party_plot" ? partyPlotTotal : hallTotal;

  const detail = bookingType === "party_plot" ? partyPlotDetail : hallDetail;

  const loading = bookingType === "party_plot" ? partyPlotLoading : hallLoading;

  /* =========================
          LOAD BOOKINGS
     ========================= */

  const loadBookings = useCallback(() => {
    const params = {
      page: page + 1,
      limit: 20,
      search,
    };

    if (tab !== "all") {
      params.status = tab;
    }

    if (bookingType === "hall" && eventId) {
      params.event_id = eventId;
    }

    if (bookingType === "party_plot" && partyPlotId) {
      params.party_plot_id = partyPlotId;
    }

    /* =========================
          HALL BOOKINGS
       ========================= */

    if (bookingType === "hall") {
      if (myPage && user?.role === "user") {
        dispatch(fetchUserBookingsThunk(params));
      } else {
        dispatch(fetchBookingsThunk(params));
      }
    }

    /* =========================
       PARTY PLOT BOOKINGS
       ========================= */

    if (bookingType === "party_plot") {
      dispatch(fetchPartyPlotBookingsThunk(params));
    }
  }, [dispatch, page, search, tab, bookingType, myPage, user]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  /* =========================
         VIEW DETAIL
     ========================= */

  const handleView = (id) => {
    if (bookingType === "party_plot") {
      dispatch(fetchPartyPlotBookingByIdThunk(id));
    } else {
      dispatch(fetchBookingByIdThunk(id));
    }
  };

  /* =========================
          CANCEL BOOKING
     ========================= */

  const handleCancel = (id) => {
    dispatch(cancelBookingThunk(id))
      .unwrap()
      .then(() => {
        enqueueSnackbar("Booking cancelled", {
          variant: "success",
        });

        loadBookings();
      })
      .catch((err) => {
        enqueueSnackbar(err || "Failed to cancel", {
          variant: "error",
        });
      });
  };

  /* =========================
          CLOSE DETAIL
     ========================= */

  const closeDetail = () => {
    if (bookingType === "party_plot") {
      dispatch(clearCurrentPartyPlotBooking());
    } else {
      dispatch(clearCurrentBooking());
    }
  };

  /* =========================
            COLUMNS
     ========================= */

  const columns = [
    {
      field: "booking_ref",
      headerName: "Ref #",
      width: 180,

      renderCell: ({ value }) => (
        <Typography
          sx={{
            color: "#38BDF8",
            fontWeight: 700,
            fontFamily: "monospace",
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
      minWidth: 220,

      renderCell: ({ row }) => (
        <Box>
          <Typography
            sx={{
              color: "#fff",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            {row.user?.name || "-"}
          </Typography>

          <Typography
            sx={{
              color: "#94A3B8",
              fontSize: 11,
            }}
          >
            {row.user?.email || "-"}
          </Typography>
        </Box>
      ),
    },

    {
      field: "event",
      headerName: bookingType === "party_plot" ? "Party Plot" : "Event",

      flex: 1,

      minWidth: 220,

      renderCell: ({ row }) => (
        <Box>
          <Typography
            sx={{
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {bookingType === "party_plot"
              ? row.partyPlot?.name || "-"
              : row.event?.title || "-"}
          </Typography>

          <Typography
            sx={{
              color: "#64748B",
              fontSize: 11,
            }}
          >
            {bookingType === "party_plot"
              ? row.partyPlot?.description || "-"
              : row.event?.event_date
                ? new Date(row.event.event_date).toLocaleDateString("en-IN")
                : "-"}
          </Typography>
        </Box>
      ),
    },

    {
      field: bookingType === "party_plot" ? "total_tickets" : "total_seats",

      headerName: bookingType === "party_plot" ? "Tickets" : "Seats",

      width: 100,

      renderCell: ({ row }) => (
        <Typography
          sx={{
            color: "#fff",
            fontWeight: 700,
          }}
        >
          {bookingType === "party_plot" ? row.total_tickets : row.total_seats}
        </Typography>
      ),
    },

    {
      field: "total_amount",
      headerName: "Amount",
      width: 140,

      renderCell: ({ value }) => (
        <Typography
          sx={{
            color: "#22C55E",
            fontWeight: 700,
          }}
        >
          ₹{Number(value || 0).toLocaleString("en-IN")}
        </Typography>
      ),
    },

    ...(bookingType === "hall"
      ? [
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
        ]
      : []),

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

      width: 120,

      sortable: false,

      renderCell: ({ row }) => (
        <Box>
          <Tooltip title="View">
            <IconButton onClick={() => handleView(row.id)}>
              <VisibilityIcon sx={{ color: "#38BDF8" }} />
            </IconButton>
          </Tooltip>

          {bookingType === "hall" && row.status === "confirmed" && (
            <Tooltip title="Cancel">
              <IconButton onClick={() => handleCancel(row.id)}>
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
        <Typography
          sx={{
            color: "#fff",
            fontSize: 28,
            fontWeight: 800,
          }}
        >
          {myPage ? "My Bookings" : "Bookings"}
        </Typography>

        <Typography
          sx={{
            color: "#94A3B8",
            fontSize: 13,
          }}
        >
          {myPage ? "View your bookings" : "Manage all customer bookings"}
        </Typography>
      </Box>

      {/* MAIN CARD */}

      <Card
        sx={{
          background: "#0F172A",
          borderRadius: 3,
        }}
      >
        <CardContent>
          {/* BOOKING TYPE */}

          <Box sx={{ mb: 2 }}>
            <Tabs
              value={bookingType}
              onChange={(_, value) => {
                setBookingType(value);

                setPage(0);

                setSearch("");

                setTab("all");
              }}
              sx={{
                "& .MuiTab-root": {
                  color: "#64748B",
                  fontWeight: 700,
                },

                "& .Mui-selected": {
                  color: "#F59E0B !important",
                },
              }}
            >
              <Tab value="hall" label="Hall Bookings" />

              <Tab value="party_plot" label="Party Plot Bookings" />
            </Tabs>
          </Box>

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
                  <SearchIcon
                    sx={{
                      color: "#64748B",
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />

          {/* STATUS TABS */}

          <Tabs
            value={tab}
            onChange={(_, value) => {
              setTab(value);

              setPage(0);
            }}
            sx={{
              mb: 2,

              "& .MuiTab-root": {
                color: "#64748B",
              },

              "& .Mui-selected": {
                color: "#38BDF8 !important",
              },
            }}
          >
            {["all", "confirmed", "pending", "cancelled"].map((item) => (
              <Tab
                key={item}
                value={item}
                label={item.charAt(0).toUpperCase() + item.slice(1)}
              />
            ))}
          </Tabs>

          {/* DATA GRID */}

          <DataGrid
            rows={rows || []}
            columns={columns}
            loading={loading}
            rowCount={total || 0}
            autoHeight
            paginationMode="server"
            pageSizeOptions={[20]}
            paginationModel={{
              page,
              pageSize: 20,
            }}
            onPaginationModelChange={(m) => setPage(m.page)}
            disableRowSelectionOnClick
            sx={{
              border: "none",
              color: "#fff",

              "& .MuiDataGrid-columnHeaders": {
                background: "#111827",
              },

              "& .MuiDataGrid-cell": {
                borderColor: "#1E293B",
              },

              "& .MuiDataGrid-footerContainer": {
                borderColor: "#1E293B",
              },
            }}
          />
        </CardContent>
      </Card>

      {/* DETAIL MODAL */}

      <Dialog
        open={!!detail}
        onClose={closeDetail}
        maxWidth="md"
        fullWidth
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
              {/* INFO */}

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Info title="Customer" value={detail.user?.name} />

                  <Info title="Email" value={detail.user?.email} />

                  {bookingType === "hall" && (
                    <Info title="Payment" value={detail.payment_status} />
                  )}

                  <Info title="Status" value={detail.status} />
                </Grid>

                <Grid item xs={12} md={6}>
                  {bookingType === "party_plot" ? (
                    <>
                      <Info title="Party Plot" value={detail.partyPlot?.name} />

                      <Info
                        title="Description"
                        value={detail.partyPlot?.description}
                      />

                      <Info title="Tickets" value={detail.total_tickets} />
                    </>
                  ) : (
                    <>
                      <Info title="Event" value={detail.event?.title} />

                      <Info title="City" value={detail.event?.city} />

                      <Info title="Hall" value={detail.event?.hall?.name} />
                    </>
                  )}

                  <Info
                    title="Date"
                    value={
                      detail.createdAt
                        ? new Date(detail.createdAt).toLocaleDateString("en-IN")
                        : "-"
                    }
                  />
                </Grid>
              </Grid>

              <Divider
                sx={{
                  my: 3,
                  borderColor: "#1E293B",
                }}
              />

              {/* HALL SEATS */}

              {bookingType === "hall" && (
                <>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      mb: 2,
                    }}
                  >
                    Seats Booked
                  </Typography>

                  <Grid container spacing={2}>
                    {detail.seats?.map((seat) => (
                      <Grid item xs={12} sm={6} md={4} key={seat.id}>
                        <Card
                          sx={{
                            background: "#111827",

                            border: "1px solid #1E293B",
                          }}
                        >
                          <CardContent>
                            <Box
                              sx={{
                                display: "flex",

                                gap: 1,

                                alignItems: "center",

                                mb: 1,
                              }}
                            >
                              <EventSeatIcon
                                sx={{
                                  color: "#F59E0B",
                                }}
                              />

                              <Typography
                                sx={{
                                  fontWeight: 700,
                                }}
                              >
                                {seat.seat_name}
                              </Typography>
                            </Box>

                            <Typography
                              sx={{
                                color: "#94A3B8",

                                fontSize: 13,
                              }}
                            >
                              {seat.section_label}
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
                </>
              )}

              {/* PARTY PLOT TICKETS */}

              {bookingType === "party_plot" && detail.tickets && (
                <>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      mb: 2,
                    }}
                  >
                    Tickets
                  </Typography>

                  <Grid container spacing={2}>
                    {detail.tickets.map((ticket) => (
                      <Grid item xs={12} sm={6} md={4} key={ticket.id}>
                        <Card
                          sx={{
                            background: "#111827",

                            border: "1px solid #1E293B",
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
                              <ConfirmationNumberIcon
                                sx={{
                                  color: "#F59E0B",
                                }}
                              />

                              <Typography
                                sx={{
                                  fontWeight: 700,
                                }}
                              >
                                {ticket.ticket_number}
                              </Typography>
                            </Box>

                            <Typography
                              sx={{
                                color: "#94A3B8",

                                fontSize: 12,
                              }}
                            >
                              Barcode:
                            </Typography>

                            <Typography
                              sx={{
                                color: "#38BDF8",

                                fontSize: 12,

                                wordBreak: "break-all",
                              }}
                            >
                              {ticket.barcode}
                            </Typography>

                            <Box
                              sx={{
                                mt: 2,
                              }}
                            >
                              <Chip
                                size="small"
                                label={ticket.status}
                                color={STATUS_COLOR[ticket.status] || "default"}
                              />
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}

              <Divider
                sx={{
                  my: 3,
                  borderColor: "#1E293B",
                }}
              />

              <Info
                title="Total Amount"
                value={`₹${detail.total_amount || 0}`}
                green
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={closeDetail}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

/* ====================================
            INFO ROW
==================================== */

function Info({ title, value, green = false }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        py: 1,
        borderBottom: "1px solid #1E293B",
      }}
    >
      <Typography
        sx={{
          color: "#94A3B8",
          fontSize: 13,
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          color: green ? "#22C55E" : "#fff",

          fontWeight: 700,

          fontSize: 13,
        }}
      >
        {value || "-"}
      </Typography>
    </Box>
  );
}
