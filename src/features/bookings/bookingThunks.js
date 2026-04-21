// src/features/bookings/bookingThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchBookingsThunk = createAsyncThunk(
  "bookings/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/bookings", { params });
      return { data: data.data, total: data.total };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch bookings",
      );
    }
  },
);

export const fetchBookingByIdThunk = createAsyncThunk(
  "bookings/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/bookings/${id}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Booking not found",
      );
    }
  },
);

export const cancelBookingThunk = createAsyncThunk(
  "bookings/cancel",
  async (id, { rejectWithValue }) => {
    try {
      await api.patch(`/bookings/${id}/cancel`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to cancel booking",
      );
    }
  },
);

export const fetchBookingStatsThunk = createAsyncThunk(
  "bookings/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/bookings/stats/summary");
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch stats",
      );
    }
  },
);
