import type { ReactNode } from "react";
import type { IconType } from "react-icons/lib";

export type AppContextType = {
  selectedNavbarButton: string;
  setSelectedNavbarButton: React.Dispatch<React.SetStateAction<string>>;
  topSideTitle: TopSideTitle;
  setTopSideTitle: React.Dispatch<React.SetStateAction<TopSideTitle>>;
  selectedNavbarElement: string;
  setSelectedNavbarElement: React.Dispatch<React.SetStateAction<string>>;
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
  userPhoto: string;
  userName: string;
};
