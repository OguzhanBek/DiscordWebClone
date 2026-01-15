import { createContext, useState, useEffect, type ReactNode } from "react";
import type {
  AppContextType,
  friendReuestType,
  FriendType,
  TopSideTitle,
  User,
} from "../types/types";
import { FaDiscord } from "react-icons/fa";


export const AppContext = createContext<AppContextType | null>(null);

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [dmFriendName, setDmFriendName] = useState("");
  const [friendRequests, setFriendRequests] = useState<friendReuestType[]>([]);
  const [friendList, setFriendList] = useState<FriendType[]>();
  const [openCreateDmModal, setOpenCreateDmModal] = useState<boolean>(false);
  const [jwtToken, setJwtToken] = useState<string | null>(
    localStorage.getItem("jwtToken")
  );

  const [selectedNavbarButton, setSelectedNavbarButton] =
    useState("çevrim içi");

  const [topSideTitle, setTopSideTitle] = useState<TopSideTitle>({
    Icon: FaDiscord,
    title: "Direkt Mesajlar",
  });

  const [selectedNavbarElement, setSelectedNavbarElement] =
    useState("Öne Çıkanlar");

  const [sidebarWidth, setSidebarWidth] = useState(240);

  useEffect(() => {
    if (jwtToken) {
      localStorage.setItem("jwtToken", jwtToken);
    } else {
      localStorage.removeItem("jwtToken");
    }
  }, [jwtToken]);


  return (
    <AppContext.Provider
      value={{
        dmFriendName,
        setDmFriendName,
        userInfo,
        setUserInfo,
        friendList,
        setFriendList,
        openCreateDmModal,
        setOpenCreateDmModal,
        friendRequests,
        setFriendRequests,
        jwtToken,
        setJwtToken,
        selectedNavbarButton,
        setSelectedNavbarButton,
        selectedNavbarElement,
        setSelectedNavbarElement,
        topSideTitle,
        setTopSideTitle,
        sidebarWidth,
        setSidebarWidth
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
