// // src/features/halls/hallSelectors.js

// export const selectHallList = (state) => state.halls.list;
// export const selectCurrentHall = (state) => state.halls.currentHall;
// export const selectHallLoading = (state) => state.halls.loading;
// export const selectHallActionLoading = (state) => state.halls.actionLoading;
// export const selectHallError = (state) => state.halls.error;
// src/features/halls/hallSelectors.js
export const selectHallList = (state) => state.halls.list;
export const selectCurrentHall = (state) => state.halls.currentHall;
export const selectHallStats = (state) => state.halls.stats;
export const selectHallLoading = (state) => state.halls.loading;
export const selectHallActionLoading = (state) => state.halls.actionLoading;
export const selectHallError = (state) => state.halls.error;

// Seats from current hall (flat array)
export const selectCurrentHallSeats = (state) =>
  state.halls.currentHall?.seats || [];
// Rows grouped object from current hall
export const selectCurrentHallRows = (state) =>
  state.halls.currentHall?.rows || {};
