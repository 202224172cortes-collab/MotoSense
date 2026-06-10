import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";

import { AuthProvider, useAuth } from "@/lib/AuthContext";

import PageNotFound from "./lib/PageNotFound";

import ProtectedRoute from "@/components/ProtectedRoute";

import Splash from "@/pages/Splash";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Home from "@/pages/Home";
import Onboarding from "@/pages/Onboarding";
import MainApp from "@/pages/MainApp";
import Plans from "@/pages/Plans";
import Dashboard from "@/pages/Dashboard";
import History from "@/pages/History";
import Aprende from "@/pages/Aprende";
import AdminBase from "@/pages/AdminBase";

const AuthenticatedApp = () => {

  const {
    isLoadingAuth,
    isAuthenticated
  } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <Routes>

      {/* Públicas */}
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />

      <Route
        path="/splash"
        element={<Splash />}
      />

      {/* Protegidas */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />

      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <MainApp />
          </ProtectedRoute>
        }
      />

      <Route
        path="/plans"
        element={
          <ProtectedRoute>
            <Plans />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />

      <Route
        path="/aprende"
        element={
          <ProtectedRoute>
            <Aprende />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/base"
        element={
          <ProtectedRoute adminOnly={true}>
            <AdminBase />
          </ProtectedRoute>
         }
      />

      {/* 404 */}
      <Route
        path="*"
        element={<PageNotFound />}
      />

    </Routes>
  );
};

function App() {

  return (
    <AuthProvider>

      <QueryClientProvider client={queryClientInstance}>

        <Router>
          <AuthenticatedApp />
        </Router>

        <Toaster />

      </QueryClientProvider>

    </AuthProvider>
  );
}

export default App;