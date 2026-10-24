import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ToastContainer } from '@/components/ui/Toast';

// Pages — public
import HomePage          from '@/pages/HomePage';
import ProjectsPage      from '@/pages/ProjectsPage';
import ProjectDetailPage from '@/pages/ProjectDetailPage';
import FinancialPage     from '@/pages/FinancialPage';
import ComplaintsPage    from '@/pages/ComplaintsPage';
import AboutPage         from '@/pages/AboutPage';

// Pages — admin
import AdminLoginPage    from '@/pages/admin/AdminLoginPage';
import AdminDashboard    from '@/pages/admin/AdminDashboard';
import AdminProjectsList from '@/pages/admin/AdminProjectsList';
import AdminProjectForm  from '@/pages/admin/AdminProjectForm';
import AdminComplaints   from '@/pages/admin/AdminComplaints';

// ─── Layout wrappers ──────────────────────────────────────────────────────────

function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <span className="text-white font-bold">మ</span>
          </div>
          <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <ToastContainer />
          <Routes>
            {/* Public routes */}
            <Route element={<PublicLayout />}>
              <Route path="/"           element={<HomePage />} />
              <Route path="/projects"   element={<ProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectDetailPage />} />
              <Route path="/financial"  element={<Navigate to="/projects" replace />} />
              <Route path="/complaints" element={<ComplaintsPage />} />
              <Route path="/about"      element={<AboutPage />} />
            </Route>

            {/* Admin login (no header) */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Protected admin routes */}
            <Route path="/admin" element={
              <RequireAuth>
                <Outlet />
              </RequireAuth>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="projects" element={<AdminProjectsList />} />
              <Route path="projects/new" element={<AdminProjectForm />} />
              <Route path="projects/:id/edit" element={<AdminProjectForm />} />
              <Route path="complaints" element={<AdminComplaints />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
