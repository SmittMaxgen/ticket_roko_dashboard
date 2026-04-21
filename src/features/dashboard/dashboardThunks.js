// src/features/dashboard/dashboardThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchDashboardOverviewThunk = createAsyncThunk(
  "dashboard/fetchOverview",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/dashboard/overview");
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch overview",
      );
    }
  },
);

export const fetchRevenueChartThunk = createAsyncThunk(
  "dashboard/fetchRevenueChart",
  async (period = 30, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        `/dashboard/revenue-chart?period=${period}`,
      );
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch chart",
      );
    }
  },
);

export const fetchTopEventsThunk = createAsyncThunk(
  "dashboard/fetchTopEvents",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/dashboard/top-events");
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch top events",
      );
    }
  },
);

export const fetchRecentBookingsThunk = createAsyncThunk(
  "dashboard/fetchRecentBookings",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/dashboard/recent-bookings");
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch recent bookings",
      );
    }
  },
);

export const fetchCategoryStatsThunk = createAsyncThunk(
  "dashboard/fetchCategoryStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/dashboard/category-stats");
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch category stats",
      );
    }
  },
);

// Fetches all dashboard data in one dispatch
export const fetchAllDashboardThunk = createAsyncThunk(
  "dashboard/fetchAll",
  async (_, { dispatch }) => {
    await Promise.all([
      dispatch(fetchDashboardOverviewThunk()),
      dispatch(fetchRevenueChartThunk(30)),
      dispatch(fetchTopEventsThunk()),
      dispatch(fetchRecentBookingsThunk()),
      dispatch(fetchCategoryStatsThunk()),
    ]);
  },
);
