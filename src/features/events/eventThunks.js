// src/features/events/eventThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchEventsThunk = createAsyncThunk(
  "events/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/events", { params });
      return { data: data.data, total: data.total };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch events",
      );
    }
  },
);

export const fetchEventByIdThunk = createAsyncThunk(
  "events/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/events/${id}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Event not found");
    }
  },
);

export const createEventThunk = createAsyncThunk(
  "events/create",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/events", payload);
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create event",
      );
    }
  },
);

export const updateEventThunk = createAsyncThunk(
  "events/update",
  async ({ id, ...payload }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/events/${id}`, payload);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update event",
      );
    }
  },
);

export const approveEventThunk = createAsyncThunk(
  "events/approve",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/events/${id}/approve`);
      return { id, ...data };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to approve",
      );
    }
  },
);

export const rejectEventThunk = createAsyncThunk(
  "events/reject",
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/events/${id}/reject`, { reason });
      return { id, ...data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to reject");
    }
  },
);

export const deleteEventThunk = createAsyncThunk(
  "events/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/events/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete");
    }
  },
);

export const fetchEventStatsThunk = createAsyncThunk(
  "events/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/events/stats/summary");
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch stats",
      );
    }
  },
);
