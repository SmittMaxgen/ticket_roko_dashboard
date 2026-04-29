// src/features/bookings/bookingSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchBookingsThunk,
  fetchBookingByIdThunk,
  cancelBookingThunk,
  fetchBookingStatsThunk,
  createBookingThunk,
  fetchBookingLayoutThunk,
} from "./bookingThunks";

const bookingSlice = createSlice({
  name: "bookings",
  initialState: {
    list: [],
    current: null,
    total: 0,
    stats: null,
    layout: null,
    loading: false,
    actionLoading: false,
    error: null,
  },
  reducers: {
    clearBookingError: (state) => {
      state.error = null;
    },
    clearCurrentBooking: (state) => {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookingsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchBookingsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createBookingThunk.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })

      .addCase(createBookingThunk.fulfilled, (state, action) => {
        state.actionLoading = false;

        // insert new booking at top (instant UI update)
        if (action.payload) {
          state.list.unshift(action.payload);
          state.total += 1;
        }
      })

      .addCase(createBookingThunk.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchBookingByIdThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBookingByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchBookingByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Optimistic cancel
      .addCase(cancelBookingThunk.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(cancelBookingThunk.fulfilled, (state, action) => {
        state.actionLoading = false;
        const booking = state.list.find((b) => b.id === action.payload);
        if (booking) {
          booking.status = "cancelled";
          booking.payment_status = "refunded";
        }
      })
      .addCase(cancelBookingThunk.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchBookingStatsThunk.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchBookingLayoutThunk.fulfilled, (state, action) => {
        state.layout = action.payload;
      });
  },
});

export const { clearBookingError, clearCurrentBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
