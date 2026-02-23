import { createContext, useState, type ReactNode } from "react";

import { FaDiscord } from "react-icons/fa";
import type { AppContextType } from "../types/userProvider";
import type { User } from "../types/user";
import type {
  conversationList,
  DmParticipant,
} from "../types/chat/conversation";
import type { FriendType, onlinefriend } from "../types/friend/friend";
import type { TopSideTitle } from "../types/common";
import type { friendRequestType } from "../types/friend/friendRequest";

export const AppContext = createContext<AppContextType | null>(null);

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [dmParticipants, setDmParticipants] = useState<DmParticipant[]>([]);
  const [friendRequests, setFriendRequests] = useState<friendRequestType[]>([]);
  const [conversationList, setConversationList] =
    useState<conversationList[]>();
  const [friendList, setFriendList] = useState<FriendType[]>();
  const [openCreateDmModal, setOpenCreateDmModal] = useState<boolean>(false);
  const [jwtToken, _setJwtToken] = useState<string | null>(
    localStorage.getItem("jwtToken"),
  );

  const [selectedNavbarButton, setSelectedNavbarButton] =
    useState("çevrim içi");

  const [topSideTitle, setTopSideTitle] = useState<TopSideTitle>({
    Icon: FaDiscord,
    title: "Direkt Mesajlar",
  });
  const [selectedNavbarElement, setSelectedNavbarElement] =
    useState("Öne Çıkanlar");
  const sidebarWith = localStorage.getItem("sidebarWith");

  const [sidebarWidth, setSidebarWidth] = useState(
    sidebarWith ? parseInt(sidebarWith) : 240,
  );

  const [onlineFriends, setOnlineFriends] = useState<onlinefriend[]>([]);

  const setJwtToken = (token: string | null) => {
    _setJwtToken(token);
    localStorage.setItem("jwtToken", token || "");
  };
  const logout = () => {
    localStorage.removeItem("jwtToken");
    _setJwtToken(null);
  };

  return (
    <AppContext.Provider
      value={{
        setJwtToken,
        logout,
        dmParticipants,
        setDmParticipants,
        onlineFriends,
        setOnlineFriends,
        userInfo,
        setUserInfo,
        friendList,
        setFriendList,
        conversationList,
        setConversationList,
        openCreateDmModal,
        setOpenCreateDmModal,

        friendRequests,
        setFriendRequests,
        jwtToken,
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
