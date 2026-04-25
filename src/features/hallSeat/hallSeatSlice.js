// // src/features/seats/seatSlice.js
// import { createSlice } from "@reduxjs/toolkit";
// import {
//   fetchSeatsThunk,
//   fetchSeatByIdThunk,
//   createSeatThunk,
//   bulkCreateSeatsThunk,
//   updateSeatThunk,
//   deleteSeatThunk,
//   clearHallSeatsThunk,
// } from "./hallSeatThunks";

// const seatSlice = createSlice({
//   name: "seats",
//   initialState: {
//     list: [], // flat array of seats for active hall
//     current: null,
//     loading: false,
//     actionLoading: false,
//     error: null,
//   },
//   reducers: {
//     clearSeatError: (state) => {
//       state.error = null;
//     },
//     clearSeats: (state) => {
//       state.list = [];
//     },
//     // Local seat status update when user selects (no API call)
//     toggleSeatSelected: (state, action) => {
//       const seat = state.list.find((s) => s.id === action.payload);
//       if (seat && !seat.is_space && seat.status !== "sold") {
//         seat.status = seat.status === "selected" ? "available" : "selected";
//       }
//     },
//     clearSelections: (state) => {
//       state.list = state.list.map((s) =>
//         s.status === "selected" ? { ...s, status: "available" } : s,
//       );
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // fetch
//       .addCase(fetchSeatsThunk.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchSeatsThunk.fulfilled, (state, action) => {
//         state.loading = false;
//         state.list = action.payload;
//       })
//       .addCase(fetchSeatsThunk.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // fetch by id
//       .addCase(fetchSeatByIdThunk.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchSeatByIdThunk.fulfilled, (state, action) => {
//         state.loading = false;
//         state.current = action.payload;
//       })
//       .addCase(fetchSeatByIdThunk.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // create
//       .addCase(createSeatThunk.pending, (state) => {
//         state.actionLoading = true;
//       })
//       .addCase(createSeatThunk.fulfilled, (state, action) => {
//         state.actionLoading = false;
//         state.list.push(action.payload);
//       })
//       .addCase(createSeatThunk.rejected, (state, action) => {
//         state.actionLoading = false;
//         state.error = action.payload;
//       })

//       // bulk create
//       .addCase(bulkCreateSeatsThunk.pending, (state) => {
//         state.actionLoading = true;
//       })
//       .addCase(bulkCreateSeatsThunk.fulfilled, (state) => {
//         state.actionLoading = false;
//       })
//       .addCase(bulkCreateSeatsThunk.rejected, (state, action) => {
//         state.actionLoading = false;
//         state.error = action.payload;
//       })

//       // update
//       .addCase(updateSeatThunk.pending, (state) => {
//         state.actionLoading = true;
//       })
//       .addCase(updateSeatThunk.fulfilled, (state) => {
//         state.actionLoading = false;
//       })
//       .addCase(updateSeatThunk.rejected, (state, action) => {
//         state.actionLoading = false;
//         state.error = action.payload;
//       })

//       // delete
//       .addCase(deleteSeatThunk.fulfilled, (state, action) => {
//         state.list = state.list.filter((s) => s.id !== action.payload);
//       })

//       // clear hall
//       .addCase(clearHallSeatsThunk.fulfilled, (state) => {
//         state.list = [];
//       });
//   },
// });

// export const {
//   clearSeatError,
//   clearSeats,
//   toggleSeatSelected,
//   clearSelections,
// } = seatSlice.actions;
// export default seatSlice.reducer;

// src/features/seats/seatSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchSeatsThunk,
  fetchSeatByIdThunk,
  createSeatThunk,
  bulkCreateSeatsThunk,
  updateSeatThunk,
  deleteSeatThunk,
  clearHallSeatsThunk,
} from "./hallSeatThunks";

const seatSlice = createSlice({
  name: "seats",
  initialState: {
    list: [],
    current: null,
    loading: false,
    actionLoading: false,
    error: null,
  },
  reducers: {
    clearSeatError: (state) => {
      state.error = null;
    },
    clearSeats: (state) => {
      state.list = [];
    },
    toggleSeatSelected: (state, action) => {
      const seat = state.list.find((s) => s.id === action.payload);
      if (seat && !seat.is_space && seat.status !== "sold") {
        seat.status = seat.status === "selected" ? "available" : "selected";
      }
    },
    clearSelections: (state) => {
      state.list = state.list.map((s) =>
        s.status === "selected" ? { ...s, status: "available" } : s,
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSeatsThunk.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchSeatsThunk.fulfilled, (s, a) => {
        s.loading = false;
        s.list = a.payload;
      })
      .addCase(fetchSeatsThunk.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      .addCase(fetchSeatByIdThunk.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchSeatByIdThunk.fulfilled, (s, a) => {
        s.loading = false;
        s.current = a.payload;
      })
      .addCase(fetchSeatByIdThunk.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      .addCase(createSeatThunk.pending, (s) => {
        s.actionLoading = true;
      })
      .addCase(createSeatThunk.fulfilled, (s, a) => {
        s.actionLoading = false;
        s.list.push(a.payload);
      })
      .addCase(createSeatThunk.rejected, (s, a) => {
        s.actionLoading = false;
        s.error = a.payload;
      })

      .addCase(bulkCreateSeatsThunk.pending, (s) => {
        s.actionLoading = true;
      })
      .addCase(bulkCreateSeatsThunk.fulfilled, (s) => {
        s.actionLoading = false;
      })
      .addCase(bulkCreateSeatsThunk.rejected, (s, a) => {
        s.actionLoading = false;
        s.error = a.payload;
      })

      .addCase(updateSeatThunk.pending, (s) => {
        s.actionLoading = true;
      })
      .addCase(updateSeatThunk.fulfilled, (s) => {
        s.actionLoading = false;
      })
      .addCase(updateSeatThunk.rejected, (s, a) => {
        s.actionLoading = false;
        s.error = a.payload;
      })

      .addCase(deleteSeatThunk.fulfilled, (s, a) => {
        s.list = s.list.filter((x) => x.id !== a.payload);
      })
      .addCase(clearHallSeatsThunk.fulfilled, (s) => {
        s.list = [];
      });
  },
});

export const {
  clearSeatError,
  clearSeats,
  toggleSeatSelected,
  clearSelections,
} = seatSlice.actions;
export default seatSlice.reducer;
