import { Navigate } from "react-router-dom";
import { useAuth } from "../context/Context";
import Layout from "../component/Layout";

const ProtectedRoute = ({ children, allowRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-500">Loading JobBridge...</p>
        </div>
      </div>
    );
  }

  // If no user and we're done loading, redirect to login
  if (!user) {
    console.log("No user found, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Check if specific role is required and user doesn't have it
  if (allowRole) {
    console.log("allowRole:", allowRole, "user.role:", user.role);
    if (user.role !== allowRole) {
      console.log(`User role ${user.role} doesn't match required role ${allowRole}`);
      return <Navigate to="/" replace />;
    }
  }

  return <Layout>{children}</Layout>;
};

export default ProtectedRoute;
