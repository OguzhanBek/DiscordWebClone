import OutsideLayout from "../layouts/outsideLayout/OutsideLayout";
import FriendsPage from "../ui/Pages/FriendsPage";
import DiscordStorePage from "../ui/Pages/DiscordStorePage";
import DiscordNitroPage from "../ui/Pages/DiscordNitroPage";
import ServerPage from "../ui/Pages/ServerPage";
import DiscordLogin from "../ui/Pages/LoginPage";
import DiscordSignup from "../ui/Pages/SignUpPage";
import DirectMessagePage from "../ui/Pages/DirectMessagePage";
import ProtectedRoute from "./ProtectedRoute";
import { createBrowserRouter } from "react-router-dom";
import AuthAwareNotFound from "./NotfoundRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <DiscordLogin />,
  },
  {
    path: "/register",
    element: <DiscordSignup />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <OutsideLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <FriendsPage /> },
      { path: "friends", element: <FriendsPage /> },
      { path: "store", element: <DiscordNitroPage /> },
      { path: "shop", element: <DiscordStorePage /> },
      { path: "channels/:id", element: <ServerPage /> },
      { path: "directMessage/:chatId", element: <DirectMessagePage /> },
    ],
  },
  {
    path: "*",
    element: <AuthAwareNotFound />,
  },
]);
