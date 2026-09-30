import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

const PublicRoute = () => {
  const { token } = useAuth();
  if (token) {
    return <Navigate to="/posts" replace />;
  }
  return <Outlet />;
};

export default PublicRoute;
