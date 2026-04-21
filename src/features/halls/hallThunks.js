// src/features/halls/hallThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchHallsThunk = createAsyncThunk(
  "halls/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/halls");
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch halls",
      );
    }
  },
);

export const fetchHallByIdThunk = createAsyncThunk(
  "halls/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/halls/${id}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Hall not found");
    }
  },
);

export const createHallThunk = createAsyncThunk(
  "halls/create",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/halls", payload);
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create hall",
      );
    }
  },
);

export const updateHallThunk = createAsyncThunk(
  "halls/update",
  async ({ id, ...payload }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/halls/${id}`, payload);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update hall",
      );
    }
  },
);

export const deleteHallThunk = createAsyncThunk(
  "halls/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/halls/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete hall",
      );
    }
  },
);
