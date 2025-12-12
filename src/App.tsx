import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

import { AuthProvider } from "./contexts/AuthContext";
import { AdminLayout } from "./components/admin/AdminLayout";

import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminPDV from "./pages/admin/PDV";
import AdminGalleries from "./pages/admin/Galleries";
import AdminUsers from "./pages/admin/Users";
import AdminClients from "./pages/admin/Clients";

import ForgotPassword from "./pages/admin/ForgotPassword";
import ResetPassword from "./pages/admin/ResetPassword";

import ClientLogin from "./pages/client/Login";
import ClientDashboard from "./pages/client/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Site comum */}
            <Route path="/" element={<Index />} />

            {/* Login Admin */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Rotas de recuperação de senha */}
            <Route path="/admin/forgot" element={<ForgotPassword />} />
            <Route path="/admin/reset" element={<ResetPassword />} />

            {/* Área admin (protegida no AdminLayout) */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="pdv" element={<AdminPDV />} />
              <Route path="clients" element={<AdminClients />} />
              <Route path="galleries" element={<AdminGalleries />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>

            {/* Cliente */}
            <Route path="/cliente/login" element={<ClientLogin />} />
            <Route path="/cliente" element={<ClientDashboard />} />

            {/* Not found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
