import { useState, useContext } from "react";
import { BsThreeDots } from "react-icons/bs";
import { IoChatbubbleEllipses, IoPersonAdd } from "react-icons/io5";
import { normalizePhotoUrl } from "../../helpers/helpers";
import { AppContext } from "../../context/userProvider"; // kendi path'ini gir
import type { DmParticipant } from "../../types/chat/conversation";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUserFriends } from "react-icons/fa";
const DEFAULT_PHOTO_URL = "/discord kullanıcı default foto.jpeg";

const OfflineIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="block">
    <circle cx="8" cy="8" r="8" fill="#80848E" />
    <circle cx="8" cy="8" r="3.5" fill="#232428" />
  </svg>
);

const mockUser = {
  handle: "kullanici",
  banner: "",
  bio: "What can I do ? Sometimes",
  memberSince: "10 Nis 2017",
  mutualFriends: 9,
  mutualServers: 5,
  connections: [
    { icon: "📷", label: "selahattin.caglyn →", platform: "instagram" },
    { icon: "🎮", label: "KOSERO", platform: "epic" },
  ],
};

type UserProfileModalProps = {
  participant: DmParticipant;
  onClose: () => void;
};

type Tab = "etkinlik" | "ortak-arkadaslar" | "ortak-sunucular";

export default function UserProfileModal({
  onClose,
  participant,
}: UserProfileModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>("etkinlik");
  const [isAnimating] = useState(true);

  const ctx = useContext(AppContext);
  if (!ctx) {
    return null;
  }
  const navigate = useNavigate();
  const { onlineFriends, jwtToken, friendList } = ctx;
  const isOnline = onlineFriends.some((f) => f.friendId === participant.userId);

  const handleCreateMessage = async () => {
    try {
      const response = await fetch("http://localhost:5200/api/chat/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ friendId: [participant.userId] }),
      });

      if (!response.ok) {
        toast.error("mesaj gitmedi");
        return;
      }
      const data = await response.json();
      navigate(`/directMessage/${data.conversationId}`);
      onClose();
    } catch (error) {
      toast.error("gg dostum");
    }
  };
  const tabs = [
    { id: "etkinlik" as Tab, label: "Etkinlik" },
    {
      id: "ortak-arkadaslar" as Tab,
      label: `${mockUser.mutualFriends} Ortak Arkadaş`,
    },
    {
      id: "ortak-sunucular" as Tab,
      label: `${mockUser.mutualServers} Ortak Sunucu`,
    },
  ];

  const photo = participant.profilePhoto
    ? normalizePhotoUrl(participant.profilePhoto)
    : DEFAULT_PHOTO_URL;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-200 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Modal */}
      <div
        className={`relative z-10 w-[780px] max-h-[85vh] bg-[#232428] rounded-xl overflow-hidden shadow-2xl flex transition-all duration-200 ${
          isAnimating ? "scale-100" : "scale-90"
        }`}
      >
        {/* Sol taraf - Profil */}
        <div className="w-[420px] shrink-0 overflow-y-auto discord-scrollbar">
          {/* Banner */}
          <div className="relative h-[200px] bg-[#5865F2]">
            {mockUser.banner && (
              <img
                src={mockUser.banner}
                alt="banner"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Avatar */}
          <div className="select-none px-6 -mt-10 relative">
            <div className="relative inline-block">
              <img
                src={photo || DEFAULT_PHOTO_URL}
                alt="avatar"
                className="w-20 h-20 rounded-full border-4 border-[#232428] object-cover"
              />
              {/* Online / Offline göstergesi */}
              <div className="absolute bottom-0 right-0">
                {isOnline ? (
                  <div className="w-4 h-4 mr-2 rounded-full bg-[#45A366] border-2 border-[#232428]" />
                ) : (
                  <div className="rounded-full border-2 border-[#232428] overflow-hidden">
                    <OfflineIcon />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* İsim */}
          <div className="px-6 mt-3">
            <h2 className="text-white text-xl font-bold">
              {participant.userName}
            </h2>
            <p className="text-gray-400 text-sm">{mockUser.handle}</p>

            <div className="flex gap-2 mt-3">
              {friendList &&
              friendList.some((f) => f.friendId === participant.userId) ? (
                <>
                  <button
                    onClick={() => handleCreateMessage()}
                    className="flex cursor-pointer items-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white px-4 py-2 rounded-md text-sm font-medium transition"
                  >
                    <IoChatbubbleEllipses size={16} />
                    Mesaj
                  </button>
                  <button className="flex cursor-pointer items-center gap-2 bg-[#2b2d31] hover:bg-[#35373c] text-white px-4 py-2 rounded-md text-sm font-medium transition">
                    <FaUserFriends size={16} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleCreateMessage()}
                    className="flex cursor-pointer items-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white px-4 py-2 rounded-md text-sm font-medium transition"
                  >
                    <IoPersonAdd size={16} />
                    Arkadaş ekle
                  </button>
                  <button className="flex cursor-pointer items-center gap-2 bg-[#2b2d31] hover:bg-[#35373c] text-white px-4 py-2 rounded-md text-sm font-medium transition">
                    <IoChatbubbleEllipses size={16} />
                  </button>
                </>
              )}

              <button className="w-9 h-9 cursor-pointer rounded-md bg-[#2b2d31] hover:bg-[#35373c] flex items-center justify-center text-gray-300 transition">
                <BsThreeDots size={16} />
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="mx-6 mt-4 border-t border-[#3a3b41]" />

          {/* Bio */}
          <div className="px-6 mt-4">
            <p className="text-gray-300 text-sm">{mockUser.bio}</p>
          </div>

          {/* Üyelik tarihi */}
          <div className="px-6 mt-4">
            <p className="text-gray-400 text-xs font-semibold uppercase mb-1">
              Şu Tarihten Beri Üye:
            </p>
            <p className="text-gray-300 text-sm">{mockUser.memberSince}</p>
          </div>

          {/* Bağlantılar */}
          <div className="px-6 mt-4 pb-6">
            <p className="text-gray-400 text-xs font-semibold uppercase mb-2">
              Bağlantılar
            </p>
            <div className="space-y-2">
              {mockUser.connections.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-sm text-gray-300 hover:text-white cursor-pointer transition"
                >
                  <span className="text-base">{c.icon}</span>
                  <span>{c.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sağ taraf - Sekmeler */}
        <div className="flex-1 bg-[#2b2d31] flex flex-col">
          {/* Tab bar */}
          <div className="flex border-b border-[#3a3b41] px-4 pt-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 text-sm font-medium transition-colors relative mr-2 ${
                  activeTab === tab.id
                    ? "text-white"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Tab içeriği */}
          <div className="flex-1 flex items-center justify-center p-6 text-center">
            {activeTab === "etkinlik" && (
              <div>
                <p className="text-white font-semibold mb-2">
                  {participant.userName} adlı kişinin burada paylaşılacak bir
                  etkinliği yok
                </p>
                <p className="text-gray-400 text-sm mb-4">
                  Galiba hayalet kılığına girmiş 👻 Dikkatini çekmek için biraz
                  kurabiye bırak
                </p>
                <button
                  onClick={() => handleCreateMessage()}
                  className="flex items-center gap-2 bg-[#383a40] hover:bg-[#404249] text-white px-4 py-2 rounded-md text-sm mx-auto transition cursor-pointer"
                >
                  <IoChatbubbleEllipses size={16} />
                  Mesaj Gönder
                </button>
              </div>
            )}
            {activeTab === "ortak-arkadaslar" && (
              <div className="text-gray-400 text-sm">
                Ortak arkadaşlar burada görünecek
              </div>
            )}
            {activeTab === "ortak-sunucular" && (
              <div className="text-gray-400 text-sm">
                Ortak sunucular burada görünecek
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
