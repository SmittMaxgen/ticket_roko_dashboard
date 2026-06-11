// src/features/cities/citySelectors.js

export const selectAllCities = (state) => state.cities.items;
export const selectSelectedCity = (state) => state.cities.selected;

export const selectCitiesLoading = (state) => state.cities.loading;
export const selectCitiesActionLoading = (state) => state.cities.actionLoading;
export const selectCitiesError = (state) => state.cities.error;

export const selectCitiesTotal = (state) => state.cities.total;
export const selectCitiesPage = (state) => state.cities.page;
export const selectCitiesTotalPages = (state) => state.cities.totalPages;

// Derived selectors
export const selectActiveCities = (state) =>
  state.cities.items.filter((city) => city.is_active === true);

export const selectCityById = (id) => (state) =>
  state.cities.items.find((city) => city.id === Number(id));
