// src/store/slices/userSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchUsers, createUser, deleteUser } from "../users/userThunks";

const initialState = {
  users: [],
  loading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 20,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* GET USERS */
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* CREATE USER */
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.unshift(action.payload.data);
      })

      /* DELETE USER */
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
      });
  },
});

export const { setPage, clearUserError } = userSlice.actions;
export default userSlice.reducer;
