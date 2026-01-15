import type { ReactNode } from "react";
import type { IconType } from "react-icons/lib";

export type user = {
  token: string;
  email: string;
  userId: string;
  userName: string;
};
export type friendReuestType = {
  otherPersonName: string;
  isSentByMe: boolean;
  requestId: number;
};
export type FriendType = {
  userName: string;
  email: string;
  userId: string;
  friendId: string;
};
export type AppContextType = {
  dmFriendName: string;
  setDmFriendName: React.Dispatch<React.SetStateAction<string>>;
  userInfo: User | null;
  setUserInfo: React.Dispatch<React.SetStateAction<User | null>>;
  friendRequests: friendReuestType[];
  setFriendRequests: React.Dispatch<React.SetStateAction<friendReuestType[]>>;
  jwtToken: string | null;
  setJwtToken: React.Dispatch<React.SetStateAction<string | null>>;
  
  friendList: FriendType[] | undefined;
  setFriendList: React.Dispatch<React.SetStateAction<FriendType[] | undefined>>;
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

export type TopSideTitle = {
  Icon: IconType;
  title: string;
};
export interface TooltipItem {
  content: ReactNode;
  tooltipText: string;
}
export interface DmOlusturBeforeContentProps {
  items: TooltipItem[];
}

export type Game = {
  id: number;
  title: string;
  description: string;
  price: string;
  category: string;
  imageUrl?: string;
  discount?: number;
  coins?: number;
};

export type ServerInfo = {
  photo: string;
  name: string;
};
export type Product = {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  orbs?: string;
  image: string;
  gradient: string; // Tailwind CSS gradient class
};

export type DiscordOtherButton = {
  İcon: React.ElementType;
  name: string;
};
export type IconButtonProps = {
  Icon: IconType;
  title: string;
  route: string;
};
export type User = {
  email: string;
  user_name: string;
  token: string;
};
export type directMessageButton = {
  userPhoto: string;
  userName: string;
  friendId: string;
};
export interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  expiresAt?: string; // Date backend'den genelde string olarak gelir
  userId: number;
  userName: string;
  email: string;
}

export interface BadRequest {
  Success: boolean;
  message: string;
}
