import { createSlice } from "@reduxjs/toolkit";
import {
  fetchSectionsThunk,
  fetchDrawToolsThunk,
  fetchSeatShapesThunk,
  createSectionThunk,
  updateSectionThunk,
  deleteSectionThunk,
} from "../options/optionsThunks";

const optionsSlice = createSlice({
  name: "options",
  initialState: {
    sections: [],
    drawTools: [],
    seatShapes: [],
    loading: false,
    actionLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Fetch sections
    builder
      .addCase(fetchSectionsThunk.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchSectionsThunk.fulfilled, (s, a) => {
        s.loading = false;
        s.sections = a.payload;
      })
      .addCase(fetchSectionsThunk.rejected, (s) => {
        s.loading = false;
      })

      // Fetch draw tools
      .addCase(fetchDrawToolsThunk.fulfilled, (s, a) => {
        s.drawTools = a.payload;
      })

      // Fetch seat shapes
      .addCase(fetchSeatShapesThunk.fulfilled, (s, a) => {
        s.seatShapes = a.payload;
      })

      // Create section
      .addCase(createSectionThunk.pending, (s) => {
        s.actionLoading = true;
      })
      .addCase(createSectionThunk.fulfilled, (s, a) => {
        s.actionLoading = false;
        s.sections.push(a.payload);
      })
      .addCase(createSectionThunk.rejected, (s) => {
        s.actionLoading = false;
      })

      // Update section
      .addCase(updateSectionThunk.fulfilled, (s, a) => {
        const idx = s.sections.findIndex((x) => x.id === a.payload.id);
        if (idx !== -1) s.sections[idx] = a.payload;
      })

      // Delete section
      .addCase(deleteSectionThunk.fulfilled, (s, a) => {
        s.sections = s.sections.filter((x) => x.id !== a.payload);
      });
  },
});

export default optionsSlice.reducer;
