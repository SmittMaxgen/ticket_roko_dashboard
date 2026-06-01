// features/advertisements/advertisementSlice.js

import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAdvertisements,
  createAdvertisement,
  updateAdvertisement,
  deleteAdvertisement,
  toggleAdvertisementStatus,
} from "./advertisementThunks";

const initialState = {
  items: [],
  total: 0,
  totalPages: 1,
  page: 1,
  loading: false,
  actionLoading: false,
  error: null,
};

const advertisementSlice = createSlice({
  name: "advertisements",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── Fetch All ──────────────────────────────────────────────────────────
    builder
      .addCase(fetchAdvertisements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdvertisements.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.page = action.payload.page;
      })
      .addCase(fetchAdvertisements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── Create ─────────────────────────────────────────────────────────────
    builder
      .addCase(createAdvertisement.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createAdvertisement.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.items.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createAdvertisement.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });

    // ── Update ─────────────────────────────────────────────────────────────
    builder
      .addCase(updateAdvertisement.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateAdvertisement.fulfilled, (state, action) => {
        state.actionLoading = false;
        const idx = state.items.findIndex((i) => i.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateAdvertisement.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });

    // ── Delete ─────────────────────────────────────────────────────────────
    builder
      .addCase(deleteAdvertisement.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(deleteAdvertisement.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.items = state.items.filter((i) => i.id !== action.payload);
        state.total -= 1;
      })
      .addCase(deleteAdvertisement.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });

    // ── Toggle Status ──────────────────────────────────────────────────────
    builder
      .addCase(toggleAdvertisementStatus.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(toggleAdvertisementStatus.fulfilled, (state, action) => {
        state.actionLoading = false;
        const idx = state.items.findIndex((i) => i.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(toggleAdvertisementStatus.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = advertisementSlice.actions;
export default advertisementSlice.reducer;
