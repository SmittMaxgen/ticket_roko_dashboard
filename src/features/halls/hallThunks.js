// // src/features/halls/hallThunks.js
// import { createAsyncThunk } from "@reduxjs/toolkit";
// import api from "../../api/axios";

// export const fetchHallsThunk = createAsyncThunk(
//   "halls/fetchAll",
//   async (_, { rejectWithValue }) => {
//     try {
//       const { data } = await api.get("/halls");
//       return data.data;
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to fetch halls",
//       );
//     }
//   },
// );

// export const fetchHallByIdThunk = createAsyncThunk(
//   "halls/fetchById",
//   async (id, { rejectWithValue }) => {
//     try {
//       const { data } = await api.get(`/halls/${id}`);
//       return data.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Hall not found");
//     }
//   },
// );

// export const createHallThunk = createAsyncThunk(
//   "halls/create",
//   async (payload, { rejectWithValue }) => {
//     try {
//       const { data } = await api.post("/halls", payload);
//       return data.data;
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to create hall",
//       );
//     }
//   },
// );

// export const updateHallThunk = createAsyncThunk(
//   "halls/update",
//   async ({ id, ...payload }, { rejectWithValue }) => {
//     try {
//       const { data } = await api.put(`/halls/${id}`, payload);
//       return data;
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to update hall",
//       );
//     }
//   },
// );

// export const deleteHallThunk = createAsyncThunk(
//   "halls/delete",
//   async (id, { rejectWithValue }) => {
//     try {
//       await api.delete(`/halls/${id}`);
//       return id;
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to delete hall",
//       );
//     }
//   },
// );

// src/features/halls/hallThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

// ─────────────────────────────────────────────────────────────
// SERIALISE DRAW LAYOUT → API payload
// Converts Draw Mode canvas state into the POST /api/halls body.
//
// placedRows:  [{ id, pts:[{x,y}], color, sectionId, shape, startX,startY,endX,endY,angle }]
// placedSeats: [{ id, x, y, color, sectionId, shape }]
// sections:    [{ id, label, color, price, seat_type }]
// ─────────────────────────────────────────────────────────────
export const serialiseDrawLayout = ({
  placedRows = [],
  placedSeats = [],
  sections = [],
  canvasWidth = 800,
  canvasHeight = 600,
}) => {
  const secMap = {};
  sections.forEach((s) => {
    secMap[s.id] = {
      label: s.label,
      color: s.color,
      price: s.price || 0,
      seat_type: s.seat_type || "standard",
    };
  });

  let globalColIdx = 0; // running column counter across all rows
  const seats = [];

  // Track rows by their Y position to assign row labels
  // Group placed rows by approximate Y so we can assign A, B, C labels
  const rowGroups = {};
  placedRows.forEach((row) => {
    const yKey = Math.round((row.pts[0]?.y || 0) / 30); // snap to ~30px bands
    if (!rowGroups[yKey]) rowGroups[yKey] = [];
    rowGroups[yKey].push(row);
  });

  const sortedYKeys = Object.keys(rowGroups).sort((a, b) => +a - +b);
  let rowLabelIdx = 0;

  sortedYKeys.forEach((yKey) => {
    const rowsAtY = rowGroups[yKey];
    const rowLabel = String.fromCharCode(65 + rowLabelIdx); // A, B, C...
    rowLabelIdx++;

    // Sort rows left to right within the same Y band
    rowsAtY.sort((a, b) => (a.pts[0]?.x || 0) - (b.pts[0]?.x || 0));

    let colIdx = 1;
    rowsAtY.forEach((row) => {
      const sec = secMap[row.sectionId] || {
        label: "General",
        color: "#b2b2b2",
        price: 0,
        seat_type: "standard",
      };

      row.pts.forEach((pt, i) => {
        seats.push({
          seat_name: `${rowLabel}${colIdx}`,
          row_label: rowLabel,
          col_index: colIdx,
          seat_type: sec.seat_type,
          is_space: false,
          section_label: sec.label,
          price: sec.price,
          x_pos: Math.round(pt.x * 100) / 100,
          y_pos: Math.round(pt.y * 100) / 100,
          fill: sec.color,
          sort_order: colIdx - 1,
        });
        colIdx++;
      });

      // Add aisle gap between row segments in the same Y band
      if (rowsAtY.indexOf(row) < rowsAtY.length - 1) {
        seats.push({
          seat_name: `${rowLabel}-SPC-${colIdx}`,
          row_label: rowLabel,
          col_index: colIdx,
          seat_type: "space",
          is_space: true,
          price: 0,
          x_pos: 0,
          y_pos: 0,
          fill: "#2a2a35",
          sort_order: colIdx - 1,
        });
        colIdx++;
      }
    });
  });

  // Individual placed seats (not in rows)
  placedSeats.forEach((s, i) => {
    const sec = secMap[s.sectionId] || {
      label: "General",
      color: "#b2b2b2",
      price: 0,
      seat_type: "standard",
    };
    seats.push({
      seat_name: `S${i + 1}`,
      row_label: "S",
      col_index: i + 1,
      seat_type: sec.seat_type,
      is_space: false,
      section_label: sec.label,
      price: sec.price,
      x_pos: Math.round(s.x * 100) / 100,
      y_pos: Math.round(s.y * 100) / 100,
      fill: sec.color,
      sort_order: i,
    });
  });

  return { seats, canvas_width: canvasWidth, canvas_height: canvasHeight };
};

// ─── Thunks ───────────────────────────────────────────────────

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
  async ({ id, event_id } = {}, { rejectWithValue }) => {
    try {
      const params = event_id ? { event_id } : {};
      const { data } = await api.get(`/halls/${id}`, { params });
      return data.data; // { id, name, seats:[], rows:{} }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Hall not found");
    }
  },
);

// createHallThunk — accepts full canvas payload from serialiseDrawLayout
// { name, description, hall_type, address, city, canvas_width, canvas_height, seats:[] }
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

export const fetchHallStatsThunk = createAsyncThunk(
  "halls/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/halls/stats");
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch stats",
      );
    }
  },
);
