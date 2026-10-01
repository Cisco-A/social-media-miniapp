import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";
import Header from "./Header";
import Footer from "./Footer";

const ProtectedRoute = () => {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default ProtectedRoute;
