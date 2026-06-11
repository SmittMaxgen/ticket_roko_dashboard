import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCities,
  fetchCityById,
  createCity,
  updateCity,
  deleteCity,
} from "./cityThunks";

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

const citySlice = createSlice({
  name: "cities",
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
      // Fetch All Cities
      .addCase(fetchCities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        state.total = action.payload.total || 0;
        state.page = action.payload.page || 1;
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch City By ID
      .addCase(fetchCityById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCityById.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload;
      })
      .addCase(fetchCityById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create City
      .addCase(createCity.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createCity.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.items.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createCity.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // Update City
      .addCase(updateCity.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateCity.fulfilled, (state, action) => {
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
      .addCase(updateCity.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // Delete City
      .addCase(deleteCity.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(deleteCity.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.total -= 1;
      })
      .addCase(deleteCity.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelected, clearError } = citySlice.actions;
export default citySlice.reducer;
