import { Search } from "lucide-react";
import { FaPhoneVolume, FaUserPlus } from "react-icons/fa";
import { IoVideocam } from "react-icons/io5";
import { BsPinAngleFill } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";

import React, { useContext } from "react";
import { AppContext } from "../../../context/userProvider";
import IconWithDownSideHoverText from "../NavbarActionIcon";
import ben from "../../../assets/Tuta.png";

const Navbar: React.FC = () => {
  const ctx = useContext(AppContext);
  if (!ctx) return null;
  const { dmFriendName } = ctx;

  return (
    <nav className="Discord-Store-Navbar fixed  w-[-webkit-fill-available] h-12  z-100 bg-[#1A1A1E] border-b border-[#303035] text-white px-4  flex items-center justify-between  ">
      {/* Left side */}
      <div className="flex items-center space-x-6 h-12 ">
        <section className="flex items-center space-x-2  h-full ">
          <div className=" rounded flex items-center justify-center text-gray-500 text-2xl mr-4">
            <img className="rounded-full w-8 h-8 ml-4 " src={ben} alt="tuta" />
          </div>
          {dmFriendName.map((friendName, index) => (
            <span
              key={index}
              className="font-semibold select-none whitespace-nowrap"
            >
              {friendName}
              {index < dmFriendName.length - 1 && ", "}
            </span>
          ))}
        </section>
      </div>

      {/* Right side */}
      <section className="flex items-center space-x-4">
        <div className="relative flex items-center gap-6 ">
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
          <IconWithDownSideHoverText
            Icon={CgProfile}
            tooltipText="Kullanıcı profilini göster"
          />
          <input
            type="text"
            placeholder={`${dmFriendName} sunucusunu ara`}
            className="bg-[#17171B]  text-gray-300 placeholder-gray-500 px-3 py-1.5  rounded text-sm w-60 focus:outline-none ring-1 ring-gray-700"
          />
          <Search className="absolute right-2.5 top-2 w-3.5 h-3.5 text-gray-500" />
        </div>
      </section>
    </nav>
  );
};

export default Navbar;
