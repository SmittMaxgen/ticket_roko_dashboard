// features/options/optionsThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

/* SECTIONS */
export const fetchSectionsThunk = createAsyncThunk(
  "options/fetchSections",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/sections");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch sections",
      );
    }
  },
);

export const createSectionThunk = createAsyncThunk(
  "options/createSection",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post("/sections", payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create section",
      );
    }
  },
);

export const updateSectionThunk = createAsyncThunk(
  "options/updateSection",
  async ({ id_key, ...payload }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/sections/${id_key}`, payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update section",
      );
    }
  },
);

export const deleteSectionThunk = createAsyncThunk(
  "options/deleteSection",
  async (id_key, { rejectWithValue }) => {
    try {
      await api.delete(`/sections/${id_key}`);
      return id_key;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete section",
      );
    }
  },
);

/* DRAW TOOLS */
export const fetchDrawToolsThunk = createAsyncThunk(
  "options/fetchDrawTools",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/tools/draw-tools");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch draw tools",
      );
    }
  },
);

/* SEAT SHAPES */
export const fetchSeatShapesThunk = createAsyncThunk(
  "options/fetchSeatShapes",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/tools/seat-shapes");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch seat shapes",
      );
    }
  },
);

export const updateSeatLabelThunk = createAsyncThunk(
  "options/updateSeatLabel",
  async ({ hallId, seat_ids, section_label }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/halls/${hallId}/seats/label`, {
        seat_ids,
        section_label,
      });
      console.log("res.data", res?.data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update labels",
      );
    }
  },
);
