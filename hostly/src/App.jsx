// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Importe todas as suas páginas
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RoomListPage from "./pages/RoomListPage";
import RoomDetailPage from "./pages/RoomDetailPage";
import RoomFormPage from "./pages/RoomFormPage";
import CustomerListPage from "./pages/CustomerListPage";
import CustomerFormPage from "./pages/CustomerFormPage";
import UserListPage from "./pages/UserListPage";
import UserFormPage from "./pages/UserFormPage";
import UserRegisterPage from "./pages/UserRegisterPage";
import AvailableRoomsPage from "./pages/AvailableRoomsPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import CheckInPage from "./pages/CheckInPage";
import AdminReservationsPage from "./pages/AdminReservationsPage";

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          {/* --- Rotas Públicas --- */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<UserRegisterPage />} />
          <Route path="/quartos-disponiveis" element={<AvailableRoomsPage />} />

          {/* --- Rotas Protegidas --- */}

          {/* HomePage agora é SÓ PARA CLIENTES */}
          <Route
            path="/"
            element={
              <ProtectedRoute allowRoles={["user"]}>
                <HomePage />
                <Footer />
              </ProtectedRoute>
            }
          />

          {/* Dashboard do Cliente */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowRoles={["user"]}>
                <UserDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Rotas de Admin/Operador */}
          <Route
            path="/rooms"
            element={
              <ProtectedRoute allowRoles={["admin", "operator"]}>
                <RoomListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rooms/new"
            element={
              <ProtectedRoute allowRoles={["admin", "operator"]}>
                <RoomFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rooms/edit/:id"
            element={
              <ProtectedRoute allowRoles={["admin", "operator"]}>
                <RoomFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rooms/:id"
            element={
              <ProtectedRoute allowRoles={["admin", "operator"]}>
                <RoomDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/check-in/:roomId"
            element={
              <ProtectedRoute allowRoles={["admin", "operator"]}>
                <CheckInPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <ProtectedRoute allowRoles={["admin", "operator"]}>
                <CustomerListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers/new"
            element={
              <ProtectedRoute allowRoles={["admin", "operator"]}>
                <CustomerFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers/edit/:id"
            element={
              <ProtectedRoute allowRoles={["admin", "operator"]}>
                <CustomerFormPage />
              </ProtectedRoute>
            }
          />

          {/* Gerenciamento de Funcionários (SÓ PARA ADMIN) */}
          <Route
            path="/users"
            element={
              <ProtectedRoute allowRoles={["admin"]}>
                <UserListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/new"
            element={
              <ProtectedRoute allowRoles={["admin"]}>
                <UserFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/edit/:id"
            element={
              <ProtectedRoute allowRoles={["admin"]}>
                <UserFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservas-historico"
            element={
              <ProtectedRoute allowRoles={["admin", "operator"]}>
                <AdminReservationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservas-historico"
            element={
              <ProtectedRoute allowRoles={["admin", "operator"]}>
                <AdminReservationsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </>
  );
}

export default App;
