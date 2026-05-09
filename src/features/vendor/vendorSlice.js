import { createSlice } from "@reduxjs/toolkit";
import { createVendorThunk, getMyVendorThunk } from "./vendorThunks";

const initialState = {
  vendor: null,

  loading: false,
  createLoading: false,

  success: false,
  error: null,
};

const vendorSlice = createSlice({
  name: "vendor",
  initialState,

  reducers: {
    resetVendorState: (state) => {
      state.loading = false;
      state.createLoading = false;
      state.success = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createVendorThunk.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })

      .addCase(createVendorThunk.fulfilled, (state, action) => {
        state.createLoading = false;
        state.success = true;
        state.vendor = action.payload.vendor;
      })

      .addCase(createVendorThunk.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload?.message;
      })

      // GET
      .addCase(getMyVendorThunk.pending, (state) => {
        state.loading = true;
      })

      .addCase(getMyVendorThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.vendor = action.payload.vendor;
      })

      .addCase(getMyVendorThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });
  },
});

export const { resetVendorState } = vendorSlice.actions;

export default vendorSlice.reducer;
