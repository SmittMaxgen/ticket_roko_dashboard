// src/features/dashboard/dashboardSelectors.js

export const selectDashboardOverview = (state) => state.dashboard.overview;
export const selectDashboardRevenueChart = (state) =>
  state.dashboard.revenueChart;
export const selectDashboardTopEvents = (state) => state.dashboard.topEvents;
export const selectDashboardRecentBookings = (state) =>
  state.dashboard.recentBookings;
export const selectDashboardCategoryStats = (state) =>
  state.dashboard.categoryStats;
export const selectDashboardLoading = (state) => state.dashboard.loading;
export const selectDashboardError = (state) => state.dashboard.error;

// Derived — total revenue from overview
export const selectTotalRevenue = (state) =>
  state.dashboard.overview?.bookings?.revenue ?? 0;

// Derived — today's revenue
export const selectTodayRevenue = (state) =>
  state.dashboard.overview?.bookings?.today_revenue ?? 0;

// Derived — pending events count
export const selectPendingEventCount = (state) =>
  state.dashboard.overview?.events?.pending ?? 0;

// Derived — pending KYC count
export const selectPendingKycCount = (state) =>
  state.dashboard.overview?.users?.pending_kyc ?? 0;
