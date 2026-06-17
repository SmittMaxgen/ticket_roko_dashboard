import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Divider,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Card,
  CardContent,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import { useSnackbar } from "notistack";
import api from "../api/axios";

export default function TicketCheckerManagement() {
  const [events, setEvents] = useState([]);
  const [partyPlots, setPartyPlots] = useState([]);
  const [ticketCheckers, setTicketCheckers] = useState([]);

  // Assignment states
  const [selectedEventId, setSelectedEventId] = useState("");
  const [selectedEventCheckerId, setSelectedEventCheckerId] = useState("");
  const [selectedPartyPlotId, setSelectedPartyPlotId] = useState("");
  const [selectedPartyPlotCheckerId, setSelectedPartyPlotCheckerId] =
    useState("");

  const [assigning, setAssigning] = useState(false);
  const [loading, setLoading] = useState(true);

  // Filter & View Assignments
  const [filterCheckerId, setFilterCheckerId] = useState("");
  const [filterHallId, setFilterHallId] = useState("");
  const [activeTab, setActiveTab] = useState(0); // 0: Events, 1: Party Plots

  const [checkerAssignedEvents, setCheckerAssignedEvents] = useState([]);
  const [checkerAssignedPlots, setCheckerAssignedPlots] = useState([]);
  const [filterLoading, setFilterLoading] = useState(false);

  const [viewEvent, setViewEvent] = useState(null);

  const { enqueueSnackbar } = useSnackbar();

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [eventsRes, plotsRes, usersRes] = await Promise.all([
          api.get("/events"),
          api.get("/party-plots"),
          api.get("/users"),
        ]);

        setEvents(eventsRes.data.data || []);
        setPartyPlots(plotsRes.data.data || []);
        setTicketCheckers(
          (usersRes.data.data || []).filter(
            (user) => user.role === "ticket_checker",
          ),
        );
      } catch (err) {
        enqueueSnackbar(
          err.response?.data?.message || err.message || "Failed to load data",
          { variant: "error" },
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [enqueueSnackbar]);

  // Filter only upcoming events + sort by date (soonest first)
  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events
      .filter((event) => {
        if (!event.event_date) return false;
        const eventDate = new Date(event.event_date);
        return eventDate >= today;
      })
      .sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
  }, [events]);

  // Fetch filtered assignments
  useEffect(() => {
    // Only fetch if at least one filter is actually active
    if (!filterCheckerId && !filterHallId) {
      setCheckerAssignedEvents([]);
      setCheckerAssignedPlots([]);
      return;
    }

    const fetchAssignments = async () => {
      setFilterLoading(true);
      try {
        const eventParams = new URLSearchParams();
        if (filterCheckerId) eventParams.append("user_id", filterCheckerId);
        if (filterHallId) eventParams.append("hall_id", filterHallId);

        const plotParams = new URLSearchParams();
        if (filterCheckerId) plotParams.append("user_id", filterCheckerId);

        const [eventsRes, plotsRes] = await Promise.all([
          api.get(`/events/assigned?${eventParams.toString()}`),
          api.get(`/party-plots/assigned?${plotParams.toString()}`),
        ]);

        setCheckerAssignedEvents(eventsRes.data.data || []);
        setCheckerAssignedPlots(plotsRes.data.data || []);
      } catch (err) {
        enqueueSnackbar("Failed to load assignments", { variant: "error" });
      } finally {
        setFilterLoading(false);
      }
    };

    fetchAssignments();
  }, [filterCheckerId, filterHallId, enqueueSnackbar]);
  const assignToEvent = async () => {
    if (!selectedEventId || !selectedEventCheckerId) {
      enqueueSnackbar("Please select both event and ticket checker", {
        variant: "warning",
      });
      return;
    }

    setAssigning(true);
    try {
      await api.post(`/events/${selectedEventId}/assign-ticket-checker`, {
        user_id: selectedEventCheckerId,
      });
      enqueueSnackbar("Ticket checker assigned to event successfully!", {
        variant: "success",
      });
      setSelectedEventId("");
      setSelectedEventCheckerId("");
    } catch (err) {
      enqueueSnackbar(
        err.response?.data?.message || err.message || "Assignment failed",
        { variant: "error" },
      );
    } finally {
      setAssigning(false);
    }
  };

  const assignToPartyPlot = async () => {
    if (!selectedPartyPlotId || !selectedPartyPlotCheckerId) {
      enqueueSnackbar("Please select both party plot and ticket checker", {
        variant: "warning",
      });
      return;
    }

    setAssigning(true);
    try {
      await api.post(
        `/party-plots/${selectedPartyPlotId}/assign-ticket-checker`,
        {
          user_id: selectedPartyPlotCheckerId,
        },
      );
      enqueueSnackbar("Ticket checker assigned to party plot successfully!", {
        variant: "success",
      });
      setSelectedPartyPlotId("");
      setSelectedPartyPlotCheckerId("");
    } catch (err) {
      enqueueSnackbar(
        err.response?.data?.message || err.message || "Assignment failed",
        { variant: "error" },
      );
    } finally {
      setAssigning(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    return date.split("-").reverse().join("-");
  };

  const clearFilters = () => {
    setFilterCheckerId("");
    setFilterHallId("");
  };

  if (loading) {
    return (
      <Box
        sx={{
          p: 4,
          display: "flex",
          justifyContent: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const displayedEvents =
    filterCheckerId || filterHallId ? checkerAssignedEvents : events;
  const displayedPlots = checkerAssignedPlots;

  return (
    <Box sx={{ p: 3, minHeight: "100vh" }}>
      <Typography
        variant="h4"
        fontWeight={700}
        sx={{ mb: 1, color: "#F8FAFC" }}
      >
        Ticket Checker Management
      </Typography>
      <Typography sx={{ color: "#94A3B8", mb: 5 }}>
        Assign and manage ticket checkers for events and party plots from a
        single dashboard.
      </Typography>

      {/* Assignment Section */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {/* Assign to Event */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 4,
              background: "#0F172A",
              height: "100%",
            }}
          >
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
              Assign to Event
            </Typography>
            <Stack spacing={3}>
              <TextField
                select
                label="Select Event"
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                fullWidth
                size="small"
              >
                {upcomingEvents.map((event) => (
                  <MenuItem
                    key={event.id}
                    value={event.id}
                    sx={{
                      py: 1,
                      minHeight: 56,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        lineHeight: 1.2,
                      }}
                    >
                      {event.title}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        mt: 0.25,
                      }}
                    >
                      📍 {event.city} • 📅 {formatDate(event.event_date)}
                    </Typography>
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Select Ticket Checker"
                value={selectedEventCheckerId}
                onChange={(e) => setSelectedEventCheckerId(e.target.value)}
                fullWidth
                size="small"
              >
                {ticketCheckers.map((user) => (
                  <MenuItem key={user.id} value={String(user.id)}>
                    {user.name || user.email}
                  </MenuItem>
                ))}
              </TextField>

              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={assignToEvent}
                disabled={
                  assigning || !selectedEventId || !selectedEventCheckerId
                }
                sx={{
                  height: 52,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                {assigning ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Assign to Event"
                )}
              </Button>
            </Stack>
          </Paper>
        </Grid>

        {/* Assign to Party Plot */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 4,
              background: "#0F172A",
              height: "100%",
            }}
          >
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
              Assign to Party Plot
            </Typography>
            <Stack spacing={3}>
              <TextField
                select
                label="Select Party Plot"
                value={selectedPartyPlotId}
                onChange={(e) => setSelectedPartyPlotId(e.target.value)}
                fullWidth
                size="small"
              >
                {partyPlots.map((plot) => (
                  <MenuItem key={plot.id} value={plot.id}>
                    {plot.name || `Party Plot #${plot.id}`}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Select Ticket Checker"
                value={selectedPartyPlotCheckerId}
                onChange={(e) => setSelectedPartyPlotCheckerId(e.target.value)}
                fullWidth
                size="small"
              >
                {ticketCheckers.map((user) => (
                  <MenuItem key={user.id} value={String(user.id)}>
                    {user.name || user.email}
                  </MenuItem>
                ))}
              </TextField>

              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={assignToPartyPlot}
                disabled={
                  assigning ||
                  !selectedPartyPlotId ||
                  !selectedPartyPlotCheckerId
                }
                sx={{
                  height: 52,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                {assigning ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Assign to Party Plot"
                )}
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4, borderColor: "#1E293B" }} />

      {/* Assignments Overview */}
      <Paper sx={{ p: 4, borderRadius: 4, background: "#0F172A" }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
          Current Assignments
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: "#1E293B", mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{
              "& .MuiTab-root": { textTransform: "none", fontWeight: 500 },
            }}
          >
            <Tab label="Upcoming Events" />
            <Tab label="Past Events" />
            <Tab label="Party Plots" />
          </Tabs>
        </Box>

        {/* Filters */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{ mb: 4 }}
        >
          <TextField
            select
            label="Filter by Ticket Checker"
            value={filterCheckerId}
            onChange={(e) => setFilterCheckerId(e.target.value)}
            size="small"
            sx={{ minWidth: 280 }}
          >
            <MenuItem value="">All Checkers</MenuItem>
            {ticketCheckers.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name || user.email}
              </MenuItem>
            ))}
          </TextField>

          {(activeTab === 0 || activeTab === 1) && (
            <TextField
              select
              label="Filter by Hall"
              value={filterHallId}
              onChange={(e) => {
                const newValue = e.target.value;
                // Prevent unnecessary API call on dropdown open/click without real change
                if (newValue !== filterHallId) {
                  setFilterHallId(newValue);
                }
              }}
              size="small"
              sx={{ minWidth: 220 }}
              SelectProps={{
                displayEmpty: true,
                // This helps prevent auto-selection glitches
                onOpen: () => {
                  // Optional: you can add logic here if needed
                },
              }}
            >
              <MenuItem value="">
                <em>All Halls</em>
              </MenuItem>
              {Array.from(
                new Map(
                  events.filter((e) => e.hall).map((e) => [e.hall.id, e.hall]),
                ).values(),
              ).map((hall) => (
                <MenuItem key={hall.id} value={String(hall.id)}>
                  {hall.name}
                </MenuItem>
              ))}
            </TextField>
          )}

          {(filterCheckerId || filterHallId) && (
            <Button variant="outlined" onClick={clearFilters} size="small">
              Clear Filters
            </Button>
          )}
        </Stack>
        {filterLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : activeTab === 0 || activeTab === 1 ? (
          /* Events Table */
          <TableContainer component={Paper} sx={{ background: "#1E293B" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Event</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Hall</TableCell>
                  {/* <TableCell>Status</TableCell> */}
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(() => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const filtered = displayedEvents.filter((event) => {
                    if (!event.event_date) return false;
                    const d = new Date(event.event_date);
                    return activeTab === 0 ? d >= today : d < today;
                  });
                  return filtered;
                })().length > 0 ? (
                  (() => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return displayedEvents.filter((event) => {
                      if (!event.event_date) return false;
                      const d = new Date(event.event_date);
                      return activeTab === 0 ? d >= today : d < today;
                    });
                  })().map((event) => (
                    <TableRow key={event.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>
                        {event.title}
                        <Typography
                          variant="caption"
                          display="block"
                          color="#94A3B8"
                        >
                          {event.organizer?.name} • {event.city}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {event.event_date}
                        <Typography
                          variant="caption"
                          display="block"
                          color="#94A3B8"
                        >
                          {event.start_time} - {event.end_time}
                        </Typography>
                      </TableCell>
                      <TableCell>{event.hall?.name || "-"}</TableCell>
                      {/* <TableCell>
                        <Chip
                          label={event.status}
                          size="small"
                          color={
                            event.status === "approved" ? "success" : "warning"
                          }
                        />
                      </TableCell> */}
                      <TableCell align="right">
                        <IconButton
                          onClick={() => setViewEvent(event)}
                          color="primary"
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      align="center"
                      sx={{ py: 6, color: "#94A3B8" }}
                    >
                      {activeTab === 0
                        ? "No upcoming events found for the selected filters."
                        : "No past events found for the selected filters."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        ) : activeTab === 2 ? (
          <TableContainer component={Paper} sx={{ background: "#1E293B" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Party Plot</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Checker Assigned</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedPlots.length > 0 ? (
                  displayedPlots.map((plot) => (
                    <TableRow key={plot.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>
                        {plot.name}
                      </TableCell>
                      <TableCell>
                        {plot.location || plot.address || "-"}
                      </TableCell>
                      <TableCell>
                        {plot.ticket_checker ? (
                          <Chip
                            label={
                              plot.ticket_checker.name ||
                              plot.ticket_checker.email
                            }
                            color="primary"
                          />
                        ) : (
                          "—"
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      align="center"
                      sx={{ py: 6, color: "#94A3B8" }}
                    >
                      No party plots found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        ) : null}
      </Paper>

      {/* Event Detail Dialog */}
      <Dialog
        open={!!viewEvent}
        onClose={() => setViewEvent(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { background: "#0F172A", borderRadius: 3 } }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {viewEvent?.title}
          <IconButton
            onClick={() => setViewEvent(null)}
            sx={{ color: "#94A3B8" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {viewEvent && (
            <Stack spacing={3}>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Chip label={viewEvent.status} size="small" />
                <Chip label={viewEvent.event_type} size="small" />
                {viewEvent.is_free && (
                  <Chip label="Free" color="success" size="small" />
                )}
              </Box>

              {[
                ["Date", viewEvent.event_date],
                ["Time", `${viewEvent.start_time} – ${viewEvent.end_time}`],
                ["Hall", viewEvent.hall?.name || "—"],
                ["City", viewEvent.city],
                ["Address", viewEvent.address],
                ["Organizer", viewEvent.organizer?.name || "—"],
                [
                  "Ticket Price",
                  viewEvent.is_free ? "Free" : `₹${viewEvent.ticket_price}`,
                ],
                [
                  "Total / Sold",
                  `${viewEvent.total_tickets} / ${viewEvent.sold_tickets}`,
                ],
              ].map(([label, value]) => (
                <Box
                  key={label}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    py: 1,
                    borderBottom: "1px solid #1E293B",
                  }}
                >
                  <Typography color="#94A3B8">{label}</Typography>
                  <Typography color="#E2E8F0" fontWeight={500}>
                    {value}
                  </Typography>
                </Box>
              ))}

              {viewEvent.description && (
                <Box>
                  <Typography color="#94A3B8" gutterBottom>
                    Description
                  </Typography>
                  <Typography color="#CBD5E1">
                    {viewEvent.description}
                  </Typography>
                </Box>
              )}
            </Stack>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
