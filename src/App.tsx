
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { ToastProvider } from "@/components/ui/ToastProvider";

// Pages
import Home from "./pages/Home";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import PaymentConfirmation from "./pages/PaymentConfirmation";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import BecomePartner from "./pages/BecomePartner";
import PartnerDashboard from "./pages/PartnerDashboard";
import Kolibri from "./pages/Kolibri";
import Sobre from "./pages/Sobre";
import Metodo from "./pages/Metodo";

// Create a new QueryClient with custom error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30000,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider />
      <TooltipProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/servicos" element={<Services />} />
            <Route path="/serviços" element={<Services />} />
            <Route path="/solucoes" element={<Services />} />
            <Route path="/soluções" element={<Services />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/login" element={<Login />} />
            <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/parceiros" element={<BecomePartner />} />
            <Route path="/parceiro/dashboard" element={<PartnerDashboard />} />
            <Route path="/kolibri" element={<Kolibri />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/metodo" element={<Metodo />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
