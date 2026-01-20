import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import { router } from "./routes/router";
import AppProvider from "./context/userProvider";
import { SignalRProvider } from "./context/signalRContext";

export default function App() {
  return (
    <AppProvider>
      <SignalRProvider>
        <RouterProvider router={router} />
        <ToastContainer />
      </SignalRProvider>
    </AppProvider>
  );
}
