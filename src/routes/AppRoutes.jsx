// routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import AdminDashboard from "../pages/Dashboard";

import HallList from "../pages/halls/HallList";
import HallCreate from "../pages/halls/HallCreate";
import HallDetails from "../pages/halls/HallDetails";

import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Halls */}
      <Route
        path="/halls"
        element={
          <ProtectedRoute>
            <HallList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hall/:id"
        element={
          <ProtectedRoute>
            <HallCreate />
          </ProtectedRoute>
        }
      />

      <Route
        path="/halls/:id"
        element={
          <ProtectedRoute>
            <HallDetails />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
