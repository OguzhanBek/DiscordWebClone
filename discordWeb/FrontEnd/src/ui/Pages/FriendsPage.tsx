import { useContext, useState } from "react";
import tuta from "../../assets/Tuta.png";
import FriendListItem from "../Molecules/FriendListItem";
import { AppContext } from "../../context/userProvider";
import AddFriendPage from "./AddFriendPage";

import { useLocation } from "react-router-dom";
import FriendRequestItem from "../Molecules/FriendRequestItem";
import FriendsNavbar from "../Molecules/FriendsNavbar";

function FriendsPage() {
  const [friendsInfo] = useState([
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

  const [input, setInput] = useState("");
  const ctx = useContext(AppContext);
  if (!ctx) return null;

  const { selectedNavbarButton, friendRequests, friendList } = ctx;
  console.log(friendList?.map((id) => id.friendId));
  const location = useLocation();
  return (
    <>
      <FriendsNavbar />

      {(location.pathname === "/friends" || location.pathname === "/") &&
        (selectedNavbarButton.toLowerCase().trim() !== "arkadaş ekle" ? (
          <div className="flex-1 bg-[#1A1A1E] custom-scrollbar">
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
                  {/* <IoSearchOutline className="text-white mr-2" /> */}
                </div>
              </div>

              {/* TITLE */}
              <p className="mb-4 mt-4 text-sm">
                {selectedNavbarButton === "çevrim içi"
                  ? "Çevrim içi -- 2"
                  : selectedNavbarButton === "bekleyen"
                  ? `Bekleyen -- ${friendRequests?.length || 0}`
                  : selectedNavbarButton === "tümü"
                  ? `Tüm arkadaşlar -- ${friendList?.length || 0}`
                  : ""}
              </p>

              {/* CONTENT */}
              <div className="custom-scrollbar h-[calc(100vh-200px)]">
                {/* TÜMÜ */}
                {selectedNavbarButton === "tümü" &&
                  (input.length > 0
                    ? friendList?.filter((friend) =>
                        friend.userName
                          .toLowerCase()
                          .includes(input.toLowerCase())
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

                {/* ARKADAŞ EKLE */}
                {selectedNavbarButton === "arkadaş ekle" &&
                  friendsInfo.map(
                    ({ userPhoto, userName, onlineStatus, friendId }) => (
                      <FriendListItem
                        friendId={friendId}
                        key={friendId}
                        userName={userName}
                        userPhoto={userPhoto}
                        onlineStatus={onlineStatus}
                      />
                    )
                  )}

                {/* BEKLEYEN */}
                {selectedNavbarButton === "bekleyen" && (
                  <div className="flex flex-col gap-2">
                    {(input.length > 0
                      ? friendRequests?.filter((request) =>
                          request.otherPersonName
                            .toLowerCase()
                            .includes(input.toLowerCase())
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
