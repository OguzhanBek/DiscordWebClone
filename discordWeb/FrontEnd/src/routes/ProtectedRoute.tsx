import { Navigate } from "react-router-dom";
import { useContext, type JSX } from "react";
import { AppContext } from "../context/userProvider";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const ctx = useContext(AppContext);

  if (!ctx || !ctx.jwtToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
