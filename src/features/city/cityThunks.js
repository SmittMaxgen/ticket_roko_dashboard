import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

// ─── City Thunks ─────────────────────────────────────────────────────────────

export const fetchCities = createAsyncThunk(
  "cities/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/cities", { params });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch cities",
      );
    }
  },
);

export const fetchCityById = createAsyncThunk(
  "cities/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/cities/${id}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch city",
      );
    }
  },
);

export const createCity = createAsyncThunk(
  "cities/create",
  async (cityData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.entries(cityData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          formData.append(key, value);
        }
      });
      const { data } = await api.post("/cities", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create city",
      );
    }
  },
);

export const updateCity = createAsyncThunk(
  "cities/update",
  async ({ id, cityData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.entries(cityData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          formData.append(key, value);
        }
      });
      const { data } = await api.put(`/cities/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update city",
      );
    }
  },
);

export const deleteCity = createAsyncThunk(
  "cities/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/cities/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete city",
      );
    }
  },
);
