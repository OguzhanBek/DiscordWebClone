import { toast } from "react-toastify";
import type { User } from "../types/user";
import defaultPhoto from "../../public/discord kullanıcı default foto.jpeg";
export class UnauthorizedError extends Error {}

export const fetchUser = async (jwtToken: string | null): Promise<User> => {
  const response = await fetch("http://localhost:5200/api/User/me", {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "application/json",
    },
  });

  if (response.status === 401) {
    toast.info("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
    throw new UnauthorizedError("Token expired");
  }

  if (!response.ok) {
    throw new Error("Request failed");
  }

  return response.json();
};

export const getFriendList = async (jwtToken: string | null) => {
  if (!jwtToken) throw new Error("No token");

  const response = await fetch("http://localhost:5200/api/friend/list", {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "application/json",
    },
  });

  if (response.status === 401) {
    toast.info("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
    throw new UnauthorizedError("Token expired");
  }

  if (!response.ok) {
    throw new Error("Friend list fetch failed");
  }

  return response.json();
};

export const getConversationList = async (jwtToken: string | null) => {
  if (!jwtToken) throw new Error("No token");

  const response = await fetch(
    "http://localhost:5200/api/chat/getConversationList",
    {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (response.status === 401) {
    toast.info("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
    throw new UnauthorizedError("Token expired");
  }

  if (!response.ok) {
    throw new Error("Friend list fetch failed");
  }

  return response.json();
};

export const getFriendRequests = async (jwtToken: string | null) => {
  try {
    const response = await fetch(
      "http://localhost:5200/api/friendrequest/check",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      },
    );
    if (response.status === 401) {
      throw new UnauthorizedError("Token expired");
    }
    if (!response.ok) {
      const message = await response.text();

      if (response.status === 404) {
        toast.info("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
        return [];
      }

      toast.error(message);
      return [];
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    if (error instanceof UnauthorizedError) {
      toast.info("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
      throw error;
    }
    toast.error("Sunucuya bağlanılamadı");
    console.error("getFriendRequests error:", error);
    return [];
  }
};
export const normalizePhotoUrl = (url?: string) => {
  if (!url) return defaultPhoto;
  if (url.startsWith("blob:")) return url;
  if (url.startsWith("http")) return url;
  return `http://localhost:5200${url}`;
};
