import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchLabels = createAsyncThunk(
  "labels/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/labels", { params });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch labels",
      );
    }
  },
);

export const fetchLabelById = createAsyncThunk(
  "labels/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/labels/${id}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch label",
      );
    }
  },
);

export const createLabel = createAsyncThunk(
  "labels/create",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/labels", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create label",
      );
    }
  },
);

export const updateLabel = createAsyncThunk(
  "labels/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/labels/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update label",
      );
    }
  },
);

export const toggleLabelStatus = createAsyncThunk(
  "labels/toggleStatus",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/labels/${id}/status`);
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to toggle status",
      );
    }
  },
);

export const reorderLabels = createAsyncThunk(
  "labels/reorder",
  async (items, { rejectWithValue }) => {
    try {
      await api.patch("/labels/reorder", { items });
      return items;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to reorder",
      );
    }
  },
);

export const deleteLabel = createAsyncThunk(
  "labels/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/labels/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete label",
      );
    }
  },
);

// ─── Slice ────────────────────────────────────────────────────────────────────
