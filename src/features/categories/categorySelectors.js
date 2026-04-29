// src/store/selectors/categorySelectors.js

export const selectCategories = (state) => state.category.categories;

export const selectCategory = (state) => state.category.category;

export const selectCategoryLoading = (state) => state.category.loading;

export const selectCategoryError = (state) => state.category.error;
