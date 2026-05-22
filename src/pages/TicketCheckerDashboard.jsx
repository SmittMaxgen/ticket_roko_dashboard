import { useEffect, useState } from "react";

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

import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";

import TicketScanner from "../components/TicketScanner";

import { selectUser } from "../features/auth/authSelectors";

import {
  fetchAssignedEvents,
  fetchAssignedPartyPlots,
  scanTicketThunk,
} from "../features/ticketChecker/ticketCheckerThunks";

import {
  selectAssignedEvents,
  selectAssignedPartyPlots,
  selectTicketCheckerLoading,
} from "../features/ticketChecker/ticketCheckerSelectors";

export default function TicketCheckerDashboard() {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);

  const assignedEvents = useSelector(selectAssignedEvents);

  const assignedPartyPlots = useSelector(selectAssignedPartyPlots);

  const loading = useSelector(selectTicketCheckerLoading);

  const { enqueueSnackbar } = useSnackbar();

  const [scanOpen, setScanOpen] = useState(false);

  const [scanContext, setScanContext] = useState(null);

  useEffect(() => {
    if (user?.role === "ticket_checker") {
      dispatch(fetchAssignedEvents());
      dispatch(fetchAssignedPartyPlots());
    }
  }, [dispatch, user]);

  const openScanner = (type, item) => {
    setScanContext({ type, item });
    setScanOpen(true);
  };

  const closeScanner = () => {
    setScanOpen(false);
    setScanContext(null);
  };

  const handleScan = async (barcode) => {
    try {
      await dispatch(
        scanTicketThunk({
          type: scanContext?.type,
          barcode,
        }),
      ).unwrap();

      enqueueSnackbar("Ticket scanned successfully", {
        variant: "success",
      });

      closeScanner();

      dispatch(fetchAssignedEvents());
      dispatch(fetchAssignedPartyPlots());
    } catch (error) {
      enqueueSnackbar(error || "Scan failed", {
        variant: "error",
      });

      throw error;
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
                  {event.hall?.name || "-"}
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
          View assigned events and party plots.
        </Typography>
      </Box>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <Card
          sx={{
            flex: 1,
            background: "#111827",
            border: "1px solid #334155",
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ color: "#fff", mb: 1 }}>
              Assigned Events
            </Typography>

            <Typography sx={{ color: "#94A3B8", mb: 2 }}>
              {assignedEvents.length} assigned event(s)
            </Typography>

            {loading ? <CircularProgress /> : renderEventsTable()}
          </CardContent>
        </Card>

        <Card
          sx={{
            flex: 1,
            background: "#111827",
            border: "1px solid #334155",
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ color: "#fff", mb: 1 }}>
              Assigned Party Plots
            </Typography>

            <Typography sx={{ color: "#94A3B8", mb: 2 }}>
              {assignedPartyPlots.length} assigned party plot(s)
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
