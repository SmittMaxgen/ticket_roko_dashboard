import { createSlice } from "@reduxjs/toolkit";

import {
  fetchLabels,
  fetchLabelById,
  createLabel,
  updateLabel,
  toggleLabelStatus,
  reorderLabels,
  deleteLabel,
} from "../labels/labelThunks";

const initialState = {
  items: [],
  selected: null,

  total: 0,
  page: 1,
  totalPages: 1,

  loading: false,
  actionLoading: false,

  error: null,
};

const labelSlice = createSlice({
  name: "labels",

  initialState,

  reducers: {
    clearSelected: (state) => {
      state.selected = null;
    },

    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchLabels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchLabels.fulfilled, (state, action) => {
        state.loading = false;

        state.items = action.payload.data || [];
        state.total = action.payload.total || 0;
        state.page = action.payload.page || 1;
        state.totalPages = action.payload.totalPages || 1;
      })

      .addCase(fetchLabels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ======================================================
      // FETCH BY ID
      // ======================================================

      .addCase(fetchLabelById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchLabelById.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload;
      })

      .addCase(fetchLabelById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ======================================================
      // CREATE
      // ======================================================

      .addCase(createLabel.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })

      .addCase(createLabel.fulfilled, (state, action) => {
        state.actionLoading = false;

        state.items.unshift(action.payload);

        state.total += 1;
      })

      .addCase(createLabel.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // ======================================================
      // UPDATE
      // ======================================================

      .addCase(updateLabel.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })

      .addCase(updateLabel.fulfilled, (state, action) => {
        state.actionLoading = false;

        const index = state.items.findIndex(
          (item) => item.id === action.payload.id,
        );

        if (index !== -1) {
          state.items[index] = action.payload;
        }

        if (state.selected?.id === action.payload.id) {
          state.selected = action.payload;
        }
      })

      .addCase(updateLabel.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // ======================================================
      // TOGGLE STATUS
      // ======================================================

      .addCase(toggleLabelStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id,
        );

        if (index !== -1) {
          state.items[index] = action.payload;
        }

        if (state.selected?.id === action.payload.id) {
          state.selected = action.payload;
        }
      })

      .addCase(toggleLabelStatus.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ======================================================
      // REORDER
      // ======================================================

      .addCase(reorderLabels.fulfilled, (state, action) => {
        action.payload.forEach((updatedItem) => {
          const item = state.items.find((x) => x.id === updatedItem.id);

          if (item) {
            item.sort_order = updatedItem.sort_order;
          }
        });

        state.items.sort((a, b) => a.sort_order - b.sort_order);
      })

      .addCase(reorderLabels.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ======================================================
      // DELETE
      // ======================================================

      .addCase(deleteLabel.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })

      .addCase(deleteLabel.fulfilled, (state, action) => {
        state.actionLoading = false;

        state.items = state.items.filter((item) => item.id !== action.payload);

        state.total -= 1;
      })

      .addCase(deleteLabel.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelected, clearError } = labelSlice.actions;

export default labelSlice.reducer;
