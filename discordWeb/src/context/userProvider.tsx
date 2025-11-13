import { createContext, useState, type ReactNode } from "react";
import type { AppContextType, TopSideTitle } from "../types/types";
import { FaDiscord } from "react-icons/fa";

export const AppContext = createContext<AppContextType | null>(null);

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [selectedNavbarButton, setSelectedNavbarButton] =
    useState<string>("çevrim içi");

  const [topSideTitle, setTopSideTitle] = useState<TopSideTitle>({
    Icon: FaDiscord,
    title: "Direkt Mesajlar",
  });

  const [selectedNavbarElement, setSelectedNavbarElement] =
    useState("Öne Çıkanlar");

  return (
    <AppContext.Provider
      value={{
        selectedNavbarButton,
        setSelectedNavbarButton,
        selectedNavbarElement,
        setSelectedNavbarElement,
        topSideTitle,
        setTopSideTitle,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
export default AppProvider;