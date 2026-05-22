export const selectAssignedEvents = (state) =>
  state.ticketChecker.assignedEvents;

export const selectAssignedPartyPlots = (state) =>
  state.ticketChecker.assignedPartyPlots;

export const selectTicketCheckerLoading = (state) =>
  state.ticketChecker.loading;

export const selectTicketCheckerScanLoading = (state) =>
  state.ticketChecker.scanLoading;

export const selectTicketCheckerError = (state) => state.ticketChecker.error;
