// src/features/partyPlot/partyPlotSelectors.js
export const selectPartyPlotList = (state) => state.partyPlot.list;
export const selectCurrentPartyPlot = (state) =>
  state.partyPlot.currentPartyPlot;
export const selectPartyPlotLoading = (state) => state.partyPlot.loading;
export const selectPartyPlotActionLoading = (state) =>
  state.partyPlot.actionLoading;
export const selectPartyPlotError = (state) => state.partyPlot.error;
