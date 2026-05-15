export const selectPartyPlotBookingList = (state) =>
  state.partyPlotBookings.bookings;

export const selectPartyPlotBookingTotal = (state) =>
  state.partyPlotBookings.total;

export const selectCurrentPartyPlotBooking = (state) =>
  state.partyPlotBookings.currentBooking;

export const selectPartyPlotBookingLoading = (state) =>
  state.partyPlotBookings.loading;
