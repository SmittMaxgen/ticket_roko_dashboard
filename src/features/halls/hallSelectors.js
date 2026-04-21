// src/features/halls/hallSelectors.js

export const selectHallList = (state) => state.halls.list;
export const selectCurrentHall = (state) => state.halls.currentHall;
export const selectHallLoading = (state) => state.halls.loading;
export const selectHallActionLoading = (state) => state.halls.actionLoading;
export const selectHallError = (state) => state.halls.error;
