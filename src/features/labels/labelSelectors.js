// // src/store/selectors/labelSelectors.js

// export const selectAllLabels = (state) => state.labels.items;
// export const selectSelectedLabel = (state) => state.labels.selected;
// export const selectLabelsTotal = (state) => state.labels.total;
// export const selectLabelsPage = (state) => state.labels.page;
// export const selectLabelsTotalPages = (state) => state.labels.totalPages;
// export const selectLabelsLoading = (state) => state.labels.loading;
// export const selectLabelsActionLoading = (state) => state.labels.actionLoading;
// export const selectLabelsError = (state) => state.labels.error;

// // Derived
// export const selectActiveLabels = (state) =>
//   state.labels.items.filter((l) => l.is_active);
// export const selectFeaturedLabels = (state) =>
//   state.labels.items.filter((l) => l.is_featured);
// export const selectLabelById = (id) => (state) =>
//   state.labels.items.find((l) => l.id === id);

export const selectAllLabels = (state) => state.labels.items;

export const selectSelectedLabel = (state) => state.labels.selected;

export const selectLabelsLoading = (state) => state.labels.loading;

export const selectLabelsActionLoading = (state) => state.labels.actionLoading;

export const selectLabelsError = (state) => state.labels.error;

export const selectLabelsTotal = (state) => state.labels.total;

export const selectLabelsPage = (state) => state.labels.page;

export const selectLabelsTotalPages = (state) => state.labels.totalPages;
