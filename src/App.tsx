import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import FormBuilder from "./pages/FormBuilder";
import PublicForm from "./pages/PublicForm";
import LearnMore from "./pages/LearnMore";
import AboutUs from "./pages/AboutUs";
import Legal from "./pages/Legal";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/AdminDashboard";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import FeedbackWidget from "./components/FeedbackWidget";

import { Analytics } from '@vercel/analytics/react';
import ScrollToTop from "./components/ScrollToTop";

import Profile from "./pages/Profile";
import QuizResults from "./pages/QuizResults";
import CollabAccess from "./pages/CollabAccess";
import Noise from "./components/Noise";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/builder/:id" element={<ProtectedRoute><FormBuilder /></ProtectedRoute>} />
        <Route path="/f/:id" element={<PublicForm />} />
        <Route path="/form/:id" element={<PublicForm />} />
        <Route path="/quiz-results/:responseId" element={<QuizResults />} />
        <Route path="/learn-more" element={<LearnMore />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/terms" element={<Legal />} />
        <Route path="/privacy" element={<Legal />} />
        <Route path="/security" element={<Legal />} />
        <Route path="/collab/:token" element={<ProtectedRoute><CollabAccess /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <FeedbackWidget />
      <Analytics />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
          <Noise />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <AnimatedRoutes />
          </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
