// // src/features/bookings/bookingSelectors.js
// export const selectBookingList = (state) => state.bookings.list;
// export const selectBookingTotal = (state) => state.bookings.total;
// export const selectCurrentBooking = (state) => state.bookings.current;
// export const selectBookingStats = (state) => state.bookings.stats;
// export const selectBookingLoading = (state) => state.bookings.loading;
// export const selectBookingActionLoading = (state) =>
//   state.bookings.actionLoading;
// export const selectBookingError = (state) => state.bookings.error;
// src/features/bookings/bookingSelectors.js

export const selectBookingList = (state) => state.bookings.list;
export const selectBookingTotal = (state) => state.bookings.total;
export const selectCurrentBooking = (state) => state.bookings.current;
export const selectBookingStats = (state) => state.bookings.stats;

export const selectBookingLoading = (state) => state.bookings.loading;
export const selectBookingActionLoading = (state) =>
  state.bookings.actionLoading;

export const selectBookingError = (state) => state.bookings.error;

// NEW (useful for UI seat booking)
export const selectIsBookingCreating = (state) => state.bookings.actionLoading;
