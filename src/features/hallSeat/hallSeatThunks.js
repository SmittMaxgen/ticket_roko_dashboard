// // src/features/seats/seatThunks.js
// import { createAsyncThunk } from "@reduxjs/toolkit";
// import api from "../../api/axios";

// export const fetchSeatsThunk = createAsyncThunk(
//   "seats/fetchByHall",
//   async ({ hall_id, row_label, seat_type } = {}, { rejectWithValue }) => {
//     try {
//       const params = { hall_id };
//       if (row_label) params.row_label = row_label;
//       if (seat_type) params.seat_type = seat_type;
//       const { data } = await api.get("/seats", { params });
//       return data.data;
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to fetch seats",
//       );
//     }
//   },
// );

// export const fetchSeatByIdThunk = createAsyncThunk(
//   "seats/fetchById",
//   async (id, { rejectWithValue }) => {
//     try {
//       const { data } = await api.get(`/seats/${id}`);
//       return data.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Seat not found");
//     }
//   },
// );

// export const createSeatThunk = createAsyncThunk(
//   "seats/create",
//   async (payload, { rejectWithValue }) => {
//     try {
//       const { data } = await api.post("/seats", payload);
//       return data.data;
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to create seat",
//       );
//     }
//   },
// );

// // Used by Draw Mode — saves all drawn seats in one call
// export const bulkCreateSeatsThunk = createAsyncThunk(
//   "seats/bulkCreate",
//   async ({ hall_id, seats }, { rejectWithValue }) => {
//     try {
//       const { data } = await api.post("/seats/bulk", { hall_id, seats });
//       return data;
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to bulk create seats",
//       );
//     }
//   },
// );

// export const updateSeatThunk = createAsyncThunk(
//   "seats/update",
//   async ({ id, ...payload }, { rejectWithValue }) => {
//     try {
//       const { data } = await api.put(`/seats/${id}`, payload);
//       return data;
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to update seat",
//       );
//     }
//   },
// );

// export const deleteSeatThunk = createAsyncThunk(
//   "seats/delete",
//   async (id, { rejectWithValue }) => {
//     try {
//       await api.delete(`/seats/${id}`);
//       return id;
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to delete seat",
//       );
//     }
//   },
// );

// export const clearHallSeatsThunk = createAsyncThunk(
//   "seats/clearHall",
//   async (hall_id, { rejectWithValue }) => {
//     try {
//       const { data } = await api.delete(`/seats/hall/${hall_id}`);
//       return { hall_id, ...data };
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to clear seats",
//       );
//     }
//   },
// );


// src/features/seats/seatThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchSeatsThunk = createAsyncThunk(
  "seats/fetchByHall",
  async ({ hall_id, row_label, seat_type } = {}, { rejectWithValue }) => {
    try {
      const params = { hall_id };
      if (row_label) params.row_label = row_label;
      if (seat_type) params.seat_type = seat_type;
      const { data } = await api.get("/seats", { params });
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch seats");
    }
  }
);

export const fetchSeatByIdThunk = createAsyncThunk(
  "seats/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/seats/${id}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Seat not found");
    }
  }
);

export const createSeatThunk = createAsyncThunk(
  "seats/create",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/seats", payload);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create seat");
    }
  }
);

export const bulkCreateSeatsThunk = createAsyncThunk(
  "seats/bulkCreate",
  async ({ hall_id, seats }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/seats/bulk", { hall_id, seats });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to bulk create seats");
    }
  }
);

export const updateSeatThunk = createAsyncThunk(
  "seats/update",
  async ({ id, ...payload }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/seats/${id}`, payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update seat");
    }
  }
);

export const deleteSeatThunk = createAsyncThunk(
  "seats/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/seats/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete seat");
    }
  }
);

export const clearHallSeatsThunk = createAsyncThunk(
  "seats/clearHall",
  async (hall_id, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/seats/hall/${hall_id}`);
      return { hall_id, ...data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to clear seats");
    }
  }
);