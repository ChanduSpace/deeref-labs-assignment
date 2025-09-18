import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  console.log("ProtectedRoute - user:", user);

  // Add a small delay to ensure state is updated
  if (user) {
    return children;
  } else {
    console.log("Redirecting to login");
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;
