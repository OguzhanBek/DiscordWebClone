import { useContext, useState } from "react";
import { FaUserFriends } from "react-icons/fa";
import { TbMessageCircleCheck } from "react-icons/tb";
import NavbarButton from "../NavbarButton";
import { useLocation } from "react-router-dom";
import { AppContext } from "../../../context/userProvider";

function FriendsNavbar() {
  const [butons, _setButons] = useState<string[]>([
    "Çevrim içi",
    "Tümü",
    "Bekleyen",
    "Arkadaş Ekle",
  ]);

  const location = useLocation();

  const ctx = useContext(AppContext);
  if (!ctx) return null;
  const { setOpenCreateDmModal, openCreateDmModal } = ctx;

  return (
    <>
      <nav className="w-full flex flex-col items-center text-amber-50  bg-[#1A1A1E] text-center">
        <div className="w-[95%]">
          <div className="flex gap-4 h-12 justify-between  items-center w-full m-auto border-b border-[#212124]">
            {location.pathname === "/" || location.pathname === "/friends" ? (
              <>
                <div className="flex gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <FaUserFriends />
                    <span className="select-none">Arkadaşlar</span>
                  </div>
                  {butons.map((buttonText, index) => (
                    <NavbarButton buttonText={buttonText} key={index} />
                  ))}
                </div>

                <div className=" group lg:block relative hidden">
                  <TbMessageCircleCheck
                    onClick={() => {
                      setOpenCreateDmModal(!openCreateDmModal);
                    }}
                    className="text-2xl cursor-pointer text-gray-400 hover:text-white"
                  />

                  <span className="absolute top-full z-10 right-[60px] translate-x-1/2 ml-2 px-2 py-2 font-semibold text-xs bg-[#1A1A1E] text-gray-300 whitespace-nowrap rounded-md opacity-0 pointer-events-none transition-opacity duration-300 group-hover:opacity-100 group-hover:pointer-events-auto before:content-[''] before:absolute before:-top-1 before:left-1/2 before:-translate-x-1/2 before:bg-[#1A1A1E] before:h-2 before:w-2 before:rotate-45">
                    Yeni Grup DM'si
                  </span>
                </div>
              </>
            ) : location.pathname === "/shop" ? (
              <div className="relative group">
                <TbMessageCircleCheck className="text-2xl cursor-pointer text-gray-400 hover:text-white" />

                <span className="absolute top-full z-10 right-[60px] translate-x-1/2 ml-2 px-2 py-2 font-semibold text-xs bg-[#1A1A1E] text-gray-300 whitespace-nowrap rounded-md opacity-0 pointer-events-none transition-opacity duration-300 group-hover:opacity-100 group-hover:pointer-events-auto before:content-[''] before:absolute before:-top-1 before:left-1/2 before:-translate-x-1/2 before:bg-[#1A1A1E] before:h-2 before:w-2 before:rotate-45">
                  Yeni Grup DM'si
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </nav>
    </>
  );
}
export default FriendsNavbar;
