import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import CabinetPage from "./pages/CabinetPage";
import DemoPage from "./pages/DemoPage";
import BookingPage from "./pages/BookingPage";
import AuthPage from "./pages/AuthPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import VideoPreview from "./pages/VideoPreview";
import AdminPage from "./pages/AdminPage";
import CandidateDashboard from "./pages/CandidateDashboard";
import NotFound from "./pages/NotFound";
import AccessRequestPage from "./pages/AccessRequestPage";
import ConnexionPage from "./pages/ConnexionPage";
import NotreOffrePage from "./pages/NotreOffrePage";
import ScrollToHash from "./components/ScrollToHash";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PendingApprovalPage from "./pages/PendingApprovalPage";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToHash />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/inscription" element={<RegisterPage />} />
          <Route path="/cabinet" element={<CabinetPage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/rendez-vous" element={<BookingPage />} />
          <Route path="/demander-acces" element={<AccessRequestPage />} />
          <Route path="/notre-offre" element={<NotreOffrePage />} />
          <Route path="/connexion" element={<ConnexionPage />} />
          
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/video-preview" element={<VideoPreview />} />
          <Route path="/en-attente-validation" element={<PendingApprovalPage />} />
          <Route path="/espace-candidat" element={<ProtectedRoute requireUserType="candidat"><CandidateDashboard /></ProtectedRoute>} />
          <Route path="/admin/*" element={<ProtectedRoute requireApproved={false}><AdminPage /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
