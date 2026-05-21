// // src/components/PartyPlotPanel.jsx

// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useSnackbar } from "notistack";

// import {
//   CircularProgress,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Tabs,
//   Tab,
//   Chip,
//   Divider,
// } from "@mui/material";

// // import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
// import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
// import LocalActivityIcon from "@mui/icons-material/LocalActivity";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import EventAvailableIcon from "@mui/icons-material/EventAvailable";
// // import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
// import PersonOutlineIcon from "@mui/icons-material/PersonOutlineOutlined";
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";

// import {
//   fetchPartyPlotsThunk,
//   fetchPartyPlotByIdThunk,
//   createPartyPlotThunk,
//   deletePartyPlotThunk,
//   createTicketsThunk,
//   bookTicketsThunk,
// } from "../features/partyPlot/partyPlotThunks";

// import {
//   selectPartyPlotList,
//   selectCurrentPartyPlot,
//   selectPartyPlotLoading,
//   selectPartyPlotActionLoading,
// } from "../features/partyPlot/partyPlotSelectors";

// const buttonStyle = (bg, shadow = "none") => ({
//   border: "none",
//   borderRadius: 10,
//   background: bg,
//   color: "#fff",
//   padding: "10px 16px",
//   fontWeight: 700,
//   cursor: "pointer",
//   fontSize: 12,
//   boxShadow: shadow,
//   transition: "0.2s",
// });

// function StatBox({ title, value, color, icon }) {
//   return (
//     <div
//       style={{
//         flex: 1,
//         background: "#0F172A",
//         borderRadius: 14,
//         padding: 14,
//         border: `1px solid ${color}33`,
//       }}
//     >
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           marginBottom: 10,
//         }}
//       >
//         <div
//           style={{
//             fontSize: 11,
//             color: "#94A3B8",
//             fontWeight: 700,
//             letterSpacing: 1,
//           }}
//         >
//           {title}
//         </div>

//         <div style={{ color }}>{icon}</div>
//       </div>

//       <div
//         style={{
//           color,
//           fontSize: 28,
//           fontWeight: 800,
//         }}
//       >
//         {value}
//       </div>
//     </div>
//   );
// }

// function BookingCard({ ticket }) {
//   return (
//     <div
//       style={{
//         background: "#111827",
//         border: "1px solid #1E293B",
//         borderRadius: 14,
//         padding: 14,
//       }}
//     >
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           marginBottom: 10,
//         }}
//       >
//         <div>
//           <div
//             style={{
//               color: "#fff",
//               fontWeight: 700,
//               fontSize: 14,
//             }}
//           >
//             {ticket.bookedUser?.name || "-"}
//           </div>

//           <div
//             style={{
//               color: "#64748B",
//               fontSize: 12,
//               marginTop: 2,
//             }}
//           >
//             {ticket.bookedUser?.email || "-"}
//           </div>
//         </div>

//         <Chip
//           label={ticket.status}
//           color={ticket.status === "used" ? "error" : "success"}
//           size="small"
//         />
//       </div>

//       <Divider sx={{ borderColor: "#1E293B", mb: 1.5 }} />

//       <div
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           gap: 8,
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//           }}
//         >
//           <span style={{ color: "#94A3B8", fontSize: 12 }}>Ticket Number</span>

//           <span
//             style={{
//               color: "#F59E0B",
//               fontWeight: 700,
//               fontSize: 12,
//             }}
//           >
//             {ticket.ticket_number}
//           </span>
//         </div>

//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//           }}
//         >
//           <span style={{ color: "#94A3B8", fontSize: 12 }}>Barcode</span>

//           <span
//             style={{
//               color: "#38BDF8",
//               fontWeight: 700,
//               fontSize: 11,
//             }}
//           >
//             {ticket.barcode}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function PartyPlotPanel() {
//   const dispatch = useDispatch();
//   const { enqueueSnackbar } = useSnackbar();

//   const plots = useSelector(selectPartyPlotList);
//   const currentPlot = useSelector(selectCurrentPartyPlot);

//   const loading = useSelector(selectPartyPlotLoading);
//   const actionLoading = useSelector(selectPartyPlotActionLoading);

//   const user = useSelector((state) => state.auth.user);

//   const isAdmin = user?.role === "admin" || user?.role === "super_admin";

//   const [selectedPlotId, setSelectedPlotId] = useState(null);

//   const [tab, setTab] = useState("overview");

//   const [showCreateDialog, setShowCreateDialog] = useState(false);

//   const [deleteDialog, setDeleteDialog] = useState(null);

//   const [createTicketCount, setCreateTicketCount] = useState(50);

//   const [bookTicketCount, setBookTicketCount] = useState(1);

//   const [form, setForm] = useState({
//     name: "",
//     description: "",
//     image: "",
//     total_tickets: 100,
//   });

//   useEffect(() => {
//     dispatch(fetchPartyPlotsThunk());
//   }, [dispatch]);

//   const handleSelectPlot = (plot) => {
//     if (!plot?.id) return;

//     setSelectedPlotId(plot.id);

//     dispatch(fetchPartyPlotByIdThunk(plot.id));
//   };

//   const handleCreatePlot = () => {
//     dispatch(createPartyPlotThunk(form))
//       .unwrap()
//       .then((response) => {
//         const createdPlot = response?.data || response;

//         enqueueSnackbar("Party plot created", {
//           variant: "success",
//         });

//         setShowCreateDialog(false);

//         dispatch(fetchPartyPlotsThunk());

//         if (createdPlot?.id) {
//           setSelectedPlotId(createdPlot.id);

//           dispatch(fetchPartyPlotByIdThunk(createdPlot.id));
//         }

//         setForm({
//           name: "",
//           description: "",
//           image: "",
//           total_tickets: 100,
//         });

//         setTab("overview");
//       })
//       .catch((err) => {
//         enqueueSnackbar(err || "Failed", {
//           variant: "error",
//         });
//       });
//   };

//   const handleDeletePlot = () => {
//     dispatch(deletePartyPlotThunk(deleteDialog))
//       .unwrap()
//       .then(() => {
//         enqueueSnackbar("Party plot deleted", {
//           variant: "success",
//         });

//         setDeleteDialog(null);

//         dispatch(fetchPartyPlotsThunk())
//           .unwrap()
//           .then((plots) => {
//             // if deleted plot was selected
//             if (selectedPlotId === deleteDialog) {
//               if (plots.length > 0) {
//                 // auto select first remaining plot
//                 setSelectedPlotId(plots[0].id);

//                 dispatch(fetchPartyPlotByIdThunk(plots[0].id));
//               } else {
//                 // no plots left
//                 setSelectedPlotId(null);
//               }
//             }
//           });
//       })
//       .catch((err) => {
//         enqueueSnackbar(err || "Delete failed", {
//           variant: "error",
//         });
//       });
//   };

//   const handleCreateTickets = () => {
//     dispatch(
//       createTicketsThunk({
//         id: selectedPlotId,
//         num_tickets: createTicketCount,
//       }),
//     )
//       .unwrap()
//       .then(() => {
//         enqueueSnackbar("Tickets created", {
//           variant: "success",
//         });

//         dispatch(fetchPartyPlotByIdThunk(selectedPlotId));

//         dispatch(fetchPartyPlotsThunk());
//       })
//       .catch((err) => {
//         enqueueSnackbar(err || "Failed", {
//           variant: "error",
//         });
//       });
//   };

//   const handleBookTickets = () => {
//     dispatch(
//       bookTicketsThunk({
//         id: selectedPlotId,
//         num_tickets: bookTicketCount,
//       }),
//     )
//       .unwrap()
//       .then(() => {
//         enqueueSnackbar("Tickets booked", {
//           variant: "success",
//         });

//         dispatch(fetchPartyPlotByIdThunk(selectedPlotId));

//         dispatch(fetchPartyPlotsThunk());
//       })
//       .catch((err) => {
//         enqueueSnackbar(err || "Booking failed", {
//           variant: "error",
//         });
//       });
//   };

//   const tickets = currentPlot?.tickets || [];

//   const availableTickets = tickets.filter((x) => x.status === "available");

//   const bookedTickets = tickets.filter((x) => x.status === "booked");

//   const usedTickets = tickets.filter((x) => x.status === "used");

//   return (
//     <div
//       style={{
//         display: "flex",
//         height: "100%",
//         background: "#020617",
//         overflow: "hidden",
//       }}
//     >
//       {/* LEFT PANEL */}

//       <div
//         style={{
//           width: 320,
//           borderRight: "1px solid #1E293B",
//           overflowY: "auto",
//           background: "#0F172A",
//         }}
//       >
//         <div
//           style={{
//             padding: 20,
//             borderBottom: "1px solid #1E293B",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//             }}
//           >
//             <div>
//               <div
//                 style={{
//                   color: "#fff",
//                   fontWeight: 800,
//                   fontSize: 20,
//                 }}
//               >
//                 Party Plots
//               </div>

//               <div
//                 style={{
//                   color: "#64748B",
//                   fontSize: 12,
//                   marginTop: 2,
//                 }}
//               >
//                 {plots.length} total venues
//               </div>
//             </div>

//             {isAdmin && (
//               <button
//                 onClick={() => setShowCreateDialog(true)}
//                 style={buttonStyle(
//                   "linear-gradient(135deg,#F59E0B,#D97706)",
//                   "0 4px 18px #F59E0B44",
//                 )}
//               >
//                 + New Plot
//               </button>
//             )}
//           </div>
//         </div>

//         <div
//           style={{
//             padding: 14,
//           }}
//         >
//           {loading ? (
//             <div
//               style={{
//                 textAlign: "center",
//                 paddingTop: 50,
//               }}
//             >
//               <CircularProgress />
//             </div>
//           ) : (
//             plots.map((plot) => {
//               const active = selectedPlotId === plot.id;

//               return (
//                 <div
//                   key={plot.id}
//                   style={{
//                     background: active ? "#1E293B" : "#111827",
//                     border: active ? "1px solid #F59E0B" : "1px solid #1E293B",
//                     borderRadius: 16,
//                     overflow: "hidden",
//                     marginBottom: 14,
//                     cursor: "pointer",
//                   }}
//                   onClick={() => handleSelectPlot(plot)}
//                 >
//                   {plot.image ? (
//                     <img
//                       src={plot.image}
//                       alt={plot.name}
//                       style={{
//                         width: "100%",
//                         height: 140,
//                         objectFit: "cover",
//                       }}
//                     />
//                   ) : (
//                     <div
//                       style={{
//                         height: 120,
//                         background:
//                           "linear-gradient(135deg,#F59E0B22,#D9770622)",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         fontSize: 40,
//                       }}
//                     >
//                       🎪
//                     </div>
//                   )}

//                   <div
//                     style={{
//                       padding: 14,
//                     }}
//                   >
//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         marginBottom: 8,
//                       }}
//                     >
//                       <div
//                         style={{
//                           color: "#fff",
//                           fontWeight: 700,
//                           fontSize: 15,
//                         }}
//                       >
//                         {plot.name}
//                       </div>

//                       {isAdmin && (
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();

//                             setDeleteDialog(plot.id);
//                           }}
//                           style={{
//                             background: "transparent",
//                             border: "none",
//                             cursor: "pointer",
//                             color: "#EF4444",
//                           }}
//                         >
//                           <DeleteOutlineIcon fontSize="small" />
//                         </button>
//                       )}
//                     </div>

//                     <div
//                       style={{
//                         color: "#64748B",
//                         fontSize: 12,
//                         marginBottom: 12,
//                       }}
//                     >
//                       {plot.description || "No description"}
//                     </div>

//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                       }}
//                     >
//                       <div
//                         style={{
//                           color: "#22C55E",
//                           fontWeight: 700,
//                           fontSize: 12,
//                         }}
//                       >
//                         {plot.available_tickets} available
//                       </div>

//                       <div
//                         style={{
//                           color: "#94A3B8",
//                           fontSize: 12,
//                         }}
//                       >
//                         {plot.total_tickets} total
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </div>

//       {/* RIGHT PANEL */}

//       <div
//         style={{
//           flex: 1,
//           overflowY: "auto",
//         }}
//       >
//         {!selectedPlotId ? (
//           <div
//             style={{
//               height: "100%",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               flexDirection: "column",
//               gap: 12,
//             }}
//           >
//             <div style={{ fontSize: 70 }}>🎪</div>

//             <div
//               style={{
//                 color: "#94A3B8",
//                 fontSize: 15,
//               }}
//             >
//               Select party plot to continue
//             </div>
//           </div>
//         ) : (
//           <div
//             style={{
//               padding: 24,
//             }}
//           >
//             {/* HEADER */}

//             <div
//               style={{
//                 marginBottom: 20,
//               }}
//             >
//               <div
//                 style={{
//                   color: "#fff",
//                   fontSize: 30,
//                   fontWeight: 800,
//                 }}
//               >
//                 {currentPlot?.name}
//               </div>

//               <div
//                 style={{
//                   color: "#64748B",
//                   marginTop: 6,
//                 }}
//               >
//                 {currentPlot?.description}
//               </div>
//             </div>

//             {/* STATS */}

//             <div
//               style={{
//                 display: "flex",
//                 gap: 14,
//                 marginBottom: 24,
//               }}
//             >
//               <StatBox
//                 title="TOTAL"
//                 value={tickets.length}
//                 color="#38BDF8"
//                 icon={<ConfirmationNumberIcon />}
//               />

//               <StatBox
//                 title="AVAILABLE"
//                 value={availableTickets.length}
//                 color="#22C55E"
//                 icon={<EventAvailableIcon />}
//               />

//               <StatBox
//                 title="BOOKED"
//                 value={bookedTickets.length}
//                 color="#F59E0B"
//                 icon={<LocalActivityIcon />}
//               />

//               <StatBox
//                 title="USED"
//                 value={usedTickets.length}
//                 color="#EF4444"
//                 icon={<CheckCircleIcon />}
//               />
//             </div>

//             {/* TABS */}

//             <Tabs
//               value={tab}
//               onChange={(_, v) => setTab(v)}
//               sx={{
//                 mb: 3,
//                 "& .MuiTab-root": {
//                   color: "#64748B",
//                 },
//                 "& .Mui-selected": {
//                   color: "#F59E0B !important",
//                 },
//               }}
//             >
//               <Tab value="overview" label="Overview" />

//               <Tab value="tickets" label="Booked Tickets" />
//             </Tabs>

//             {/* OVERVIEW */}

//             {tab === "overview" && (
//               <div
//                 style={{
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: 20,
//                 }}
//               >
//                 {isAdmin && (
//                   <div
//                     style={{
//                       background: "#0F172A",
//                       border: "1px solid #1E293B",
//                       borderRadius: 18,
//                       padding: 20,
//                     }}
//                   >
//                     <div
//                       style={{
//                         color: "#fff",
//                         fontWeight: 700,
//                         marginBottom: 14,
//                       }}
//                     >
//                       Create Tickets
//                     </div>

//                     <div
//                       style={{
//                         display: "flex",
//                         gap: 12,
//                         alignItems: "center",
//                       }}
//                     >
//                       <TextField
//                         type="number"
//                         size="small"
//                         value={createTicketCount}
//                         onChange={(e) =>
//                           setCreateTicketCount(Number(e.target.value))
//                         }
//                         sx={{
//                           width: 160,
//                           input: {
//                             color: "#fff",
//                           },
//                         }}
//                       />

//                       <button
//                         onClick={handleCreateTickets}
//                         style={buttonStyle(
//                           "linear-gradient(135deg,#2563EB,#1D4ED8)",
//                           "0 4px 18px #2563EB44",
//                         )}
//                       >
//                         {actionLoading ? "Creating..." : "Create Tickets"}
//                       </button>
//                     </div>
//                   </div>
//                 )}

//                 <div
//                   style={{
//                     background: "#0F172A",
//                     border: "1px solid #1E293B",
//                     borderRadius: 18,
//                     padding: 20,
//                   }}
//                 >
//                   <div
//                     style={{
//                       color: "#fff",
//                       fontWeight: 700,
//                       marginBottom: 14,
//                     }}
//                   >
//                     Book Tickets
//                   </div>

//                   <div
//                     style={{
//                       display: "flex",
//                       gap: 12,
//                       alignItems: "center",
//                     }}
//                   >
//                     <TextField
//                       type="number"
//                       size="small"
//                       value={bookTicketCount}
//                       onChange={(e) =>
//                         setBookTicketCount(Number(e.target.value))
//                       }
//                       sx={{
//                         width: 160,
//                         input: {
//                           color: "#fff",
//                         },
//                       }}
//                     />

//                     <button
//                       onClick={handleBookTickets}
//                       style={buttonStyle(
//                         "linear-gradient(135deg,#22C55E,#16A34A)",
//                         "0 4px 18px #22C55E44",
//                       )}
//                     >
//                       {actionLoading ? "Booking..." : "Book Tickets"}
//                     </button>
//                   </div>

//                   <div
//                     style={{
//                       marginTop: 14,
//                       color: "#64748B",
//                       fontSize: 12,
//                     }}
//                   >
//                     Email + SMS notification automatically sent after booking.
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* BOOKINGS */}

//             {tab === "tickets" && (
//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))",
//                   gap: 16,
//                 }}
//               >
//                 {tickets
//                   .filter((x) => x.status === "booked" || x.status === "used")
//                   .map((ticket) => (
//                     <BookingCard key={ticket.id} ticket={ticket} />
//                   ))}

//                 {tickets.filter(
//                   (x) => x.status === "booked" || x.status === "used",
//                 ).length === 0 && (
//                   <div
//                     style={{
//                       color: "#64748B",
//                     }}
//                   >
//                     No bookings yet
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* CREATE DIALOG */}

//       <Dialog
//         open={showCreateDialog}
//         onClose={() => setShowCreateDialog(false)}
//         PaperProps={{
//           sx: {
//             background: "#0F172A",
//             color: "#fff",
//             borderRadius: 4,
//           },
//         }}
//       >
//         <DialogTitle>Create Party Plot</DialogTitle>

//         <DialogContent
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             gap: 2,
//             minWidth: 400,
//             pt: "10px !important",
//           }}
//         >
//           <TextField
//             label="Name"
//             value={form.name}
//             onChange={(e) =>
//               setForm({
//                 ...form,
//                 name: e.target.value,
//               })
//             }
//             fullWidth
//           />

//           <TextField
//             label="Description"
//             value={form.description}
//             onChange={(e) =>
//               setForm({
//                 ...form,
//                 description: e.target.value,
//               })
//             }
//             fullWidth
//           />

//           <TextField
//             label="Image URL"
//             value={form.image}
//             onChange={(e) =>
//               setForm({
//                 ...form,
//                 image: e.target.value,
//               })
//             }
//             fullWidth
//           />

//           <TextField
//             type="number"
//             label="Total Tickets"
//             value={form.total_tickets}
//             onChange={(e) =>
//               setForm({
//                 ...form,
//                 total_tickets: Number(e.target.value),
//               })
//             }
//             fullWidth
//           />
//         </DialogContent>

//         <DialogActions>
//           <Button onClick={() => setShowCreateDialog(false)}>Cancel</Button>

//           <Button onClick={handleCreatePlot} variant="contained">
//             Create
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* DELETE DIALOG */}

//       <Dialog
//         open={!!deleteDialog}
//         onClose={() => setDeleteDialog(null)}
//         PaperProps={{
//           sx: {
//             background: "#0F172A",
//             color: "#fff",
//             borderRadius: 4,
//           },
//         }}
//       >
//         <DialogTitle>Delete Party Plot?</DialogTitle>

//         <DialogContent>This action cannot be undone.</DialogContent>

//         <DialogActions>
//           <Button onClick={() => setDeleteDialog(null)}>Cancel</Button>

//           <Button color="error" variant="contained" onClick={handleDeletePlot}>
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// }

// src/components/Partyplote.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Party Plot LISTING page  →  /party-plot
// Navigates to detail/edit →  /party-plot/:id   (PartyPlotDetail.jsx)
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Chip,
  LinearProgress,
  Skeleton,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";

import {
  fetchPartyPlotsThunk,
  createPartyPlotThunk,
  deletePartyPlotThunk,
} from "../features/partyPlot/partyPlotThunks";

import {
  selectPartyPlotList,
  selectPartyPlotLoading,
  selectPartyPlotActionLoading,
  selectPartyPlotError,
} from "../features/partyPlot/partyPlotSelectors";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const pct = (part, total) => (total > 0 ? Math.round((part / total) * 100) : 0);

// ─────────────────────────────────────────────────────────────────────────────
// Ticket Stat Pill
// ─────────────────────────────────────────────────────────────────────────────
function StatPill({ icon, label, value, color }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.6,
        px: 1.2,
        py: 0.5,
        borderRadius: "8px",
        background: `${color}18`,
        border: `1px solid ${color}30`,
      }}
    >
      {React.cloneElement(icon, { sx: { fontSize: 14, color } })}
      <Typography sx={{ fontSize: 11, fontWeight: 700, color }}>
        {value}
      </Typography>
      <Typography sx={{ fontSize: 10, color: "#64748B" }}>{label}</Typography>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Loading Skeleton Card
// ─────────────────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <Card
      sx={{
        background:
          "linear-gradient(135deg,rgba(30,41,59,0.88),rgba(15,23,42,0.75))",
        border: "1px solid rgba(100,116,139,0.2)",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <Skeleton
        variant="rectangular"
        height={160}
        sx={{ bgcolor: "rgba(255,255,255,0.05)" }}
      />
      <CardContent sx={{ p: 2.5 }}>
        <Skeleton
          variant="text"
          width="60%"
          height={28}
          sx={{ bgcolor: "rgba(255,255,255,0.05)", mb: 1 }}
        />
        <Skeleton
          variant="text"
          width="90%"
          height={18}
          sx={{ bgcolor: "rgba(255,255,255,0.04)" }}
        />
        <Skeleton
          variant="text"
          width="80%"
          height={18}
          sx={{ bgcolor: "rgba(255,255,255,0.04)" }}
        />
        <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
          {[1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              variant="rounded"
              width={70}
              height={26}
              sx={{ bgcolor: "rgba(255,255,255,0.05)" }}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Plot Card
// ─────────────────────────────────────────────────────────────────────────────
function PlotCard({ plot, isAdmin, onEdit, onDelete }) {
  const total = plot?.total_tickets || 0;
  const available = plot?.partyPlot?.available_tickets || 0;
  const booked = plot?.partyPlot?.booked_tickets || 0;
  const used = plot?.partyPlot?.used_tickets || 0;
  const filledPct = pct(total - available, total);
  console.log("plot:::>>>>", plot);
  return (
    <Card
      variant="outlined"
      sx={{
        background:
          "linear-gradient(135deg,rgba(30,41,59,0.92),rgba(15,23,42,0.80))",
        border: "1px solid rgba(100,116,139,0.18)",
        borderRadius: 3,
        overflow: "hidden",
        position: "relative",
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
        display: "flex",
        flexDirection: "column",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: "linear-gradient(90deg,#F59E0B,#6366f1,transparent)",
          opacity: 0.8,
        },
        "&:hover": {
          borderColor: "rgba(245,158,11,0.35)",
          boxShadow: "0 20px 48px rgba(0,0,0,0.35)",
          transform: "translateY(-4px)",
          "&::before": { opacity: 1 },
        },
      }}
    >
      {/* ── Image / Placeholder ── */}
      {plot?.partyPlot?.image ? (
        <Box
          component="img"
          src={plot?.partyPlot?.image}
          alt={plot?.partyPlot?.name}
          sx={{
            width: "100%",
            height: 170,
            objectFit: "cover",
            display: "block",
          }}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      ) : (
        <Box
          sx={{
            height: 130,
            background: "linear-gradient(135deg,#F59E0B14,#6366f114)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography sx={{ fontSize: 42 }}>🎪</Typography>
          <Typography
            sx={{
              fontSize: 10,
              color: "#475569",
              letterSpacing: 1,
              fontWeight: 600,
            }}
          >
            NO IMAGE
          </Typography>
        </Box>
      )}

      <CardContent
        sx={{ p: 2.5, flex: 1, display: "flex", flexDirection: "column" }}
      >
        {/* ── Name + Actions ── */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={1}
        >
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "1.1rem",
              color: "#F1F5F9",
              lineHeight: 1.2,
              flex: 1,
              mr: 1,
            }}
          >
            {plot?.partyPlot?.name || "Unnamed Plot"}
          </Typography>

          <Stack direction="row" spacing={0.3}>
            <Tooltip title="Edit Plot">
              <IconButton
                size="small"
                onClick={() => onEdit(plot)}
                sx={{
                  color: "#94A3B8",
                  "&:hover": {
                    color: "#F59E0B",
                    background: "rgba(245,158,11,0.1)",
                  },
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {isAdmin && (
              <Tooltip title="Delete Plot">
                <IconButton
                  size="small"
                  onClick={() => onDelete(plot)}
                  sx={{
                    color: "#64748B",
                    "&:hover": {
                      color: "#EF4444",
                      background: "rgba(239,68,68,0.1)",
                    },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Stack>

        {/* ── Description ── */}
        <Typography
          sx={{
            color: "#64748B",
            fontSize: "0.8rem",
            mb: 2,
            lineHeight: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {plot?.partyPlot?.description || "No description provided."}
        </Typography>

        {/* ── Ticket Stats ── */}
        <Stack direction="row" flexWrap="wrap" gap={0.8} mb={2}>
          <StatPill
            icon={<ConfirmationNumberIcon />}
            label="total"
            value={total}
            color="#38BDF8"
          />
          <StatPill
            icon={<EventAvailableIcon />}
            label="avail"
            value={available}
            color="#22C55E"
          />
          {booked > 0 && (
            <StatPill
              icon={<LocalActivityIcon />}
              label="booked"
              value={booked}
              color="#F59E0B"
            />
          )}
          {used > 0 && (
            <StatPill
              icon={<CheckCircleIcon />}
              label="used"
              value={used}
              color="#EF4444"
            />
          )}
        </Stack>

        {/* ── Fill Progress ── */}
        <Box
          sx={{
            mt: "auto",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 0.5,
          }}
        >
          <Stack direction="row" justifyContent="space-between" mb={0.5}>
            <Typography
              sx={{
                color: "#475569",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: 0.5,
              }}
            >
              FILL RATE
            </Typography>
            <Typography
              sx={{
                color: filledPct > 80 ? "#EF4444" : "#94A3B8",
                fontSize: 10,
                fontWeight: 700,
              }}
            >
              {filledPct}%
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={filledPct}
            sx={{
              height: 5,
              borderRadius: 4,
              background: "rgba(255,255,255,0.06)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 4,
                background:
                  filledPct > 80
                    ? "linear-gradient(90deg,#F59E0B,#EF4444)"
                    : filledPct > 50
                      ? "linear-gradient(90deg,#22C55E,#F59E0B)"
                      : "linear-gradient(90deg,#38BDF8,#22C55E)",
              },
            }}
          />
        </Box>

        {/* ── Manage Button ── */}
        <Button
          fullWidth
          variant="outlined"
          onClick={() => onEdit(plot)}
          sx={{
            mt: 2,
            borderColor: "rgba(245,158,11,0.25)",
            color: "#F59E0B",
            fontSize: "0.78rem",
            fontWeight: 700,
            borderRadius: 2,
            textTransform: "none",
            py: 0.8,
            "&:hover": {
              borderColor: "#F59E0B",
              background: "rgba(245,158,11,0.08)",
            },
          }}
        >
          Manage Plot
        </Button>
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Create Dialog
// ─────────────────────────────────────────────────────────────────────────────
const EMPTY_FORM = { name: "", description: "", image: "", total_tickets: 100 };

function CreateDialog({ open, onClose, onSubmit, loading }) {
  const [form, setForm] = useState(EMPTY_FORM);

  const set = (key) => (e) =>
    setForm((f) => ({
      ...f,
      [key]: key === "total_tickets" ? Number(e.target.value) : e.target.value,
    }));

  const handleClose = () => {
    setForm(EMPTY_FORM);
    onClose();
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    onSubmit(form, () => setForm(EMPTY_FORM));
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      color: "#F1F5F9",
      "& fieldset": { borderColor: "rgba(100,116,139,0.3)" },
      "&:hover fieldset": { borderColor: "rgba(245,158,11,0.4)" },
      "&.Mui-focused fieldset": { borderColor: "#F59E0B" },
    },
    "& .MuiInputLabel-root": { color: "#64748B" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#F59E0B" },
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: "#0F172A",
          border: "1px solid rgba(100,116,139,0.2)",
          borderRadius: 3,
          color: "#fff",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: "1.2rem",
          fontWeight: 800,
          background: "linear-gradient(135deg,#F59E0B,#6366f1)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          pb: 1,
        }}
      >
        Create New Party Plot
      </DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
          pt: "16px !important",
        }}
      >
        <TextField
          label="Venue Name *"
          value={form.name}
          onChange={set("name")}
          fullWidth
          sx={fieldSx}
        />
        <TextField
          label="Description"
          value={form.description}
          onChange={set("description")}
          fullWidth
          multiline
          rows={2}
          sx={fieldSx}
        />
        <TextField
          label="Image URL"
          value={form.image}
          onChange={set("image")}
          fullWidth
          sx={fieldSx}
          placeholder="https://..."
        />
        <TextField
          type="number"
          label="Total Tickets"
          value={form.total_tickets}
          onChange={set("total_tickets")}
          fullWidth
          sx={fieldSx}
          inputProps={{ min: 1 }}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button
          onClick={handleClose}
          sx={{ color: "#64748B", textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading || !form.name.trim()}
          variant="contained"
          sx={{
            background: "linear-gradient(135deg,#F59E0B,#D97706)",
            textTransform: "none",
            fontWeight: 700,
            px: 3,
            borderRadius: 2,
            "&:hover": {
              background: "linear-gradient(135deg,#D97706,#B45309)",
            },
          }}
        >
          {loading ? "Creating…" : "Create Plot"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Delete Confirm Dialog
// ─────────────────────────────────────────────────────────────────────────────
function DeleteDialog({ plot, open, onClose, onConfirm, loading }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          background: "#0F172A",
          border: "1px solid rgba(239,68,68,0.2)",
          borderRadius: 3,
          color: "#fff",
        },
      }}
    >
      <DialogTitle
        sx={{ fontSize: "1.1rem", fontWeight: 800, color: "#EF4444" }}
      >
        Delete Party Plot?
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ color: "#94A3B8", fontSize: "0.9rem" }}>
          Are you sure you want to delete{" "}
          <span style={{ color: "#F1F5F9", fontWeight: 700 }}>
            {plot?.name}
          </span>
          ? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button
          onClick={onClose}
          sx={{ color: "#64748B", textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          disabled={loading}
          variant="contained"
          color="error"
          sx={{
            textTransform: "none",
            fontWeight: 700,
            px: 3,
            borderRadius: 2,
          }}
        >
          {loading ? "Deleting…" : "Yes, Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
export default function Partyplote() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const plots = useSelector(selectPartyPlotList);
  const loading = useSelector(selectPartyPlotLoading);
  const actionLoading = useSelector(selectPartyPlotActionLoading);
  const error = useSelector(selectPartyPlotError);
  const user = useSelector((state) => state.auth.user);

  const isAdmin = user?.role === "admin" || user?.role === "super_admin";

  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // plot object

  // ── Fetch on mount ────────────────────────────────────────
  useEffect(() => {
    dispatch(fetchPartyPlotsThunk());
  }, [dispatch]);

  // ── Navigate to detail/edit ───────────────────────────────
  const handleEdit = (plot) => {
    navigate(`/party-plot/${plot.id}`);
  };

  // ── Create ────────────────────────────────────────────────
  const handleCreate = (formData, resetForm) => {
    dispatch(createPartyPlotThunk(formData))
      .unwrap()
      .then((created) => {
        enqueueSnackbar("Party plot created successfully!", {
          variant: "success",
        });
        resetForm();
        setCreateOpen(false);
        dispatch(fetchPartyPlotsThunk());
        // Navigate directly to the new plot's detail page
        const id = created?.id || created?.data?.id;
        if (id) navigate(`/party-plot/${id}`);
      })
      .catch((err) => {
        enqueueSnackbar(err || "Failed to create party plot.", {
          variant: "error",
        });
      });
  };

  // ── Delete ────────────────────────────────────────────────
  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    dispatch(deletePartyPlotThunk(deleteTarget.id))
      .unwrap()
      .then(() => {
        enqueueSnackbar("Party plot deleted.", { variant: "success" });
        setDeleteTarget(null);
        dispatch(fetchPartyPlotsThunk());
      })
      .catch((err) => {
        enqueueSnackbar(err || "Failed to delete.", { variant: "error" });
      });
  };

  // ─────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────
  return (
    <Box sx={{ p: 0 }}>
      {/* ── Header ── */}
      <Stack
        // direction="row"
        // justifyContent="space-between"
        // alignItems="center"
        sx={{
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          mb: 4,
          pb: 3,
          padding: "10px",
          borderBottom: "1px solid rgba(100,116,139,0.2)",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: "2rem",
              fontWeight: 800,
              background: "linear-gradient(135deg,#F59E0B 0%,#6366f1 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 0.5,
              lineHeight: 1.1,
            }}
          >
            Party Plots
          </Typography>
          <Typography sx={{ color: "#64748B", fontSize: "0.87rem" }}>
            {loading
              ? "Loading venues…"
              : `${plots.length} venue${plots.length !== 1 ? "s" : ""} available`}
          </Typography>
        </Box>

        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateOpen(true)}
            sx={{
              background: "linear-gradient(135deg,#F59E0B,#D97706)",
              fontWeight: 700,
              borderRadius: 2.5,
              textTransform: "none",
              px: 2.5,
              py: 1.1,
              fontSize: "0.875rem",
              boxShadow: "0 4px 18px rgba(245,158,11,0.3)",
              "&:hover": {
                background: "linear-gradient(135deg,#D97706,#B45309)",
                boxShadow: "0 6px 24px rgba(245,158,11,0.4)",
              },
            }}
          >
            Add New Plot
          </Button>
        )}
      </Stack>

      {/* ── Error ── */}
      {error && !loading && (
        <Box
          sx={{
            mb: 3,
            p: 2,
            borderRadius: 2,
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          <Typography sx={{ color: "#EF4444", fontSize: "0.875rem" }}>
            {error}
          </Typography>
        </Box>
      )}

      {/* ── Grid ── */}
      {loading ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))",
            gap: 3,
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </Box>
      ) : plots.length === 0 ? (
        /* ── Empty State ── */
        <Box
          sx={{
            textAlign: "center",
            py: 12,
            background:
              "linear-gradient(135deg,rgba(30,41,59,0.4),rgba(15,23,42,0.4))",
            borderRadius: 4,
            border: "1px dashed rgba(100,116,139,0.25)",
          }}
        >
          <Typography sx={{ fontSize: 56, mb: 2 }}>🎪</Typography>
          <Typography
            sx={{
              color: "#F1F5F9",
              fontWeight: 700,
              fontSize: "1.2rem",
              mb: 1,
            }}
          >
            No Party Plots Yet
          </Typography>
          <Typography sx={{ color: "#64748B", fontSize: "0.875rem", mb: 3 }}>
            Create your first party plot to get started.
          </Typography>
          {isAdmin && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateOpen(true)}
              sx={{
                background: "linear-gradient(135deg,#F59E0B,#D97706)",
                fontWeight: 700,
                borderRadius: 2,
                textTransform: "none",
                px: 3,
              }}
            >
              Create First Plot
            </Button>
          )}
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(310px,1fr))",
            gap: 3,
          }}
        >
          {plots.map((plot) => (
            <PlotCard
              key={plot.id}
              plot={plot}
              isAdmin={isAdmin}
              onEdit={handleEdit}
              onDelete={(p) => setDeleteTarget(p)}
            />
          ))}
        </Box>
      )}

      {/* ── Dialogs ── */}
      <CreateDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        loading={actionLoading}
      />

      <DeleteDialog
        open={!!deleteTarget}
        plot={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        loading={actionLoading}
      />
    </Box>
  );
}
