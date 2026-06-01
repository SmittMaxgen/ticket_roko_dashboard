// features/advertisements/advertisementThunks.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios";

export const fetchAdvertisements = createAsyncThunk(
  "advertisements/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/advertisements", { params });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch advertisements",
      );
    }
  },
);

export const createAdvertisement = createAsyncThunk(
  "advertisements/create",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/advertisements", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create advertisement",
      );
    }
  },
);

export const updateAdvertisement = createAsyncThunk(
  "advertisements/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/advertisements/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update advertisement",
      );
    }
  },
);

export const deleteAdvertisement = createAsyncThunk(
  "advertisements/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/advertisements/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete advertisement",
      );
    }
  },
);

export const toggleAdvertisementStatus = createAsyncThunk(
  "advertisements/toggleStatus",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(
        `/advertisements/${id}/toggle-active`,
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to toggle status",
      );
    }
  },
);
