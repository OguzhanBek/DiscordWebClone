import { createContext, useState, useEffect, type ReactNode } from "react";
import type { AppContextType, TopSideTitle } from "../types/types";
import { FaDiscord } from "react-icons/fa";

export const AppContext = createContext<AppContextType | null>(null);

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(() => localStorage.getItem("user"));

  const [selectedNavbarButton, setSelectedNavbarButton] =
    useState("çevrim içi");

  const [topSideTitle, setTopSideTitle] = useState<TopSideTitle>({
    Icon: FaDiscord,
    title: "Direkt Mesajlar",
  });

  const [selectedNavbarElement, setSelectedNavbarElement] =
    useState("Öne Çıkanlar");

  const [sidebarWidth, setSidebarWidth] = useState(240);

  // ⭐ user değişince localStorage güncellenir
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", user);
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        selectedNavbarButton,
        setSelectedNavbarButton,
        selectedNavbarElement,
        setSelectedNavbarElement,
        topSideTitle,
        setTopSideTitle,
        sidebarWidth,
        setSidebarWidth,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
