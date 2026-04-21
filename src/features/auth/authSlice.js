// src/features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  loginThunk,
  meThunk,
  logoutThunk,
  changePasswordThunk,
} from "./authThunks";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token"),
    loading: false,
    error: null,
    pwLoading: false,
    pwError: null,
    pwSuccess: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    clearPwStatus: (state) => {
      state.pwError = null;
      state.pwSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── login ─────────────────────────────────────
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        localStorage.setItem("token", action.payload.accessToken);
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // ── me (restore session on reload) ────────────
      .addCase(meThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(meThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(meThunk.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem("token");
      })

      // ── logout ────────────────────────────────────
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        localStorage.removeItem("token");
      })

      // ── change password ───────────────────────────
      .addCase(changePasswordThunk.pending, (state) => {
        state.pwLoading = true;
        state.pwError = null;
        state.pwSuccess = false;
      })
      .addCase(changePasswordThunk.fulfilled, (state) => {
        state.pwLoading = false;
        state.pwSuccess = true;
      })
      .addCase(changePasswordThunk.rejected, (state, action) => {
        state.pwLoading = false;
        state.pwError = action.payload;
      });
  },
});

export const { logout, clearAuthError, clearPwStatus } = authSlice.actions;
export default authSlice.reducer;
