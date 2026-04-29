// src/store/slices/categorySlice.js

import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCategories,
  fetchCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../categories/categoryThunks";

const initialState = {
  categories: [],
  category: null,
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    clearCategory(state) {
      state.category = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // =====================
      // FETCH ALL
      // =====================
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // =====================
      // FETCH BY ID
      // =====================
      .addCase(fetchCategoryById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.category = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // =====================
      // CREATE
      // =====================
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.unshift(action.payload);
      })

      // =====================
      // UPDATE
      // =====================
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (item) => item.id === action.payload.id,
        );

        if (index !== -1) {
          state.categories[index] = action.payload;
        }

        state.category = action.payload;
      })

      // =====================
      // DELETE
      // =====================
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (item) => item.id !== action.payload,
        );
      });
  },
});

export const { clearCategory } = categorySlice.actions;

export default categorySlice.reducer;
