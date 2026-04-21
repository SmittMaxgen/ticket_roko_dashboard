// src/features/events/eventSelectors.js

export const selectEventList = (state) => state.events.list;
export const selectEventTotal = (state) => state.events.total;
export const selectCurrentEvent = (state) => state.events.current;
export const selectEventStats = (state) => state.events.stats;
export const selectEventLoading = (state) => state.events.loading;
export const selectEventActionLoading = (state) => state.events.actionLoading;
export const selectEventError = (state) => state.events.error;

// Derived selectors
export const selectPendingEvents = (state) =>
  state.events.list.filter((e) => e.status === "pending_approval");

export const selectApprovedEvents = (state) =>
  state.events.list.filter((e) => e.status === "approved");
