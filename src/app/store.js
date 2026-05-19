// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import eventReducer from "../features/events/eventSlice";
import hallReducer from "../features/halls/hallSlice";
import userReducer from "../features/users/userSlice";
import bookingReducer from "../features/bookings/bookingSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import categoryReducer from "../features/categories/categorySlice";
import vendorReducer from "../features/vendor/vendorSlice";
import optionsReducer from "../features/options/optionsSlice";
import partyPlotReducer from "../features/partyPlot/partyPlotSlice";
import partyPlotBookingsReducer from "../features/partyPlot/partyPlotBookingSlice";
import labelReducer from "../features/labels/labelslice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventReducer,
    halls: hallReducer,
    users: userReducer,
    bookings: bookingReducer,
    dashboard: dashboardReducer,
    category: categoryReducer,
    vendor: vendorReducer,
    options: optionsReducer,
    partyPlot: partyPlotReducer,
    partyPlotBookings: partyPlotBookingsReducer,
    labels: labelReducer,
  },
});
