// src/store/selectors/userSelectors.js

export const selectUsers = (state) => state.users.users;

export const selectUsersLoading = (state) => state.users.loading;

export const selectUsersError = (state) => state.users.error;

export const selectUsersPagination = (state) => ({
  total: state.users.total,
  page: state.users.page,
  limit: state.users.limit,
});
