// src/features/auth/authSelectors.js

export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectIsLoggedIn = (state) => !!state.auth.token;
export const selectUserRole = (state) => state.auth.user?.role;
export const selectIsSuperAdmin = (state) =>
  state.auth.user?.role === "super_admin";
export const selectIsAdmin = (state) =>
  ["admin", "super_admin"].includes(state.auth.user?.role);
