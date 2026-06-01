// features/advertisements/advertisementSelectors.js

export const selectAllAdvertisements = (state) => state.advertisements.items;
export const selectAdvertisementsLoading = (state) =>
  state.advertisements.loading;
export const selectAdvertisementsActionLoading = (state) =>
  state.advertisements.actionLoading;
export const selectAdvertisementsError = (state) => state.advertisements.error;
export const selectAdvertisementsTotal = (state) => state.advertisements.total;
export const selectAdvertisementsTotalPages = (state) =>
  state.advertisements.totalPages;
export const selectAdvertisementsPage = (state) => state.advertisements.page;
