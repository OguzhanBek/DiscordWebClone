import { Search } from "lucide-react";
import { FaPhoneVolume, FaUserPlus } from "react-icons/fa";
import { IoVideocam } from "react-icons/io5";
import { BsPinAngleFill } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";

import React, { useContext } from "react";
import { AppContext } from "../../../context/userProvider";
import IconWithDownSideHoverText from "../NavbarActionIcon";
import { normalizePhotoUrl } from "../../../helpers/helpers";

type NavbarProps = {
  isRightBarOpen: string | null;
  setIsRightBarOpen: (value: string) => void;
};

const Navbar: React.FC<NavbarProps> = ({
  isRightBarOpen,
  setIsRightBarOpen,
}) => {
  const ctx = useContext(AppContext);
  if (!ctx) return null;
  const { dmParticipants, onlineFriends } = ctx;

  const isOnline =
    dmParticipants.length === 1
      ? onlineFriends.some((f) => f.friendId === dmParticipants[0].userId)
      : false;

  return (
    <nav className="Discord-Store-Navbar fixed w-[-webkit-fill-available] h-12  bg-[#1A1A1E] border-b border-[#303035] text-white px-4 flex items-center justify-between">
      <div className="flex items-center space-x-6 h-12">
        <section className="flex items-center space-x-2 h-full">
          <div className="flex -space-x-2">
            {dmParticipants.slice(0, 2).map((participant, index) => (
              <div key={index} className="relative">
                <img
                  className="rounded-full w-8 h-8 border-2 border-[#1A1A1E]"
                  src={normalizePhotoUrl(participant.profilePhoto)}
                  alt={participant.userName}
                />
                {dmParticipants.length === 1 && (
                  <div
                    className={`absolute flex items-center justify-center -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#1A1A1E] ${isOnline ? "bg-[#45A366]" : "bg-[#77787F]"}`}
                  >
                    <div
                      className={`w-1 h-1 rounded-full ${isOnline ? "bg-[#45A366]" : "bg-[#121214]"}`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {dmParticipants.map((participant, index) => (
            <span
              key={index}
              className="font-semibold select-none whitespace-nowrap"
            >
              {participant.userName}
              {index < dmParticipants.length - 1 && ", "}
            </span>
          ))}
        </section>
      </div>

      {/* Right side */}
      <section className="flex items-center space-x-4">
        <div className="relative flex items-center gap-6">
          <IconWithDownSideHoverText
            Icon={FaPhoneVolume}
            tooltipText="Sesli arama başlat"
          />
          <IconWithDownSideHoverText
            Icon={IoVideocam}
            tooltipText="Görüntülü arama başlat"
          />
          <IconWithDownSideHoverText
            Icon={BsPinAngleFill}
            tooltipText="Sabitlenmiş Mesajlar"
          />
          <IconWithDownSideHoverText
            Icon={FaUserPlus}
            tooltipText="DM'ye arkadaş ekle"
          />
          <button
            onClick={() => {
              setIsRightBarOpen(isRightBarOpen === "true" ? "false" : "true");
              localStorage.setItem("rightbarOpen", isRightBarOpen === "true" ? "false" : "true");
            }}
            className={`text-xl p-2 rounded transition ${
              isRightBarOpen
                ? "bg-[#232428] text-white"
                : "text-gray-400 hover:text-white hover:bg-[#232428]"
            }`}
            title="Üye Listesi"
          >
            <IconWithDownSideHoverText
              Icon={CgProfile}
              tooltipText="Kullanıcı profilini göster"
            />
          </button>

          <input
            type="text"
            placeholder={`${dmParticipants.map((tuta) => tuta.userName)} sunucusunu ara`}
            className="bg-[#17171B] text-gray-300 placeholder-gray-500 px-3 py-1.5 rounded text-sm w-60 focus:outline-none ring-1 ring-gray-700"
          />
          <Search className="absolute right-2.5 top-2 w-3.5 h-3.5 text-gray-500" />
        </div>
      </section>
    </nav>
  );
};

export default Navbar;
