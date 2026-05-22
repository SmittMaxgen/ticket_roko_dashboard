import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Divider,
  Stack,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";

import api from "../api/axios";
import TicketScanner from "../components/TicketScanner";
import { selectUser } from "../features/auth/authSelectors";

export default function TicketCheckerDashboard() {
  const user = useSelector(selectUser);
  const { enqueueSnackbar } = useSnackbar();

  const [assignedEvents, setAssignedEvents] = useState([]);
  const [assignedPartyPlots, setAssignedPartyPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanOpen, setScanOpen] = useState(false);
  const [scanContext, setScanContext] = useState(null);

  const fetchAssignments = useCallback(async () => {
    setLoading(true);

    try {
      const [eventResponse, partyPlotResponse] = await Promise.all([
        api.get("/events/assigned"),
        api.get("/party-plots/assigned"),
      ]);

      setAssignedEvents(eventResponse.data.data || []);
      setAssignedPartyPlots(partyPlotResponse.data.data || []);
    } catch (err) {
      enqueueSnackbar(
        err.response?.data?.message ||
          err.message ||
          "Failed to load assignments",
        { variant: "error" },
      );
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    if (user?.role === "ticket_checker") {
      fetchAssignments();
    }
  }, [user, fetchAssignments]);

  const openScanner = (type, item) => {
    setScanContext({ type, item });
    setScanOpen(true);
  };

  const closeScanner = () => {
    setScanOpen(false);
    setScanContext(null);
  };

  const handleScan = async (barcode) => {
    if (!scanContext) return;

    const url =
      scanContext.type === "event"
        ? "/events/scan-ticket"
        : "/party-plots/scan-ticket";

    try {
      await api.post(url, { barcode });
      enqueueSnackbar("Ticket scanned successfully.", { variant: "success" });
      closeScanner();
      fetchAssignments();
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Scan failed";
      enqueueSnackbar(message, { variant: "error" });
      throw message;
    }
  };

  const renderEventsTable = () => (
    <TableContainer component={Paper} sx={{ background: "#111827" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: "#E2E8F0" }}>Event</TableCell>
            <TableCell sx={{ color: "#E2E8F0" }}>Date</TableCell>
            <TableCell sx={{ color: "#E2E8F0" }}>Hall</TableCell>
            <TableCell sx={{ color: "#E2E8F0" }}>Organizer</TableCell>
            <TableCell sx={{ color: "#E2E8F0" }}>Status</TableCell>
            <TableCell sx={{ color: "#E2E8F0" }} align="right">
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {assignedEvents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} sx={{ color: "#94A3B8", py: 4 }}>
                No assigned events yet.
              </TableCell>
            </TableRow>
          ) : (
            assignedEvents.map((event) => (
              <TableRow key={event.id}>
                <TableCell sx={{ color: "#F8FAFC" }}>{event.title}</TableCell>
                <TableCell sx={{ color: "#CBD5E1" }}>
                  {event.event_date}
                </TableCell>
                <TableCell sx={{ color: "#CBD5E1" }}>
                  {event.hall?.name || event.hall?.title || "-"}
                </TableCell>
                <TableCell sx={{ color: "#CBD5E1" }}>
                  {event.organizer?.name || "-"}
                </TableCell>
                <TableCell sx={{ color: "#CBD5E1" }}>{event.status}</TableCell>
                <TableCell align="right">
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => openScanner("event", event)}
                  >
                    Scan Ticket
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderPartyPlotsTable = () => (
    <TableContainer component={Paper} sx={{ background: "#111827" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: "#E2E8F0" }}>Party Plot</TableCell>
            <TableCell sx={{ color: "#E2E8F0" }}>Creator</TableCell>
            <TableCell sx={{ color: "#E2E8F0" }}>Total Tickets</TableCell>
            <TableCell sx={{ color: "#E2E8F0" }}>Available</TableCell>
            <TableCell sx={{ color: "#E2E8F0" }} align="right">
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {assignedPartyPlots.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} sx={{ color: "#94A3B8", py: 4 }}>
                No assigned party plots yet.
              </TableCell>
            </TableRow>
          ) : (
            assignedPartyPlots.map((plot) => (
              <TableRow key={plot.id}>
                <TableCell sx={{ color: "#F8FAFC" }}>{plot.name}</TableCell>
                <TableCell sx={{ color: "#CBD5E1" }}>
                  {plot.creator?.name || "-"}
                </TableCell>
                <TableCell sx={{ color: "#CBD5E1" }}>
                  {plot.total_tickets}
                </TableCell>
                <TableCell sx={{ color: "#CBD5E1" }}>
                  {plot.available_tickets}
                </TableCell>
                <TableCell align="right">
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => openScanner("party_plot", plot)}
                  >
                    Scan Ticket
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ display: "grid", gap: 3 }}>
      <Box>
        <Typography variant="h4" sx={{ color: "#fff", mb: 1 }}>
          Ticket Checker Dashboard
        </Typography>
        <Typography sx={{ color: "#94A3B8" }}>
          View only the events and party plots assigned to you. Scan tickets
          directly from the ticket scanner.
        </Typography>
      </Box>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <Card
          sx={{ flex: 1, background: "#111827", border: "1px solid #334155" }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ color: "#fff", mb: 1 }}>
              Assigned Events
            </Typography>
            <Typography sx={{ color: "#94A3B8", mb: 2 }}>
              {assignedEvents.length} event(s) assigned to you
            </Typography>
            {loading ? <CircularProgress /> : renderEventsTable()}
          </CardContent>
        </Card>

        <Card
          sx={{ flex: 1, background: "#111827", border: "1px solid #334155" }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ color: "#fff", mb: 1 }}>
              Assigned Party Plots
            </Typography>
            <Typography sx={{ color: "#94A3B8", mb: 2 }}>
              {assignedPartyPlots.length} party plot(s) assigned to you
            </Typography>
            {loading ? <CircularProgress /> : renderPartyPlotsTable()}
          </CardContent>
        </Card>
      </Stack>

      <Divider sx={{ borderColor: "#334155" }} />

      <TicketScanner
        open={scanOpen}
        onClose={closeScanner}
        onScan={handleScan}
        title={
          scanContext?.type === "event"
            ? "Scan Event Ticket"
            : "Scan Party Plot Ticket"
        }
      />
    </Box>
  );
}
