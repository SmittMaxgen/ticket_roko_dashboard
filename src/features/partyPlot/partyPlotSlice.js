// src/features/partyPlot/partyPlotSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchPartyPlotsThunk,
  fetchAllPartyPlotsThunk,
  fetchPartyPlotByIdThunk,
  createPartyPlotThunk,
  updatePartyPlotThunk,
  deletePartyPlotThunk,
  createTicketsThunk,
  bookTicketsThunk,
  scanTicketThunk,
} from "./partyPlotThunks";

const partyPlotSlice = createSlice({
  name: "partyPlot",
  initialState: {
    list: [],
    currentPartyPlot: null,
    loading: false,
    actionLoading: false,
    error: null,
  },
  reducers: {
    clearPartyPlotError: (state) => {
      state.error = null;
    },
    clearCurrentPartyPlot: (state) => {
      state.currentPartyPlot = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── fetch list (booking-oriented endpoint)
      .addCase(fetchPartyPlotsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPartyPlotsThunk.fulfilled, (state, action) => {
        state.loading = false;
        // The booking-oriented endpoint may return items already shaped
        // with a `partyPlot` nested object. Normalize to a consistent
        // shape: { id, partyPlot }
        state.list = (action.payload || []).map((item) => {
          if (item && item.partyPlot) return item;
          return { id: item.id, partyPlot: item };
        });
      })
      .addCase(fetchPartyPlotsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── fetch list (all party-plots endpoint)
      .addCase(fetchAllPartyPlotsThunk?.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPartyPlotsThunk?.fulfilled, (state, action) => {
        state.loading = false;
        // API returns plain party plot objects. Wrap them so the UI can
        // read `plot.partyPlot.*` uniformly.
        state.list = (action.payload || []).map((p) => ({
          id: p.id,
          partyPlot: p,
        }));
      })
      .addCase(fetchAllPartyPlotsThunk?.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ── fetch by id ───────────────────────────────
      .addCase(fetchPartyPlotByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPartyPlotByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPartyPlot = action.payload;
      })
      .addCase(fetchPartyPlotByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ── create ───────────────────────────────────
      .addCase(createPartyPlotThunk.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createPartyPlotThunk.fulfilled, (state, action) => {
        state.actionLoading = false;
        // Normalize created payload to { id, partyPlot }
        const payload = action.payload || action.payload?.data || null;
        if (payload) {
          state.list.push({ id: payload.id, partyPlot: payload });
        }
      })
      .addCase(createPartyPlotThunk.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      // ── update ───────────────────────────────────
      .addCase(updatePartyPlotThunk.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updatePartyPlotThunk.fulfilled, (state, action) => {
        state.actionLoading = false;
        const updated = action.payload || action.payload?.data || null;
        if (!updated) return;
        const index = state.list.findIndex((p) => p.id === updated.id);
        if (index !== -1) {
          state.list[index] = { id: updated.id, partyPlot: updated };
        }
      })
      .addCase(updatePartyPlotThunk.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      // ── delete ───────────────────────────────────
      .addCase(deletePartyPlotThunk.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(deletePartyPlotThunk.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.list = state.list.filter((p) => p.id !== action.payload);
      })
      .addCase(deletePartyPlotThunk.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      // ── create tickets ───────────────────────────
      .addCase(createTicketsThunk.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createTicketsThunk.fulfilled, (state, action) => {
        state.actionLoading = false;
        // Optionally update currentPartyPlot
      })
      .addCase(createTicketsThunk.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      // ── book tickets ─────────────────────────────
      .addCase(bookTicketsThunk.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(bookTicketsThunk.fulfilled, (state, action) => {
        state.actionLoading = false;
        // Optionally update
      })
      .addCase(bookTicketsThunk.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      // ── scan ticket ──────────────────────────────
      .addCase(scanTicketThunk.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(scanTicketThunk.fulfilled, (state, action) => {
        state.actionLoading = false;
        // Handle scan result - perhaps update ticket status in list
        if (state.currentPartyPlot && state.currentPartyPlot.tickets) {
          const ticketIndex = state.currentPartyPlot.tickets.findIndex(
            (t) => t.barcode === action.meta.arg,
          );
          if (ticketIndex !== -1) {
            state.currentPartyPlot.tickets[ticketIndex].status = "used";
          }
        }
      })
      .addCase(scanTicketThunk.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPartyPlotError, clearCurrentPartyPlot } =
  partyPlotSlice.actions;
export default partyPlotSlice.reducer;
