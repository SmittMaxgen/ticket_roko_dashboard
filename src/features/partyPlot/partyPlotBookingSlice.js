import { createSlice } from "@reduxjs/toolkit";

import {
  fetchPartyPlotBookingsThunk,
  fetchPartyPlotBookingByIdThunk,
} from "./partyPlotBookingThunks";

const initialState = {
  bookings: [],
  total: 0,

  currentBooking: null,

  loading: false,

  error: null,
};

const partyPlotBookingSlice = createSlice({
  name: "partyPlotBookings",

  initialState,

  reducers: {
    clearCurrentPartyPlotBooking: (state) => {
      state.currentBooking = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* GET ALL */
      .addCase(fetchPartyPlotBookingsThunk.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchPartyPlotBookingsThunk.fulfilled, (state, action) => {
        state.loading = false;

        state.bookings = action.payload.data || [];

        state.total = action.payload.total || 0;
      })

      .addCase(fetchPartyPlotBookingsThunk.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload;
      })

      /* GET SINGLE */
      .addCase(fetchPartyPlotBookingByIdThunk.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchPartyPlotBookingByIdThunk.fulfilled, (state, action) => {
        state.loading = false;

        state.currentBooking = action.payload.data;
      })

      .addCase(fetchPartyPlotBookingByIdThunk.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload;
      });
  },
});

export const { clearCurrentPartyPlotBooking } = partyPlotBookingSlice.actions;

export default partyPlotBookingSlice.reducer;
