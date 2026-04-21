// src/features/events/eventSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchEventsThunk,
  fetchEventByIdThunk,
  createEventThunk,
  updateEventThunk,
  approveEventThunk,
  rejectEventThunk,
  deleteEventThunk,
  fetchEventStatsThunk,
} from "./eventThunks";

const eventSlice = createSlice({
  name: "events",
  initialState: {
    list: [],
    current: null,
    total: 0,
    stats: null,
    loading: false,
    actionLoading: false,
    error: null,
  },
  reducers: {
    clearEventError: (state) => {
      state.error = null;
    },
    clearCurrent: (state) => {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── fetch list ────────────────────────────────
      .addCase(fetchEventsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchEventsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── fetch single ──────────────────────────────
      .addCase(fetchEventByIdThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEventByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchEventByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── create ────────────────────────────────────
      .addCase(createEventThunk.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(createEventThunk.fulfilled, (state) => {
        state.actionLoading = false;
      })
      .addCase(createEventThunk.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // ── update ────────────────────────────────────
      .addCase(updateEventThunk.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(updateEventThunk.fulfilled, (state) => {
        state.actionLoading = false;
      })
      .addCase(updateEventThunk.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // ── approve ───────────────────────────────────
      .addCase(approveEventThunk.fulfilled, (state, action) => {
        const idx = state.list.findIndex((e) => e.id === action.payload.id);
        if (idx !== -1) state.list[idx].status = "approved";
      })

      // ── reject ────────────────────────────────────
      .addCase(rejectEventThunk.fulfilled, (state, action) => {
        const idx = state.list.findIndex((e) => e.id === action.payload.id);
        if (idx !== -1) state.list[idx].status = "rejected";
      })

      // ── delete ────────────────────────────────────
      .addCase(deleteEventThunk.fulfilled, (state, action) => {
        state.list = state.list.filter((e) => e.id !== action.payload);
      })

      // ── stats ─────────────────────────────────────
      .addCase(fetchEventStatsThunk.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const { clearEventError, clearCurrent } = eventSlice.actions;
export default eventSlice.reducer;
