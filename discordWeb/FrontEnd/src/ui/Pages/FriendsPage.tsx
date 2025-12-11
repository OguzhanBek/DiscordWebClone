import { IoSearchOutline } from "react-icons/io5";
import { useContext, useState } from "react";
import tuta from "../../assets/Tuta.png";
import FriendsButton from "../Molecules/FriendsButton";
import { AppContext } from "../../context/userProvider";
import AddFriendPage from "./AddFriendPage";

import FriendsNavbar from "../Molecules/FriendsPageComponents/FriendsNavbar";
import { useLocation } from "react-router-dom";

function FriendsPage() {
  const [friendsInfo, _setFriendsInfo] = useState([
    {
      userPhoto: tuta,
      userName: "Tuta Montana",
      onlineStatus: "Porno izliyor",
    },
    {
      userPhoto: tuta,
      userName: "Tuta Montana",
      onlineStatus: "DUa ediyor",
    },
    {
      userPhoto: tuta,
      userName: "Tuta Montana",
      onlineStatus: "bekleyen",
    },
    {
      userPhoto: tuta,
      userName: "Tuta Montana",
      onlineStatus: "çevrim içi",
    },
    {
      userPhoto: tuta,
      userName: "Tuta Montana",
      onlineStatus: "çevrim içi",
    },
  ]);
  const ctx = useContext(AppContext);
  if (!ctx) return null;
  const { selectedNavbarButton } = ctx;

  const location = useLocation();

  return (
    <>
      <FriendsNavbar />
      {location.pathname === "/friends" ||location.pathname === "/" ? (
        selectedNavbarButton.toLowerCase().trim() !== "arkadaş ekle" ? (
          //Navbarın aşağısı burası. Main kısmı.
          <div className="flex-1  bg-[#1A1A1E] custom-scrollbar ">
            <div className="w-[95%] mx-auto">
              {/* searchbar kısmı */}
              <div className=" bg-[#1A1A1E] w-full border-t-1  border-[#2d2d30] ">
                <div className=" rounded-xl m-auto bg-[#101013] focus-within:border-[#5197ED] border-[#50506d] border flex items-center px-2 mt-2 mb-2">
                  <input
                    type="text"
                    name="search"
                    id="search"
                    placeholder="Ara"
                    className="bg-transparent outline-none text-white w-full py-2"
                  />
                  <IoSearchOutline className="text-white mr-2" />
                </div>
              </div>
              <div className="custom-scrollbar  ">
                <p className="mb-4 mt-4 text-sm">
                  {selectedNavbarButton === "çevrim içi"
                    ? "Çevrim içi -- 2 "
                    : selectedNavbarButton === "bekleyen"
                    ? "Bekleyen -- 1 "
                    : selectedNavbarButton === "tümü"
                    ? "Tüm-arkadaşlar -- 5 "
                    : ""}
                </p>
                <div className="custom-scrollbar  h-[calc(100vh-200px)]">
                  {selectedNavbarButton === "tümü"
                    ? friendsInfo.map(
                        ({ userPhoto, userName, onlineStatus }, index) => (
                          <FriendsButton
                            key={index}
                            userName={userName}
                            userPhoto={userPhoto}
                            onlineStatus={onlineStatus}
                          />
                        )
                      )
                    : selectedNavbarButton === "arkadaş ekle"
                    ? // BURAYI DÜZENLEMEYİ UNUTMA !!!
                      friendsInfo.map(
                        ({ userPhoto, userName, onlineStatus }, index) => (
                          <FriendsButton
                            key={index}
                            userName={userName}
                            userPhoto={userPhoto}
                            onlineStatus={onlineStatus}
                          />
                        )
                      )
                    : friendsInfo
                        .filter(
                          (friendsInfo) =>
                            selectedNavbarButton.toLowerCase().trim() ===
                            friendsInfo.onlineStatus.toLowerCase().trim()
                        )
                        .map(({ userPhoto, userName, onlineStatus }, index) => (
                          <FriendsButton
                            key={index}
                            userName={userName}
                            userPhoto={userPhoto}
                            onlineStatus={onlineStatus}
                          />
                        ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <AddFriendPage />
        )
      ) : null}
    </>
  );
}

export default FriendsPage;