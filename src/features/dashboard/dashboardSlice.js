// src/features/dashboard/dashboardSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchDashboardOverviewThunk,
  fetchRevenueChartThunk,
  fetchTopEventsThunk,
  fetchRecentBookingsThunk,
  fetchCategoryStatsThunk,
} from "./dashboardThunks";

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    overview: null,
    revenueChart: [],
    topEvents: [],
    recentBookings: [],
    categoryStats: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardOverviewThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardOverviewThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.overview = action.payload;
      })
      .addCase(fetchDashboardOverviewThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchRevenueChartThunk.fulfilled, (state, action) => {
        state.revenueChart = action.payload.map((d) => ({
          ...d,
          revenue: +d.revenue || 0,
        }));
      })

      .addCase(fetchTopEventsThunk.fulfilled, (state, action) => {
        state.topEvents = action.payload;
      })

      .addCase(fetchRecentBookingsThunk.fulfilled, (state, action) => {
        state.recentBookings = action.payload;
      })

      .addCase(fetchCategoryStatsThunk.fulfilled, (state, action) => {
        state.categoryStats = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
