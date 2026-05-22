import { createSlice } from "@reduxjs/toolkit";

import {
  fetchAssignedEvents,
  fetchAssignedPartyPlots,
  scanTicketThunk,
} from "./ticketCheckerThunks";

const initialState = {
  assignedEvents: [],
  assignedPartyPlots: [],
  loading: false,
  scanLoading: false,
  error: null,
};

const ticketCheckerSlice = createSlice({
  name: "ticketChecker",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      // EVENTS
      .addCase(fetchAssignedEvents.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchAssignedEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.assignedEvents = action.payload;
      })

      .addCase(fetchAssignedEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // PARTY PLOTS
      .addCase(fetchAssignedPartyPlots.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchAssignedPartyPlots.fulfilled, (state, action) => {
        state.loading = false;
        state.assignedPartyPlots = action.payload;
      })

      .addCase(fetchAssignedPartyPlots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // SCAN
      .addCase(scanTicketThunk.pending, (state) => {
        state.scanLoading = true;
      })

      .addCase(scanTicketThunk.fulfilled, (state) => {
        state.scanLoading = false;
      })

      .addCase(scanTicketThunk.rejected, (state, action) => {
        state.scanLoading = false;
        state.error = action.payload;
      });
  },
});

export default ticketCheckerSlice.reducer;
