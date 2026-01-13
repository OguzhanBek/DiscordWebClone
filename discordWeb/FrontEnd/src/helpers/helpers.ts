import type { User } from "../types/types";

export const fetchUser = async (token: string): Promise<User | undefined> => {
  try {
    const response = await fetch("http://localhost:5200/api/User/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Request failed:", response.status);
      return;
    }

    const data: User = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
  }
};
