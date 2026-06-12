import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LandingPage from "./pages/LandingPage";

// Redirige vers /confirmation si Supabase a déposé des tokens auth dans l'URL
const AuthTokenRedirect = () => {
  const location = useLocation();
  const hash = location.hash;
  const search = location.search;
  const hasAuthToken =
    hash.includes('access_token=') ||
    hash.includes('type=signup') ||
    search.includes('code=') ||
    search.includes('token_hash=');
  if (hasAuthToken) {
    return <Navigate to={`/confirmation${search}${hash}`} replace />;
  }
  return <LandingPage />;
};
import RegisterPage from "./pages/RegisterPage";
import CabinetPage from "./pages/CabinetPage";
import DemoPage from "./pages/DemoPage";

import AuthPage from "./pages/AuthPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import AdminPage from "./pages/AdminPage";
import CandidateDashboard from "./pages/CandidateDashboard";
import NotFound from "./pages/NotFound";
import AccessRequestPage from "./pages/AccessRequestPage";
import ConnexionPage from "./pages/ConnexionPage";
import NotreOffrePage from "./pages/NotreOffrePage";
import ScrollToHash from "./components/ScrollToHash";
import AdminLoginPage from "./pages/AdminLoginPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import BookingPage from "./pages/BookingPage";
import FirmAccessPage from "./pages/FirmAccessPage";
import CabinetStartPage from "./pages/CabinetStartPage";
import FirmBookingPage from "./pages/FirmBookingPage";
import CandidateAccessPage from "./pages/CandidateAccessPage";
import ConnexionCandidatPage from "./pages/ConnexionCandidatPage";
import MentionsLegalesPage from "./pages/MentionsLegalesPage";
import CGUPage from "./pages/CGUPage";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToHash />
        <Routes>
          <Route path="/" element={<AuthTokenRedirect />} />
          <Route path="/inscription" element={<RegisterPage />} />
          <Route path="/cabinet" element={<CabinetPage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/rendez-vous" element={<AccessRequestPage />} />
          <Route path="/prendre-rdv" element={<BookingPage />} />
          <Route path="/demander-acces" element={<AccessRequestPage />} />
          <Route path="/notre-offre" element={<NotreOffrePage />} />
          <Route path="/connexion" element={<ConnexionPage />} />
          
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/espace-candidat" element={<CandidateDashboard />} />
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="/logan-admin" element={<AdminLoginPage />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route path="/acces-cabinet" element={<FirmAccessPage />} />
          <Route path="/cabinet-start" element={<CabinetStartPage />} />
          <Route path="/cabinet-rdv" element={<FirmBookingPage />} />
          <Route path="/candidat" element={<CandidateAccessPage />} />
          <Route path="/connexion-candidat" element={<ConnexionCandidatPage />} />
          <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
          <Route path="/cgu" element={<CGUPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
