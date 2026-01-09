import { createContext, useState, useEffect, type ReactNode } from "react";
import type {
  AppContextType,
  friendReuestType,
  FriendType,
  TopSideTitle,
  User,
} from "../types/types";
import { FaDiscord } from "react-icons/fa";
import { toast } from "react-toastify";

export const AppContext = createContext<AppContextType | null>(null);

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [friendRequests, setFriendRequests] = useState<friendReuestType[]>([]);
  const [friendList, setFriendList] = useState<FriendType[]>();
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

  const getFriendList = async () => {
    try {
      const response = await fetch(`http://localhost:5200/api/friend/list`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!response.ok) {
        console.error("Friend list fetch failed");
        return;
      }

      const data = await response.json();
      setFriendList(data);
      console.log("Friend List: ", data);
    } catch (err) {
      console.error(err);
    }
  };

  const getFriendRequests = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(
        "http://localhost:5200/api/friendrequest/check",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        console.log("response", response);
        const data = await response.json();
        console.log("data", data);
        setFriendRequests(data);
        return;
      }

      const message = await response.text();

      if (response.status === 404) {
        setFriendRequests([]); // listeyi temizle
        toast.info(message); // "Arkadaşlık isteği yok."
      } else {
        toast.error(message);
      }
    } catch (error: any) {
      toast.error("Sunucuya bağlanılamadı");
      console.error(error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        userInfo,
        setUserInfo,
        friendList,
        setFriendList,
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
        setSidebarWidth,
        getFriendList,
        getFriendRequests
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
