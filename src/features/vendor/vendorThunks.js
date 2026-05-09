import { createAsyncThunk } from "@reduxjs/toolkit";
// import axiosInstance from "";

import api from "../../api/axios";

// CREATE VENDOR
export const createVendorThunk = createAsyncThunk(
  "vendor/createVendor",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post("/vendor", payload);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to create vendor",
        },
      );
    }
  },
);

// GET MY VENDOR
export const getMyVendorThunk = createAsyncThunk(
  "vendor/getMyVendor",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/vendor/me");

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to fetch vendor",
        },
      );
    }
  },
);
