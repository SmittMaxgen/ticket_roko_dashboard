// src/components/PartyPlotPanel.jsx

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";

import {
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Tabs,
  Tab,
  Chip,
  Divider,
} from "@mui/material";

// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
// import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlineOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";

import {
  fetchPartyPlotsThunk,
  fetchPartyPlotByIdThunk,
  createPartyPlotThunk,
  deletePartyPlotThunk,
  createTicketsThunk,
  bookTicketsThunk,
} from "../features/partyPlot/partyPlotThunks";

import {
  selectPartyPlotList,
  selectCurrentPartyPlot,
  selectPartyPlotLoading,
  selectPartyPlotActionLoading,
} from "../features/partyPlot/partyPlotSelectors";

const buttonStyle = (bg, shadow = "none") => ({
  border: "none",
  borderRadius: 10,
  background: bg,
  color: "#fff",
  padding: "10px 16px",
  fontWeight: 700,
  cursor: "pointer",
  fontSize: 12,
  boxShadow: shadow,
  transition: "0.2s",
});

function StatBox({ title, value, color, icon }) {
  return (
    <div
      style={{
        flex: 1,
        background: "#0F172A",
        borderRadius: 14,
        padding: 14,
        border: `1px solid ${color}33`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: "#94A3B8",
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          {title}
        </div>

        <div style={{ color }}>{icon}</div>
      </div>

      <div
        style={{
          color,
          fontSize: 28,
          fontWeight: 800,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function BookingCard({ ticket }) {
  return (
    <div
      style={{
        background: "#111827",
        border: "1px solid #1E293B",
        borderRadius: 14,
        padding: 14,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <div>
          <div
            style={{
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            {ticket.bookedUser?.name || "-"}
          </div>

          <div
            style={{
              color: "#64748B",
              fontSize: 12,
              marginTop: 2,
            }}
          >
            {ticket.bookedUser?.email || "-"}
          </div>
        </div>

        <Chip
          label={ticket.status}
          color={ticket.status === "used" ? "error" : "success"}
          size="small"
        />
      </div>

      <Divider sx={{ borderColor: "#1E293B", mb: 1.5 }} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span style={{ color: "#94A3B8", fontSize: 12 }}>Ticket Number</span>

          <span
            style={{
              color: "#F59E0B",
              fontWeight: 700,
              fontSize: 12,
            }}
          >
            {ticket.ticket_number}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span style={{ color: "#94A3B8", fontSize: 12 }}>Barcode</span>

          <span
            style={{
              color: "#38BDF8",
              fontWeight: 700,
              fontSize: 11,
            }}
          >
            {ticket.barcode}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function PartyPlotPanel() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const plots = useSelector(selectPartyPlotList);
  const currentPlot = useSelector(selectCurrentPartyPlot);

  const loading = useSelector(selectPartyPlotLoading);
  const actionLoading = useSelector(selectPartyPlotActionLoading);

  const user = useSelector((state) => state.auth.user);

  const isAdmin = user?.role === "admin" || user?.role === "super_admin";

  const [selectedPlotId, setSelectedPlotId] = useState(null);

  const [tab, setTab] = useState("overview");

  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const [deleteDialog, setDeleteDialog] = useState(null);

  const [createTicketCount, setCreateTicketCount] = useState(50);

  const [bookTicketCount, setBookTicketCount] = useState(1);

  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    total_tickets: 100,
  });

  useEffect(() => {
    dispatch(fetchPartyPlotsThunk());
  }, [dispatch]);

  const handleSelectPlot = (plot) => {
    if (!plot?.id) return;

    setSelectedPlotId(plot.id);

    dispatch(fetchPartyPlotByIdThunk(plot.id));
  };

  const handleCreatePlot = () => {
    dispatch(createPartyPlotThunk(form))
      .unwrap()
      .then((response) => {
        const createdPlot = response?.data || response;

        enqueueSnackbar("Party plot created", {
          variant: "success",
        });

        setShowCreateDialog(false);

        dispatch(fetchPartyPlotsThunk());

        if (createdPlot?.id) {
          setSelectedPlotId(createdPlot.id);

          dispatch(fetchPartyPlotByIdThunk(createdPlot.id));
        }

        setForm({
          name: "",
          description: "",
          image: "",
          total_tickets: 100,
        });

        setTab("overview");
      })
      .catch((err) => {
        enqueueSnackbar(err || "Failed", {
          variant: "error",
        });
      });
  };

  const handleDeletePlot = () => {
    dispatch(deletePartyPlotThunk(deleteDialog))
      .unwrap()
      .then(() => {
        enqueueSnackbar("Party plot deleted", {
          variant: "success",
        });

        setDeleteDialog(null);

        dispatch(fetchPartyPlotsThunk())
          .unwrap()
          .then((plots) => {
            // if deleted plot was selected
            if (selectedPlotId === deleteDialog) {
              if (plots.length > 0) {
                // auto select first remaining plot
                setSelectedPlotId(plots[0].id);

                dispatch(fetchPartyPlotByIdThunk(plots[0].id));
              } else {
                // no plots left
                setSelectedPlotId(null);
              }
            }
          });
      })
      .catch((err) => {
        enqueueSnackbar(err || "Delete failed", {
          variant: "error",
        });
      });
  };

  const handleCreateTickets = () => {
    dispatch(
      createTicketsThunk({
        id: selectedPlotId,
        num_tickets: createTicketCount,
      }),
    )
      .unwrap()
      .then(() => {
        enqueueSnackbar("Tickets created", {
          variant: "success",
        });

        dispatch(fetchPartyPlotByIdThunk(selectedPlotId));

        dispatch(fetchPartyPlotsThunk());
      })
      .catch((err) => {
        enqueueSnackbar(err || "Failed", {
          variant: "error",
        });
      });
  };

  const handleBookTickets = () => {
    dispatch(
      bookTicketsThunk({
        id: selectedPlotId,
        num_tickets: bookTicketCount,
      }),
    )
      .unwrap()
      .then(() => {
        enqueueSnackbar("Tickets booked", {
          variant: "success",
        });

        dispatch(fetchPartyPlotByIdThunk(selectedPlotId));

        dispatch(fetchPartyPlotsThunk());
      })
      .catch((err) => {
        enqueueSnackbar(err || "Booking failed", {
          variant: "error",
        });
      });
  };

  const tickets = currentPlot?.tickets || [];

  const availableTickets = tickets.filter((x) => x.status === "available");

  const bookedTickets = tickets.filter((x) => x.status === "booked");

  const usedTickets = tickets.filter((x) => x.status === "used");

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        background: "#020617",
        overflow: "hidden",
      }}
    >
      {/* LEFT PANEL */}

      <div
        style={{
          width: 320,
          borderRight: "1px solid #1E293B",
          overflowY: "auto",
          background: "#0F172A",
        }}
      >
        <div
          style={{
            padding: 20,
            borderBottom: "1px solid #1E293B",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 20,
                }}
              >
                Party Plots
              </div>

              <div
                style={{
                  color: "#64748B",
                  fontSize: 12,
                  marginTop: 2,
                }}
              >
                {plots.length} total venues
              </div>
            </div>

            {isAdmin && (
              <button
                onClick={() => setShowCreateDialog(true)}
                style={buttonStyle(
                  "linear-gradient(135deg,#F59E0B,#D97706)",
                  "0 4px 18px #F59E0B44",
                )}
              >
                + New Plot
              </button>
            )}
          </div>
        </div>

        <div
          style={{
            padding: 14,
          }}
        >
          {loading ? (
            <div
              style={{
                textAlign: "center",
                paddingTop: 50,
              }}
            >
              <CircularProgress />
            </div>
          ) : (
            plots.map((plot) => {
              const active = selectedPlotId === plot.id;

              return (
                <div
                  key={plot.id}
                  style={{
                    background: active ? "#1E293B" : "#111827",
                    border: active ? "1px solid #F59E0B" : "1px solid #1E293B",
                    borderRadius: 16,
                    overflow: "hidden",
                    marginBottom: 14,
                    cursor: "pointer",
                  }}
                  onClick={() => handleSelectPlot(plot)}
                >
                  {plot.image ? (
                    <img
                      src={plot.image}
                      alt={plot.name}
                      style={{
                        width: "100%",
                        height: 140,
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        height: 120,
                        background:
                          "linear-gradient(135deg,#F59E0B22,#D9770622)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 40,
                      }}
                    >
                      🎪
                    </div>
                  )}

                  <div
                    style={{
                      padding: 14,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 8,
                      }}
                    >
                      <div
                        style={{
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: 15,
                        }}
                      >
                        {plot.name}
                      </div>

                      {isAdmin && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();

                            setDeleteDialog(plot.id);
                          }}
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            color: "#EF4444",
                          }}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </button>
                      )}
                    </div>

                    <div
                      style={{
                        color: "#64748B",
                        fontSize: 12,
                        marginBottom: 12,
                      }}
                    >
                      {plot.description || "No description"}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          color: "#22C55E",
                          fontWeight: 700,
                          fontSize: 12,
                        }}
                      >
                        {plot.available_tickets} available
                      </div>

                      <div
                        style={{
                          color: "#94A3B8",
                          fontSize: 12,
                        }}
                      >
                        {plot.total_tickets} total
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT PANEL */}

      <div
        style={{
          flex: 1,
          overflowY: "auto",
        }}
      >
        {!selectedPlotId ? (
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div style={{ fontSize: 70 }}>🎪</div>

            <div
              style={{
                color: "#94A3B8",
                fontSize: 15,
              }}
            >
              Select party plot to continue
            </div>
          </div>
        ) : (
          <div
            style={{
              padding: 24,
            }}
          >
            {/* HEADER */}

            <div
              style={{
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  color: "#fff",
                  fontSize: 30,
                  fontWeight: 800,
                }}
              >
                {currentPlot?.name}
              </div>

              <div
                style={{
                  color: "#64748B",
                  marginTop: 6,
                }}
              >
                {currentPlot?.description}
              </div>
            </div>

            {/* STATS */}

            <div
              style={{
                display: "flex",
                gap: 14,
                marginBottom: 24,
              }}
            >
              <StatBox
                title="TOTAL"
                value={tickets.length}
                color="#38BDF8"
                icon={<ConfirmationNumberIcon />}
              />

              <StatBox
                title="AVAILABLE"
                value={availableTickets.length}
                color="#22C55E"
                icon={<EventAvailableIcon />}
              />

              <StatBox
                title="BOOKED"
                value={bookedTickets.length}
                color="#F59E0B"
                icon={<LocalActivityIcon />}
              />

              <StatBox
                title="USED"
                value={usedTickets.length}
                color="#EF4444"
                icon={<CheckCircleIcon />}
              />
            </div>

            {/* TABS */}

            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              sx={{
                mb: 3,
                "& .MuiTab-root": {
                  color: "#64748B",
                },
                "& .Mui-selected": {
                  color: "#F59E0B !important",
                },
              }}
            >
              <Tab value="overview" label="Overview" />

              <Tab value="tickets" label="Booked Tickets" />
            </Tabs>

            {/* OVERVIEW */}

            {tab === "overview" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                }}
              >
                {isAdmin && (
                  <div
                    style={{
                      background: "#0F172A",
                      border: "1px solid #1E293B",
                      borderRadius: 18,
                      padding: 20,
                    }}
                  >
                    <div
                      style={{
                        color: "#fff",
                        fontWeight: 700,
                        marginBottom: 14,
                      }}
                    >
                      Create Tickets
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 12,
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        type="number"
                        size="small"
                        value={createTicketCount}
                        onChange={(e) =>
                          setCreateTicketCount(Number(e.target.value))
                        }
                        sx={{
                          width: 160,
                          input: {
                            color: "#fff",
                          },
                        }}
                      />

                      <button
                        onClick={handleCreateTickets}
                        style={buttonStyle(
                          "linear-gradient(135deg,#2563EB,#1D4ED8)",
                          "0 4px 18px #2563EB44",
                        )}
                      >
                        {actionLoading ? "Creating..." : "Create Tickets"}
                      </button>
                    </div>
                  </div>
                )}

                <div
                  style={{
                    background: "#0F172A",
                    border: "1px solid #1E293B",
                    borderRadius: 18,
                    padding: 20,
                  }}
                >
                  <div
                    style={{
                      color: "#fff",
                      fontWeight: 700,
                      marginBottom: 14,
                    }}
                  >
                    Book Tickets
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      type="number"
                      size="small"
                      value={bookTicketCount}
                      onChange={(e) =>
                        setBookTicketCount(Number(e.target.value))
                      }
                      sx={{
                        width: 160,
                        input: {
                          color: "#fff",
                        },
                      }}
                    />

                    <button
                      onClick={handleBookTickets}
                      style={buttonStyle(
                        "linear-gradient(135deg,#22C55E,#16A34A)",
                        "0 4px 18px #22C55E44",
                      )}
                    >
                      {actionLoading ? "Booking..." : "Book Tickets"}
                    </button>
                  </div>

                  <div
                    style={{
                      marginTop: 14,
                      color: "#64748B",
                      fontSize: 12,
                    }}
                  >
                    Email + SMS notification automatically sent after booking.
                  </div>
                </div>
              </div>
            )}

            {/* BOOKINGS */}

            {tab === "tickets" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))",
                  gap: 16,
                }}
              >
                {tickets
                  .filter((x) => x.status === "booked" || x.status === "used")
                  .map((ticket) => (
                    <BookingCard key={ticket.id} ticket={ticket} />
                  ))}

                {tickets.filter(
                  (x) => x.status === "booked" || x.status === "used",
                ).length === 0 && (
                  <div
                    style={{
                      color: "#64748B",
                    }}
                  >
                    No bookings yet
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* CREATE DIALOG */}

      <Dialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        PaperProps={{
          sx: {
            background: "#0F172A",
            color: "#fff",
            borderRadius: 4,
          },
        }}
      >
        <DialogTitle>Create Party Plot</DialogTitle>

        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            minWidth: 400,
            pt: "10px !important",
          }}
        >
          <TextField
            label="Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            fullWidth
          />

          <TextField
            label="Description"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
            fullWidth
          />

          <TextField
            label="Image URL"
            value={form.image}
            onChange={(e) =>
              setForm({
                ...form,
                image: e.target.value,
              })
            }
            fullWidth
          />

          <TextField
            type="number"
            label="Total Tickets"
            value={form.total_tickets}
            onChange={(e) =>
              setForm({
                ...form,
                total_tickets: Number(e.target.value),
              })
            }
            fullWidth
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setShowCreateDialog(false)}>Cancel</Button>

          <Button onClick={handleCreatePlot} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE DIALOG */}

      <Dialog
        open={!!deleteDialog}
        onClose={() => setDeleteDialog(null)}
        PaperProps={{
          sx: {
            background: "#0F172A",
            color: "#fff",
            borderRadius: 4,
          },
        }}
      >
        <DialogTitle>Delete Party Plot?</DialogTitle>

        <DialogContent>This action cannot be undone.</DialogContent>

        <DialogActions>
          <Button onClick={() => setDeleteDialog(null)}>Cancel</Button>

          <Button color="error" variant="contained" onClick={handleDeletePlot}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
