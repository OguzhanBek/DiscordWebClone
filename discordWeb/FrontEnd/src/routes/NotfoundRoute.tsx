import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/userProvider";
import NotFound from "../ui/Pages/NotFoundPage";

const AuthAwareNotFound = () => {
  const ctx = useContext(AppContext);
  if (!ctx || !ctx.jwtToken) {
    return <Navigate to={"/login"} replace />;
  }

  return <NotFound />;
};

export default AuthAwareNotFound;
