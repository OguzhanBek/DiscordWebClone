import { useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import tuta from "../../assets/Tuta.png";
import FriendListItem from "../Molecules/FriendListItem";
import { AppContext } from "../../context/userProvider";
import AddFriendPage from "./AddFriendPage";
import FriendRequestItem from "../Molecules/FriendRequestItem";
import FriendsNavbar from "../Molecules/FriendsNavbar";
import { SignalRContext } from "../../context/signalRContext";
import type { onlinefriend } from "../../types/friend/friend";

function FriendsPage() {
  const ctx = useContext(AppContext);
  const signalContext = useContext(SignalRContext);
  const location = useLocation();

  const [input, setInput] = useState("");
  const [onlineFriends, setOnlineFriends] = useState<onlinefriend[]>([]);
  const [dummyFriendsInfo] = useState([
    {
      userPhoto: tuta,
      userName: "Tuta Montana",
      onlineStatus: "Porno izliyor",
      friendId: "31",
    },
    {
      userPhoto: tuta,
      userName: "Tuta Montana",
      onlineStatus: "DUa ediyor",
      friendId: "31",
    },
    {
      userPhoto: tuta,
      userName: "Tuta Montana",
      onlineStatus: "bekleyen",
      friendId: "31",
    },
    {
      userPhoto: tuta,
      userName: "Tuta Montana",
      onlineStatus: "çevrim içi",
      friendId: "31",
    },
    {
      userPhoto: tuta,
      userName: "Tuta Montana",
      onlineStatus: "çevrim içi",
      friendId: "31",
    },
  ]);

  if (!ctx) return null;

  const { selectedNavbarButton, friendRequests, friendList } = ctx;

  useEffect(() => {
    if (!signalContext?.presenceConnection) return;

    const handleInitialOnlineUsers = (users: any[]) => {
      console.log("📋 İlk online liste:", users);
      users.filter((user) => user.friendId !== ctx.jwtToken);
      setOnlineFriends(users);
    };

    const handleUserOnline = (user: any) => {
      console.log("👤 Yeni online user:", user);
      setOnlineFriends((prev) => {
        if (prev.some((u) => u.friendId === user.friendId)) {
          return prev;
        }
        return [...prev, user];
      });
    };

    const handleUserOffline = (userId: string) => {
      console.log("👋 User offline:", userId);
      setOnlineFriends((prev) => prev.filter((u) => u.friendId !== userId));
    };

    // Listener'ları ekle
    signalContext.presenceConnection.on(
      "initialOnlineUsers",
      handleInitialOnlineUsers,
    );
    signalContext.presenceConnection.on("useronline", handleUserOnline);
    signalContext.presenceConnection.on("useroffline", handleUserOffline);

    signalContext.presenceConnection
      .invoke("GetOnlineUsers")
      .then(() => console.log("✅ GetOnlineUsers başarıyla çağrıldı"))
      .catch((err:any) => console.error("❌ GetOnlineUsers hatası:", err));

    signalContext.presenceConnection
      .invoke("OnConnectedAsync")
      .then(() => console.log("✅ OnConnectedAsync başarıyla çağrıldı"))
      .catch((err:any) => console.error("❌ OnConnectedAsync hatası:", err));

    return () => {
      signalContext.presenceConnection?.off(
        "initialOnlineUsers",
        handleInitialOnlineUsers,
      );
      signalContext.presenceConnection?.off("useronline", handleUserOnline);
      signalContext.presenceConnection?.off("useroffline", handleUserOffline);
    };
  }, [signalContext?.presenceConnection]);

  return (
    <>
      <FriendsNavbar />

      {(location.pathname === "/friends" || location.pathname === "/") &&
        (selectedNavbarButton.toLowerCase().trim() !== "arkadaş ekle" ? (
          <div className="flex-1 bg-[#1A1A1E] discord-scrollbar">
            <div className="w-[95%] mx-auto">
              {/* SEARCH BAR */}
              <div className="bg-[#1A1A1E] w-full border-t border-[#2d2d30]">
                <div className="rounded-xl m-auto bg-[#101013] focus-within:border-[#5865F2] border-[#50506d] border flex items-center px-2 mt-2 mb-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    type="text"
                    placeholder="Ara"
                    className="bg-transparent outline-none text-white w-full py-2"
                  />
                </div>
              </div>

              {/* TITLE */}
              <p className="mb-4 mt-4 text-sm">
                {selectedNavbarButton === "çevrim içi"
                  ? `Çevrim içi -- ${onlineFriends.length}`
                  : selectedNavbarButton === "bekleyen"
                    ? `Bekleyen -- ${friendRequests?.length || 0}`
                    : selectedNavbarButton === "tümü"
                      ? `Tüm arkadaşlar -- ${friendList?.length || 0}`
                      : ""}
              </p>

              {/* CONTENT */}
              <div className="discord-scrollbar h-[calc(100vh-200px)]">
                {/* TÜMÜ */}
                {selectedNavbarButton === "tümü" &&
                  (input.length > 0
                    ? friendList?.filter((friend) =>
                        friend.userName
                          .toLowerCase()
                          .includes(input.toLowerCase()),
                      )
                    : friendList
                  )?.map(({ userName, friendId }) => (
                    <FriendListItem
                      key={friendId}
                      friendId={friendId}
                      userName={userName}
                      userPhoto={tuta}
                      onlineStatus="porno"
                    />
                  ))}

                {/* ÇEVRİM İÇİ */}
                {selectedNavbarButton === "çevrim içi" &&
                  (input.length > 0
                    ? onlineFriends.filter((friend) =>
                        friend.userName
                          .toLowerCase()
                          .includes(input.toLowerCase()),
                      )
                    : onlineFriends
                  )?.map(({ userName, friendId }) => (
                    <FriendListItem
                      key={friendId}
                      friendId={friendId}
                      userName={userName}
                      userPhoto={tuta}
                      onlineStatus="çevrim içi"
                    />
                  ))}

                {/* ARKADAŞ EKLE */}
                {selectedNavbarButton === "arkadaş ekle" &&
                  dummyFriendsInfo.map(
                    ({ userPhoto, userName, onlineStatus, friendId }) => (
                      <FriendListItem
                        friendId={friendId}
                        key={friendId}
                        userName={userName}
                        userPhoto={userPhoto}
                        onlineStatus={onlineStatus}
                      />
                    ),
                  )}

                {/* BEKLEYEN */}
                {selectedNavbarButton === "bekleyen" && (
                  <div className="flex flex-col gap-2">
                    {(input.length > 0
                      ? friendRequests?.filter((request) =>
                          request.otherPersonName
                            .toLowerCase()
                            .includes(input.toLowerCase()),
                        )
                      : friendRequests
                    )?.map((request) => (
                      <FriendRequestItem
                        key={request.requestId}
                        otherPersonName={request.otherPersonName}
                        isSentByMe={request.isSentByMe}
                        requestId={request.requestId}
                        userPhoto={tuta}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <AddFriendPage />
        ))}
    </>
  );
}
export default FriendsPage;
