import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import { loginRouter, router } from "./routes/router";
import AppProvider, { AppContext } from "./context/userProvider";
import { useContext } from "react";

function AppContent() {
  const ctx = useContext(AppContext);
  if (!ctx) return null;

  const user = ctx.user;

  return user ? (
    <RouterProvider key="main" router={router} />
  ) : (
    <RouterProvider key="login" router={loginRouter} />
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
      <ToastContainer />
    </AppProvider>
  );
}
