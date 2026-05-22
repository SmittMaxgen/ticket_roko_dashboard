import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchAssignedEvents = createAsyncThunk(
  "ticketChecker/fetchAssignedEvents",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/events/assigned");
      return response.data?.data || response.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const fetchAssignedPartyPlots = createAsyncThunk(
  "ticketChecker/fetchAssignedPartyPlots",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/party-plots/assigned");
      return response.data?.data || response.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const scanTicketThunk = createAsyncThunk(
  "ticketChecker/scanTicket",
  async ({ type, barcode }, thunkAPI) => {
    try {
      const url =
        type === "event" ? "/events/scan-ticket" : "/party-plots/scan-ticket";

      const response = await api.post(url, { barcode });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);
