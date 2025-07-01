
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { UserRole } from './types';

// Layouts
import MainLayout from './components/layout/MainLayout';

// Pages
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageStudents from './pages/admin/ManageStudents';
import StudentProfile from './pages/admin/StudentProfile';
import BursarDashboard from './pages/bursar/BursarDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import PaymentStatusPage from './pages/PaymentStatusPage';
import SettingsPage from './pages/SettingsPage';
import PrintReceiptPage from './pages/PrintReceiptPage';


interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  component: React.ComponentType<any>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, allowedRoles }) => {
    const { user, loading } = useAuthStore();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background-primary">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-accent-primary"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        const homePath = 
            user.role === UserRole.ADMIN ? '/admin/dashboard' :
            user.role === UserRole.BURSAR ? '/bursar/dashboard' :
            '/student/dashboard';
        return <Navigate to={homePath} replace />;
    }

    return <Component />;
};


const AppRouter = () => {
    const user = useAuthStore(state => state.user);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (user && location.pathname === '/login') {
            const homePath = 
                user.role === UserRole.ADMIN ? '/admin/dashboard' :
                user.role === UserRole.BURSAR ? '/bursar/dashboard' :
                '/student/dashboard';
            navigate(homePath, { replace: true });
        }
    }, [user, location.pathname, navigate]);

    const getHomePath = () => {
        if (!user) return '/login';
        switch (user.role) {
            case UserRole.ADMIN: return '/admin/dashboard';
            case UserRole.BURSAR: return '/bursar/dashboard';
            case UserRole.STUDENT: return '/student/dashboard';
            default: return '/login';
        }
    };

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/student/payment-status" element={<PaymentStatusPage />} />
      <Route path="/print/receipt/:transactionId" element={<PrintReceiptPage />} />
      
      {/* Routes accessible when logged in, wrapped in MainLayout */}
      <Route element={<MainLayout />}>
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute component={AdminDashboard} allowedRoles={[UserRole.ADMIN]} />} />
        <Route path="/admin/students" element={<ProtectedRoute component={ManageStudents} allowedRoles={[UserRole.ADMIN]} />} />
        <Route path="/admin/student/:studentId" element={<ProtectedRoute component={StudentProfile} allowedRoles={[UserRole.ADMIN]} />} />
        
        {/* Bursar Routes */}
        <Route path="/bursar/dashboard" element={<ProtectedRoute component={BursarDashboard} allowedRoles={[UserRole.BURSAR]} />} />
        
        {/* Student Routes */}
        <Route path="/student/dashboard" element={<ProtectedRoute component={StudentDashboard} allowedRoles={[UserRole.STUDENT]} />} />

        {/* Settings page for all roles */}
        <Route path="/settings" element={<ProtectedRoute component={SettingsPage} allowedRoles={[UserRole.ADMIN, UserRole.BURSAR, UserRole.STUDENT]} />} />
      </Route>
      
      {/* Fallback redirect */}
      <Route path="*" element={<Navigate to={getHomePath()} replace />} />
    </Routes>
  );
};

export default AppRouter;
