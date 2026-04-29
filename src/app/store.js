// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import eventReducer from "../features/events/eventSlice";
import hallReducer from "../features/halls/hallSlice";
import userReducer from "../features/users/userSlice";
import bookingReducer from "../features/bookings/bookingSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import categoryReducer from "../features/categories/categorySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventReducer,
    halls: hallReducer,
    users: userReducer,
    bookings: bookingReducer,
    dashboard: dashboardReducer,
    category: categoryReducer,
  },
});
