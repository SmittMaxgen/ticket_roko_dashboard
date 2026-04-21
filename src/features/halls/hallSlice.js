// src/features/halls/hallSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchHallsThunk,
  fetchHallByIdThunk,
  createHallThunk,
  updateHallThunk,
  deleteHallThunk,
} from "./hallThunks";

const hallSlice = createSlice({
  name: "halls",
  initialState: {
    list: [],
    currentHall: null,
    loading: false,
    actionLoading: false,
    error: null,
  },
  reducers: {
    clearHallError: (state) => {
      state.error = null;
    },
    clearCurrentHall: (state) => {
      state.currentHall = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── fetch list ────────────────────────────────
      .addCase(fetchHallsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHallsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchHallsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── fetch single ──────────────────────────────
      .addCase(fetchHallByIdThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHallByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentHall = action.payload;
      })
      .addCase(fetchHallByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── create ────────────────────────────────────
      .addCase(createHallThunk.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(createHallThunk.fulfilled, (state) => {
        state.actionLoading = false;
      })
      .addCase(createHallThunk.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // ── update ────────────────────────────────────
      .addCase(updateHallThunk.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(updateHallThunk.fulfilled, (state) => {
        state.actionLoading = false;
      })
      .addCase(updateHallThunk.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // ── delete ────────────────────────────────────
      .addCase(deleteHallThunk.fulfilled, (state, action) => {
        state.list = state.list.filter((h) => h.id !== action.payload);
      });
  },
});

export const { clearHallError, clearCurrentHall } = hallSlice.actions;
export default hallSlice.reducer;
