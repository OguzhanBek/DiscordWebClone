import { useContext, useEffect, useRef, useState } from "react";
import { BsThreeDots, BsPersonPlus } from "react-icons/bs";
import { IoChevronForward } from "react-icons/io5";
import { AppContext } from "../../context/userProvider";
import { SignalRContext } from "../../context/signalRContext";
import defaultPhoto from "../../../public/discord kullanıcı default foto.jpeg";
import { normalizePhotoUrl } from "../../helpers/helpers";
import MiniProfileCard from "./MiniProfileCard";

function FriendInfo() {
  const ctx = useContext(AppContext);
  if (!ctx) return null;

  const signalctx = useContext(SignalRContext);
  if (!signalctx) return null;

  const { dmParticipants, onlineFriends } = ctx;
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [_showUserDetails, setShowUserDetails] = useState<boolean>(false);
  const isGroup = dmParticipants && dmParticipants.length > 1;
  const displayName =
    dmParticipants?.map((p) => p.userName).join(", ") || "Kullanıcı";
  const firstParticipant = dmParticipants?.[0];

  const profilePhoto = firstParticipant?.profilePhoto
    ? normalizePhotoUrl(firstParticipant.profilePhoto)
    : defaultPhoto;

  const isOnline = onlineFriends.some((f) =>
    dmParticipants.some((p) => p.userId === f.friendId),
  );

  const handleOpen = (userId: string) => {
    if (activeUserId === userId) {
      setActiveUserId(null);
      return;
    }
    setActiveUserId(userId);
    setIsAnimating(true);
  };

  const handleClose = () => {
    setActiveUserId(null);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeUserId]);

  if (isGroup) {
    return (
      <div className="h-full bg-[#1A1A1E] w-full text-white flex flex-col border-l-2 border-[#28282D]">
        <div className="px-4 pt-5 pb-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Üyeler—{dmParticipants.length}
          </h3>
        </div>

        <div className="flex-1 discord-scrollbar px-2">
          {dmParticipants.map((participant, index) => {
            const isParticipantOnline = onlineFriends.some(
              (f) => f.friendId === participant.userId,
            );
            return (
              <MiniProfileCard
                key={index}
                handleOpen={handleOpen}
                activeUserId={activeUserId}
                participant={participant}
                index={index}
                cardRef={cardRef}
                isAnimating={isAnimating}
                setShowUserDetails={setShowUserDetails}
                isParticipantOnline={isParticipantOnline}
              />
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#242429] w-full text-white flex flex-col overflow-hidden">
      <div className="relative h-32">
        <img
          src={profilePhoto}
          alt="banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <button className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center">
            <BsPersonPlus size={18} />
          </button>
          <button className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center">
            <BsThreeDots size={18} />
          </button>
        </div>
      </div>

      <div className="px-4 -mt-14">
        <div className="relative inline-block">
          <img
            src={profilePhoto}
            alt="avatar"
            className="w-24 h-24 rounded-full border-4 border-[#1e1f22]"
          />
          <div
            className={`absolute flex items-center justify-center bottom-2 right-2 w-4 h-4 rounded-full ${isOnline ? "bg-[#45A366] border-2 border-[#121214]" : "bg-[#77787F] border-2 border-[#121214]"}`}
          >
            <div
              className={`${isOnline ? "bg-[#45A366]" : "border-2 border-[#121214] bg-[#121214]"} w-1 h-1 rounded-full`}
            />
          </div>
        </div>
        <h2 className="mt-1 ml-1 text-xl font-bold">{displayName}</h2>
        <p className="text-sm ml-1 text-gray-400 flex items-center gap-2">
          {firstParticipant?.userName || "kullanici"}{" "}
          <span className="text-green-400">#</span>
        </p>
      </div>

      <div className="px-4 mt-4 space-y-4 flex-1 overflow-y-auto discord-scrollbar">
        <div className="bg-[#2C2D32] rounded-lg p-4 space-y-3">
          <div>
            <h3 className="text-[12px] text-[#f7f7f7] mb-1">Hakkında</h3>
            <p className="text-[12px] text-[#c7c7c7]">
              What can I do ? Sometimes
            </p>
          </div>
          <div>
            <h3 className="text-[12px] text-[#f7f7f7] mb-1">
              Şu Tarihten Beri Üye:
            </h3>
            <p className="text-[12px] text-[#c7c7c7]">10 Nis 2017</p>
          </div>
        </div>
        <div>
          <div className="bg-[#2C2D32] rounded-lg px-4 py-3 flex items-center justify-between hover:bg-[#2a2b30] cursor-pointer transition">
            <span className="text-sm">Ortak Sunucular — 5</span>
            <IoChevronForward className="text-gray-400" />
          </div>
          <div className="bg-[#2C2D32] rounded-lg px-4 py-3 flex items-center justify-between hover:bg-[#2a2b30] cursor-pointer transition">
            <span className="text-sm">Ortak Arkadaşlar — 9</span>
            <IoChevronForward className="text-gray-400" />
          </div>
        </div>
      </div>

      <div className="border-t border-[#2a2b30] px-4 py-3 text-center text-sm text-gray-400 hover:text-white cursor-pointer">
        Profilin Tamamını Görüntüle
      </div>
    </div>
  );
}

export default FriendInfo;
