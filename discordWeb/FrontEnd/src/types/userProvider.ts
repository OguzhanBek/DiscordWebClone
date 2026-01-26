
import type { conversationList } from "./chat/conversation";
import type { TopSideTitle } from "./common";
import type { friendReuestType, FriendType } from "./friend";
import type { User } from "./user";

export type AppContextType = {
  dmFriendName: string[];
  logout: () => void;
  setJwtToken: (token: string | null) => void;
  setDmFriendName: React.Dispatch<React.SetStateAction<string[]>>;
  userInfo: User | null;
  setUserInfo: React.Dispatch<React.SetStateAction<User | null>>;
  friendRequests: friendReuestType[];
  setFriendRequests: React.Dispatch<React.SetStateAction<friendReuestType[]>>;
  jwtToken: string | null;

  friendList: FriendType[] | undefined;
  setFriendList: React.Dispatch<React.SetStateAction<FriendType[] | undefined>>;
  conversationList: conversationList[] | undefined;
  setConversationList: React.Dispatch<
    React.SetStateAction<conversationList[] | undefined>
  >;
  selectedNavbarButton: string;
  setSelectedNavbarButton: React.Dispatch<React.SetStateAction<string>>;

  topSideTitle: TopSideTitle;
  setTopSideTitle: React.Dispatch<React.SetStateAction<TopSideTitle>>;

  selectedNavbarElement: string;
  setSelectedNavbarElement: React.Dispatch<React.SetStateAction<string>>;
  openCreateDmModal: boolean;
  setOpenCreateDmModal: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarWidth: number;
  setSidebarWidth: React.Dispatch<React.SetStateAction<number>>;
};