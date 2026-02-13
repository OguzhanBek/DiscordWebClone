import type { ReactNode } from "react";
import type { IconType } from "react-icons/lib";

export type TopSideTitle = {
  Icon: string | IconType;
  title: string;
};

export type SidebarNavItemProps = {
  icon: string | IconType;
  title: string;
  route: string;
};
export interface TooltipItem {
  content: ReactNode;
  tooltipText: string;
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

export type Product = {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  orbs?: string;
  image: string;
  gradient: string;
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