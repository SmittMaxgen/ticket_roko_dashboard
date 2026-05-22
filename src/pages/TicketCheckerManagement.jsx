import { useEffect, useState } from "react";
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
} from "@mui/material";
import { useSnackbar } from "notistack";
import api from "../api/axios";

export default function TicketCheckerManagement() {
  const [events, setEvents] = useState([]);
  const [partyPlots, setPartyPlots] = useState([]);
  const [ticketCheckers, setTicketCheckers] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [selectedEventCheckerId, setSelectedEventCheckerId] = useState("");
  const [selectedPartyPlotId, setSelectedPartyPlotId] = useState("");
  const [selectedPartyPlotCheckerId, setSelectedPartyPlotCheckerId] =
    useState("");
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [eventsResponse, partyPlotsResponse, usersResponse] =
          await Promise.all([
            api.get("/events"),
            api.get("/party-plots"),
            api.get("/users"),
          ]);

        setEvents(eventsResponse.data.data || []);
        setPartyPlots(partyPlotsResponse.data.data || []);
        setTicketCheckers(
          (usersResponse.data.data || []).filter(
            (user) => user.role === "ticket_checker",
          ),
        );
      } catch (err) {
        enqueueSnackbar(
          err.response?.data?.message ||
            err.message ||
            "Unable to load ticket checker data",
          { variant: "error" },
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [enqueueSnackbar]);

  const assignToEvent = async () => {
    if (!selectedEventId || !selectedEventCheckerId) {
      enqueueSnackbar("Select an event and a ticket checker.", {
        variant: "warning",
      });
      return;
    }

    setAssigning(true);
    try {
      await api.post(`/events/${selectedEventId}/assign-ticket-checker`, {
        user_id: selectedEventCheckerId,
      });
      enqueueSnackbar("Ticket checker assigned to event.", {
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
      enqueueSnackbar("Select a party plot and a ticket checker.", {
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
      enqueueSnackbar("Ticket checker assigned to party plot.", {
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

  if (loading) {
    return (
      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Ticket Checker Management
      </Typography>
      <Typography sx={{ color: "#94A3B8", mb: 4 }}>
        Assign ticket checker users to events or party plots from one central
        page.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, background: "#0F172A" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Assign to Event
            </Typography>
            <Stack spacing={2}>
              <TextField
                select
                label="Event"
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                fullWidth
                size="small"
              >
                {events.map((event) => (
                  <MenuItem key={event.id} value={event.id}>
                    {event.title || event.name || `Event #${event.id}`}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Ticket Checker"
                value={selectedEventCheckerId}
                onChange={(e) => setSelectedEventCheckerId(e.target.value)}
                fullWidth
                size="small"
              >
                {ticketCheckers.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name || user.email}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                variant="contained"
                color="primary"
                onClick={assignToEvent}
                disabled={
                  assigning || !selectedEventId || !selectedEventCheckerId
                }
              >
                Assign to Event
              </Button>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, background: "#0F172A" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Assign to Party Plot
            </Typography>
            <Stack spacing={2}>
              <TextField
                select
                label="Party Plot"
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
                label="Ticket Checker"
                value={selectedPartyPlotCheckerId}
                onChange={(e) => setSelectedPartyPlotCheckerId(e.target.value)}
                fullWidth
                size="small"
              >
                {ticketCheckers.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name || user.email}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                variant="contained"
                color="primary"
                onClick={assignToPartyPlot}
                disabled={
                  assigning ||
                  !selectedPartyPlotId ||
                  !selectedPartyPlotCheckerId
                }
              >
                Assign to Party Plot
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4, borderColor: "#1E293B" }} />

      <Paper sx={{ p: 3, borderRadius: 3, background: "#0F172A" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Helpful Notes
        </Typography>
        <Typography sx={{ color: "#94A3B8" }}>
          Use this page to assign ticket checkers centrally. For event or party
          plot details, you can still use the dedicated event and party plot
          pages.
        </Typography>
      </Paper>
    </Box>
  );
}
