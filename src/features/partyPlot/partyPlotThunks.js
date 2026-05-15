// src/features/partyPlot/partyPlotThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchPartyPlotsThunk = createAsyncThunk(
  "partyPlot/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/party-plot-bookings");
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch party plots",
      );
    }
  },
);

export const fetchPartyPlotByIdThunk = createAsyncThunk(
  "partyPlot/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/party-plots/${id}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Party plot not found",
      );
    }
  },
);

export const createPartyPlotThunk = createAsyncThunk(
  "partyPlot/create",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/party-plots", payload);
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create party plot",
      );
    }
  },
);

export const updatePartyPlotThunk = createAsyncThunk(
  "partyPlot/update",
  async ({ id, ...payload }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/party-plots/${id}`, payload);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update party plot",
      );
    }
  },
);

export const deletePartyPlotThunk = createAsyncThunk(
  "partyPlot/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/party-plots/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete party plot",
      );
    }
  },
);

export const createTicketsThunk = createAsyncThunk(
  "partyPlot/createTickets",
  async ({ id, num_tickets }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/party-plots/${id}/create-tickets`, {
        num_tickets,
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create tickets",
      );
    }
  },
);

export const bookTicketsThunk = createAsyncThunk(
  "partyPlot/bookTickets",
  async ({ id, num_tickets }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/party-plots/${id}/book-tickets`, {
        num_tickets,
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to book tickets",
      );
    }
  },
);

export const scanTicketThunk = createAsyncThunk(
  "partyPlot/scanTicket",
  async (barcode, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/party-plots/scan-ticket", { barcode });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to scan ticket",
      );
    }
  },
);
