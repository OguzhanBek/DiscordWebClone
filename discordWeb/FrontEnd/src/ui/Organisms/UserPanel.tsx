import { createPortal } from "react-dom";
import { IoIosSettings } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import {
  FaMicrophone,
  FaHeadphones,
  FaUserEdit,
  FaBan,
  FaExchangeAlt,
  FaRegCopy,
  FaMicrophoneSlash,
} from "react-icons/fa";
import { useContext, useEffect, useState } from "react";

import tuta from "../../assets/Tuta.png";
import defaultfoto from "../../../public/discord kullanıcı default foto.jpeg";
import { AppContext } from "../../context/userProvider";
import { fetchUser, UnauthorizedError } from "../../helpers/helpers";
import { LuHeadphoneOff } from "react-icons/lu";
import UserSettings from "../Pages/UserSettings";

function UserPanel() {
  const ctx = useContext(AppContext);
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [root, setRoot] = useState<HTMLElement | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isMicrophone, setIsMicrophone] = useState<boolean>(true);
  const [isHeadphone, setIsHeadphone] = useState<boolean>(true);
  if (!ctx) return null;

  const { sidebarWidth, userInfo } = ctx;

  useEffect(() => {
    setRoot(document.getElementById("root")); // veya portal için ayrı bir div
  }, []);

  useEffect(() => {
    if (!ctx?.jwtToken) return;

    const loadUser = async () => {
      try {
        const user = await fetchUser(ctx.jwtToken);
        ctx.setUserInfo(user);
      } catch (error) {
        if (error instanceof UnauthorizedError) {
          localStorage.removeItem("jwtToken");
          ctx.setJwtToken(null);
          navigate("/login");
        }
      }
    };
    loadUser();
  }, []);
  if (!root) return null;

  console.log("tutaaa : ", userInfo?.profile_photo);

  return createPortal(
    <>
      <div
        style={{ width: sidebarWidth + 60 }}
        className="absolute bottom-2 ml-2 h-16 rounded-xl bg-[#202024] 
                 text-white flex items-center justify-between z-40 select-none"
      >
        <div
          onClick={() => setIsProfileOpen(true)}
          className="flex flex-1 mx-2 h-10 hover:bg-[#323238] cursor-pointer transition-all rounded-xl items-center"
        >
          <img
            src={userInfo?.profile_photo || defaultfoto}
            alt="tuta"
            className="w-8 rounded-full mx-2"
          />
          <div className="flex flex-col justify-center leading-tight text-left min-w-0 h-8">
            <h3 className="text-sm truncate">{userInfo?.user_name}</h3>
            <span className="text-xs truncate">Açıklama</span>
          </div>
        </div>

        <div className="flex gap-2 mr-2">
          {/* MICROPHONE */}
          <div
            onClick={() => setIsMicrophone(!isMicrophone)}
            className={`w-7 h-7 flex items-center justify-center rounded-full cursor-pointer transition
      ${isMicrophone ? "hover:bg-[#3a3a3f]" : "bg-[#5a1a1a] hover:bg-[#6a1f1f]"}`}
            title={isMicrophone ? "Mikrofon Açık" : "Mikrofon Kapalı"}
          >
            <div className="relative w-4 h-4">
              <FaMicrophone
                size={16}
                className={`absolute  transition-opacity duration-200
      ${isMicrophone ? "opacity-100" : "opacity-0"}`}
              />

              <FaMicrophoneSlash
                className={`absolute  transition-opacity duration-200 text-red-400
      ${isMicrophone ? "opacity-0" : "opacity-100"}`}
                size={16}
              />
            </div>
          </div>

          {/* HEADPHONE */}
          <div
            onClick={() => setIsHeadphone(!isHeadphone)}
            className={`w-7 h-7 flex items-center justify-center rounded-full cursor-pointer transition
      ${isHeadphone ? "hover:bg-[#3a3a3f]" : "bg-[#5a1a1a] hover:bg-[#6a1f1f]"}`}
            title={isHeadphone ? "Kulaklık Açık" : "Kulaklık Kapalı"}
          >
            <div className="relative w-4 h-4">
              <FaHeadphones
                className={`absolute  transition-opacity duration-200
      ${isHeadphone ? "opacity-100" : "opacity-0"}`}
                size={16}
              />

              <LuHeadphoneOff
                className={`absolute  transition-opacity duration-200 text-red-400
      ${isHeadphone ? "opacity-0" : "opacity-100"}`}
                size={16}
              />
            </div>
          </div>

          {/* SETTINGS */}
          <div
            onClick={() => setShowSettings(true)}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#3a3a3f] cursor-pointer"
          >
            <IoIosSettings size={20} />
          </div>
        </div>
      </div>
      {showSettings && (
        <UserSettings
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          userData={{
            user_name: userInfo?.user_name || "kullanıcı adı yüklenemedi",
            avatar: userInfo?.profile_photo || defaultfoto,
            banner: userInfo?.profile_photo || defaultfoto,
          }}
        />
      )}

      {/* OVERLAY + PROFIL PANEL */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-50 select-none"
          onClick={() => setIsProfileOpen(false)}
        >
          <div
            className="absolute bottom-20 left-10 w-72 rounded-xl 
                     overflow-hidden bg-[#2b1037] shadow-xl text-white ring-2 ring-purple-300  "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-28 bg-linear-to-r from-[#3a0a4a] to-[#5a1a6b]">
              <img
                src={userInfo?.profile_photo || defaultfoto}
                className="absolute  w-full h-full object-cover"
              />

              <div className="absolute -bottom-8 left-4">
                <img
                  src={userInfo?.profile_photo || defaultfoto}
                  className="w-20 h-20 rounded-full border-4 border-[#2b1037]"
                />
              </div>
            </div>

            {/* Body */}
            <div className="body pt-10 px-4 pb-4">
              <h3 className="font-bold text-lg">OğuzhanDaud</h3>
              <p className="text-sm text-gray-300">
                oguzhan2000 • Tutanın yaveri
              </p>

              <p className="text-sm mt-3 text-gray-200">
                Tuta bir numara Masquerade'yi vur duvara.
              </p>

              <div className="mt-4 bg-[#3b1450] rounded-lg px-3 py-2">
                🎮 Oyun Koleksiyonu
              </div>

              <div className="mt-4 space-y-2">
                <button className="w-full flex items-center gap-3 bg-[#3b1450] hover:bg-[#4b1a65] rounded-md py-2 px-3 text-sm text-left transition cursor-pointer">
                  <FaUserEdit className="text-pink-300" />
                  Profili Düzenle
                </button>

                <button className="w-full flex items-center gap-3 bg-[#3b1450] hover:bg-[#4b1a65] rounded-md py-2 px-3 text-sm text-left transition cursor-pointer">
                  <FaBan className="text-red-400" />
                  Rahatsız Etmeyin
                </button>

                <button className="w-full flex items-center gap-3 bg-[#3b1450] hover:bg-[#4b1a65] rounded-md py-2 px-3 text-sm text-left transition cursor-pointer">
                  <FaExchangeAlt className="text-blue-300" />
                  Hesap Değiştir
                </button>

                <button className="w-full flex items-center gap-3 bg-[#3b1450] hover:bg-[#4b1a65] rounded-md py-2 px-3 text-sm text-left transition cursor-pointer">
                  <FaRegCopy className="text-green-300" />
                  Kullanıcı ID'sini Kopyala
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>,
    root,
  );
}

export default UserPanel;
