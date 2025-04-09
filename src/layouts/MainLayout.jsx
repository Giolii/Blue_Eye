import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/reusable/LoadingSpinner";

const MainLayout = () => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  const publicPaths = ["/login", "/register"];

  if (loading) {
    return <LoadingSpinner />;
  }
  if (!currentUser && !publicPaths.includes(location.pathname)) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (currentUser && publicPaths.includes(location.pathname)) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  return <Outlet />;
};

export default MainLayout;
