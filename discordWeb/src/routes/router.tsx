import { createBrowserRouter } from "react-router-dom";
import OutsideLayout from "../layouts/outsideLayout/OutsideLayout";
import NotFound from "../ui/Pages/NotFoundPage";
import FriendsPage from "../ui/Pages/FriendsPage";
import DiscordStorePage from "../ui/Pages/DiscordStorePage";
import DiscordNitroPage from "../ui/Pages/DiscordNitroPage";
import ServerPage from "../ui/Pages/ServerPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <OutsideLayout />,
    children: [
      { index: true, element: <FriendsPage /> },
      { path: "/friends", element: <FriendsPage /> },
      { path: "/store", element: <DiscordNitroPage /> },
      { path: "/shop", element: <DiscordStorePage /> },
      { path: "/channels/:id", element: <ServerPage /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
