import { Search } from "lucide-react";
import { FaUserFriends } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { PiPushPinBold } from "react-icons/pi";
import { IoPricetag } from "react-icons/io5";
import React, { useContext } from "react";

import { AppContext } from "../../context/userProvider";
import NavbarActionIcon from "./NavbarActionIcon";

const ServerNavbar: React.FC = () => {
  const ctx = useContext(AppContext);
  if (!ctx) return null;

  return (
    <nav className="Discord-Store-Navbar fixed  w-[-webkit-fill-available] h-12  z-100 bg-[#1A1A1E] border-b border-[#303035] text-white px-4  flex items-center justify-between  ">
      {/* Left side */}
      <div className="flex items-center space-x-6 h-12 ">
        <section className="flex items-center space-x-2  h-full ">
          <div className=" rounded flex items-center justify-center text-gray-500 text-2xl mr-4">#</div>
          <span className="font-semibold select-none whitespace-nowrap">
            Genel
          </span>
        </section>
      </div>

      {/* Right side */}
      <section className="flex items-center space-x-4">
        <div className="relative flex items-center gap-6 ">
          <NavbarActionIcon
            Icon={IoPricetag}
            tooltipText="Alt başlıklar"
          />
          <NavbarActionIcon
            Icon={IoIosNotifications}
            tooltipText="Bildirim Ayarları"
          />
          <NavbarActionIcon
            Icon={PiPushPinBold}
            tooltipText="Sabitlenmiş Mesajlar"
          />
          <NavbarActionIcon
            Icon={FaUserFriends}
            tooltipText="Üye Bilgilerini Göster"
          />

          <input
            type="text"
            placeholder="Ara"
            className="bg-[#17171B]  text-gray-300 placeholder-gray-500 px-3 py-1.5  rounded text-sm w-60 focus:outline-none ring-1 ring-gray-700"
          />
          <Search className="absolute right-2.5 top-2 w-3.5 h-3.5 text-gray-500" />
        </div>
      </section>
    </nav>
  );
};

export default ServerNavbar;
