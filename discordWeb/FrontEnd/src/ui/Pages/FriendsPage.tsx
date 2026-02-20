import { useLocation } from "react-router-dom";
import { useContext, useState } from "react";

import tuta from "../../assets/Tuta.png";
import FriendListItem from "../Molecules/FriendListItem";
import { AppContext } from "../../context/userProvider";
import AddFriendPage from "./AddFriendPage";
import FriendRequestItem from "../Molecules/FriendRequestItem";
import FriendsNavbar from "../Molecules/FriendsNavbar";

function FriendsPage() {
  const ctx = useContext(AppContext);
  const location = useLocation();

  const [input, setInput] = useState("");

  if (!ctx) return null;

  const { selectedNavbarButton, friendRequests, friendList, onlineFriends } =
    ctx;

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
                  )?.map(({ userName, friendId, profilePhoto }) => (
                    <FriendListItem
                      key={friendId}
                      friendId={friendId}
                      userName={userName}
                      profilePhoto={profilePhoto}
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
                  )?.map(({ userName, friendId, profilePhoto }) => (
                    <FriendListItem
                      key={friendId}
                      friendId={friendId}
                      userName={userName}
                      profilePhoto={profilePhoto}
                    />
                  ))}

                {/* ARKADAŞ EKLE */}
                {selectedNavbarButton === "arkadaş ekle" &&
                  friendList?.map(({ profilePhoto, userName, friendId }) => (
                    <FriendListItem
                      friendId={friendId}
                      key={friendId}
                      userName={userName}
                      profilePhoto={profilePhoto}
                    />
                  ))}

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
                        profilePhoto={tuta}
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
