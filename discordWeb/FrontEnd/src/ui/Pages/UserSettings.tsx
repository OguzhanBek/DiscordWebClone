import { useState, useEffect, useContext } from "react";
import { IoClose } from "react-icons/io5";
import { FaUser, FaLink } from "react-icons/fa";
import { GrLogout } from "react-icons/gr";

import defaultfoto from "../../../public/discord kullanıcı default foto.jpeg";
import Logout from "../Molecules/Logout";
import ProfieEditor from "./ProfieEditor";
import Connections from "./Connections";
import EditUsername from "./EditUserName";
import ChangePassword from "./ChangePassword";
import { AppContext } from "../../context/userProvider";
import { normalizePhotoUrl } from "../../helpers/helpers";

type UserSettingProps = {
  userData: {
    userName: string | undefined;
    avatar: string | undefined;
    banner: string | undefined;
  };
  showSettings: boolean;
  setShowSettings: React.Dispatch<React.SetStateAction<boolean>>;
};

function UserSettings({
  userData,
  showSettings,
  setShowSettings,
}: UserSettingProps) {
  const [activeTab, setActiveTab] = useState("hesabim");
  const [isLogout, setİsLogout] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isEditUsername, setIsEditUsername] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [showEmail, setShowEmail] = useState<boolean>(false);
  const [username, setUsername] = useState(userData?.userName || "oguzhan2000");
  const [_password, setPassword] = useState("");
  const menuItems = [
    { id: "kullanici-ayarlari", label: "Kullanıcı Ayarları", type: "header" },
    { id: "hesabim", label: "Hesabım", icon: <FaUser />, type: "item" },
    { id: "baglantilar", label: "Bağlantılar", icon: <FaLink />, type: "item" },
    { id: "uygulama", label: "Uygulama Ayarları", type: "header" },
    { id: "çıkış yap", label: "çıkış yap", icon: <GrLogout />, type: "item" },
  ];

  const ctx = useContext(AppContext);
  if (!ctx) {
    return null;
  }
  const { userInfo } = ctx;
  
  useEffect(() => {
    if (showSettings) {
      setIsAnimating(true);
    }
  }, [showSettings]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setShowSettings(false);
    }, 200);
  };

  const maskEmail = (email?: string) => {
    if (!email) return "";
    let maskedLocal = "";
    const [local, domain] = email.split("@");
    for (let i = 0; i < local.length; i++) {
      maskedLocal += "*";
    }
    return `${maskedLocal}@${domain}`;
  };

  const handleSavePassword = (newPassword: string) => {
    setPassword(newPassword);
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/70 z-40 transition-opacity duration-300 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex bg-[#202024] w-[95vw] max-w-[1400px] xl:max-w-[1400px] lg:max-w-[1200px] h-[750px] rounded-lg overflow-hidden select-none border border-[#313131] ${
          isAnimating ? "opacity-100" : "opacity-0 scale-90"
        }`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="lg:w-[260px] w-[200px] bg-[#1A1A1E] p-4 overflow-y-auto discord-scrollbar shrink-0 relative"
        >
          <div className="flex flex-col gap-1">
            <div
              onClick={() => setActiveTab("profileEditor")}
              className={`flex items-center gap-3 mb-4 px-2  hover:bg-[#2D2D33] ${activeTab === "profileEditor" ? "bg-[#2D2D33] " : ""} cursor-pointer rounded-lg `}
            >
              <img
                src={normalizePhotoUrl(userInfo?.profilePhoto) || defaultfoto}
                alt="avatar"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">{username}</p>
                <p className="text-gray-400 text-xs">Profilleri Düzenle</p>
              </div>
            </div>

            <div className="mb-4 ">
              <input
                type="search"
                placeholder="Ara"
                className="w-full bg-[#1E1F22] text-gray-300 text-sm px-3 py-2 rounded outline-none
                focus:ring-1 focus:ring-[#5865F2] placeholder-gray-500"
              />
            </div>
            {menuItems.map((item) =>
              item.type === "header" ? (
                <div
                  onClick={() => setActiveTab(item.label)}
                  key={item.id}
                  className="text-xs font-semibold text-gray-400 uppercase mt-4 mb-1 px-2 "
                >
                  {item.label}
                </div>
              ) : (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === "çıkış yap") {
                      setİsLogout(true);
                    } else {
                      setActiveTab(item.id);
                      setİsLogout(false);
                    }
                  }}
                  className={`flex items-center gap-3 px-2 py-1.5 rounded text-sm transition-all cursor-pointer
                  ${
                    activeTab === item.id
                      ? "bg-[#404249] text-white"
                      : "text-gray-300 hover:bg-[#35373C] hover:text-gray-100"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ),
            )}
          </div>
        </div>

        {isLogout && (
          <div className="absolute inset-0 z-10">
            <Logout setIsLogout={setİsLogout} isLogout={isLogout} />
          </div>
        )}

        <EditUsername
          isOpen={isEditUsername}
          onClose={() => setIsEditUsername(false)}
          currentUsername={username}
          setCurrentUsername={setUsername}
        />
        <ChangePassword
          isOpen={isChangePassword}
          onClose={() => setIsChangePassword(false)}
          onSave={handleSavePassword}
        />
        <div className="flex-1 flex flex-col relative">
          <div className="h-14 bg-[#202024] border-b border-[#26272B] flex items-center justify-between px-6">
            <h1 className="text-white font-semibold">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <IoClose size={28} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto discord-scrollbar">
            <div className=" max-w-4xl whitespace-nowrap mx-auto p-10">
              {activeTab === "hesabim" ? (
                <>
                  {/* Profil Banner ve Avatar */}
                  <div className="bg-[#121214] mt-20 rounded-lg overflow-hidden mb-6">
                    {/* Banner */}
                    <div className="relative h-[100px] bg-linear-to-r from-orange-600 to-red-600">
                      <img
                        src={
                          normalizePhotoUrl(userInfo?.profilePhoto) ||
                          defaultfoto
                        }
                        alt="banner"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Avatar + Username */}
                    <div className="px-6 -mt-6 mb-8 flex items-end justify-between bg-[#121214]">
                      <div className="flex items-end gap-4">
                        {/* Avatar */}
                        <div className="relative w-24">
                          <img
                            src={
                              normalizePhotoUrl(userInfo?.profilePhoto) ||
                              defaultfoto
                            }
                            alt="avatar"
                            className="w-24 h-24 rounded-full border-[6px] border-[#232428]"
                          />
                          {/* Status Badge */}
                          <div className="absolute bottom-1 right-1 w-6 h-6 bg-[#45A366] rounded-full border-4 border-[#232428]" />
                        </div>

                        {/* Username */}
                        <h2 className="text-white text-xl font-bold flex items-center gap-2 mb-4">
                          {username}
                          <span className="text-gray-400">•••</span>
                        </h2>
                      </div>

                      <button
                        onClick={() => setActiveTab("profileEditor")}
                        className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-4 py-2 rounded text-sm font-medium transition-colors cursor-pointer mb-2"
                      >
                        Kullanıcı Profilini Düzenle
                      </button>
                    </div>

                    <div className="w-[95%] mb-4 m-auto bg-[#1A1A1E]">
                      <div className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                              Görünen Ad
                            </p>
                            <p className="text-white">
                              {userData?.userName || "OğuzhanDaud"}
                            </p>
                          </div>
                          <button
                            onClick={() => setActiveTab("profileEditor")}
                            className="text-sm text-white bg-[#1f1f20] hover:bg-[#2d2d33] px-4 py-2 rounded transition-colors cursor-pointer"
                          >
                            Düzenle
                          </button>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                              Kullanıcı Adı
                            </p>
                            <p className="text-white">{username}</p>
                          </div>
                          <button
                            onClick={() => setIsEditUsername(true)}
                            className="text-sm text-white bg-[#1f1f20] hover:bg-[#2d2d33] px-4 py-2 rounded transition-colors cursor-pointer"
                          >
                            Düzenle
                          </button>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                              E-posta
                            </p>
                            <p className="text-white">
                              {showEmail
                                ? userInfo?.email
                                : maskEmail(userInfo?.email)}
                              <span
                                onClick={() => setShowEmail((prev) => !prev)}
                                className="text-[#5865F2] ml-2 cursor-pointer hover:underline text-sm"
                              >
                                {showEmail ? "Gizle" : "Göster"}
                              </span>
                            </p>
                          </div>
                          <button className="text-sm text-white bg-[#1f1f20] hover:bg-[#2d2d33] px-4 py-2 rounded transition-colors cursor-pointer">
                            Düzenle
                          </button>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                              Telefon Numarası
                            </p>
                            <p className="text-white">
                              ********7092
                              <span className="text-[#5865F2] ml-2 cursor-pointer hover:underline text-sm">
                                Göster
                              </span>
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button className="text-sm text-white hover:underline px-4 py-2 rounded transition-colors cursor-pointer">
                              Kaldır
                            </button>
                            <button className="text-sm text-white bg-[#1f1f20] hover:bg-[#2d2d33] px-4 py-2 rounded transition-colors cursor-pointer">
                              Düzenle
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pb-4">
                    <h3 className="text-white font-semibold text-lg mb-4">
                      Şifre ve Doğrulama
                    </h3>
                    <button
                      onClick={() => setIsChangePassword(true)}
                      className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-4 py-2 rounded text-sm font-medium transition-colors cursor-pointer"
                    >
                      Şifreyi Değiştir
                    </button>
                  </div>

                  <div className="pb-4 pt-2">
                    <h3 className="text-white font-semibold text-base mb-2">
                      Hesap kaldırma{" "}
                    </h3>
                    <p className="text-gray-400  text-sm mb-4">
                      Hesabı devre dışı bıraktıktan sonra istediğin zaman geri
                      açabilirsin
                    </p>
                    <button className="bg-[#A9232E] hover:bg-[#941a2a] text-white px-4 py-2 rounded text-sm font-medium transition-colors cursor-pointer">
                      Hesabı devre dışı bırak{" "}
                    </button>
                    <button className="bg-[#29292d] ml-4 text-red-700 hover:bg-[#323238] px-2 py-2 rounded text-sm font-medium transition-colors cursor-pointer">
                      Hesabı Sil
                    </button>
                  </div>
                </>
              ) : activeTab === "profileEditor" ? (
                <ProfieEditor />
              ) : activeTab === "baglantilar" ? (
                <Connections />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserSettings;
