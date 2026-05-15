import { createAsyncThunk } from "@reduxjs/toolkit";

import axiosInstance from "../../api/axios";

/* GET BOOKINGS */
export const fetchPartyPlotBookingsThunk = createAsyncThunk(
  "partyPlotBookings/fetchAll",

  async (params, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/party-plot-bookings", {
        params,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed");
    }
  },
);

/* GET SINGLE */
export const fetchPartyPlotBookingByIdThunk = createAsyncThunk(
  "partyPlotBookings/fetchById",

  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/party-plot-bookings/${id}`);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed");
    }
  },
);
