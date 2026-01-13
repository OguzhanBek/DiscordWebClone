import { useContext, useEffect, useRef, useState } from "react";
import { FaUserFriends } from "react-icons/fa";
import { GiSpinningBlades } from "react-icons/gi";
import { CiCirclePlus, CiShop } from "react-icons/ci";
import IconButton from "../Molecules/ButtonWithIcon";
import DirectConversationItems from "./DirectConversationItems";
import Transparentmodal from "../../model/Transparentmodal";
import FindFriends from "../Molecules/FindFriends";
import { RxCross1 } from "react-icons/rx";
import { FiFolderPlus } from "react-icons/fi";
import { PiPencilSimpleDuotone } from "react-icons/pi";
import { ImExit } from "react-icons/im";
import {
  MdEventAvailable,
  MdKeyboardArrowDown,
  MdOutlineDiamond,
  MdOutlineSecurity,
  MdOutlineWidgets,
} from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { IoIosNotificationsOutline } from "react-icons/io";
import { useLocation } from "react-router-dom";
import DmOlusturYazısı from "../Molecules/DmOlusturYazısı";
import ServerMutliChannelButton from "../Molecules/ServerMutliChannelButton";
import UserPanel from "./UserPanel";
import { AppContext } from "../../context/userProvider";
import CreateDMModal from "./CreateDMModal";

function DirectMessagesSideBar() {
  const [iconsAndTitles] = useState([
    { Icon: FaUserFriends, title: "Arkadaşlar", route: "/friends" },
    { Icon: GiSpinningBlades, title: "Nitro", route: "/store" },
    { Icon: CiShop, title: "Mağaza", route: "/shop" },
  ]);

  const [openFindFriends, setOpenFindFriends] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const ctx = useContext(AppContext);
  if (!ctx) return null;
  const { sidebarWidth, setSidebarWidth, openCreateDmModal, friendList } = ctx;
  const { pathname } = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const startWidth = useRef(sidebarWidth);

  const handleMouseDown = (e: React.MouseEvent) => {
    startX.current = e.clientX;
    startWidth.current = sidebarWidth;

    document.addEventListener("mousemove", handleMouseMove);

    document.addEventListener("mouseup", handleMouseUp);

    console.log("fareye basıldı");
  };

  const handleMouseMove = (e: MouseEvent) => {
    const deltaX = e.clientX - startX.current;
    const newWidth = sidebarWidth + deltaX;
    const clampedWidth = Math.max(180, Math.min(400, newWidth));
    if (clampedWidth == 400 || clampedWidth == 182) {
      return;
    }
    setSidebarWidth(clampedWidth);
    console.log("genişlik değiştiriliyor");
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    console.log("fare bırakıldı");
  };

  const isChannelPage = pathname.startsWith("/channels");

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      // tıklanan yer menünün içi değilse kapat dropdownRef.current && kısmı null olabilir diye var yoksa kod çalışıyor yine
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div
        style={{ width: sidebarWidth }}
        className=" relative flex flex-col items-center  text-amber-50 border-r border-transparent text-center"
      >
        <UserPanel />
        {/*Server adı ve özellikleri partı*/}
        {isChannelPage ? (
          <div className="relative w-full">
            <div
              ref={dropdownRef}
              onClick={() => setIsOpen(!isOpen)}
              className={`isServerSideBarTrue-dropdown  relative  hover:bg-[#1C1C1E]  rounded-md  ${
                isOpen ? "bg-[#1C1C1E]" : ""
              }`}
            >
              {/* İçterki daha ufak div */}
              <div
                ref={dropdownRef}
                className={`isServerSideBarTrue-dropdown-subdiv relative  border-b border-[#1C1C1E] px-2 cursor-pointer h-12  w-[95%]  flex justify-between mx-auto items-center  
              `}
                onClick={() => {
                  setIsOpen(!isOpen);
                }}
              >
                <p className="font-semibold">Servername</p>
                {isOpen ? (
                  <RxCross1 size={16} className="pointer-events-none" />
                ) : (
                  <MdKeyboardArrowDown
                    size={20}
                    className="pointer-events-none"
                  />
                )}
              </div>

              <div
                className={`dropdown-menu  absolute w-[220px] rounded-md top-full left-1/2 -translate-x-1/2 mt-1 bg-[#28282D] z-100  ${
                  isOpen ? "" : "hidden"
                } `}
              >
                <div className="w-[95%]  mx-auto text-sm mt-2 mb-2">
                  <div className="container flex items-center justify-between  hover:bg-[#303035]   cursor-pointer rounded-md py-2 px-2">
                    <p>Sunucu Takviyesi</p>
                    <MdOutlineDiamond />
                  </div>
                  {/* ara bölücü uzun çizgi */}
                  <div className="long-line border-b border-[#303035] mt-2 mb-2"></div>
                  <div className="container flex items-center justify-between hover:bg-[#303035] cursor-pointer rounded-md py-2 px-2">
                    <p>İnsanları Davet Et</p>
                    <FaUserFriends />
                  </div>
                  <div className="container flex items-center justify-between hover:bg-[#303035] cursor-pointer rounded-md py-2 px-2">
                    <p>Sunucu Ayarları</p>
                    <IoSettingsOutline />
                  </div>

                  <div className="container flex items-center justify-between hover:bg-[#303035] cursor-pointer rounded-md py-2 px-2">
                    <p>Kanal Oluştur</p>
                    <CiCirclePlus />
                  </div>
                  <div className="container flex items-center justify-between hover:bg-[#303035] cursor-pointer rounded-md py-2 px-2">
                    <p>Kategori Oluştur</p>
                    <FiFolderPlus />
                  </div>
                  <div className="container flex items-center justify-between hover:bg-[#303035] cursor-pointer rounded-md py-2 px-2">
                    <p>Etkinlik Oluştur</p>
                    <MdEventAvailable />
                  </div>
                  <div className="container flex items-center justify-between hover:bg-[#303035] cursor-pointer rounded-md py-2 px-2">
                    {" "}
                    <p>Uygulama Dizini</p>
                    <MdOutlineWidgets />
                  </div>
                  <div className="long-line border-b border-[#303035] mt-2 mb-2"></div>

                  <div className="container flex items-center justify-between hover:bg-[#303035] cursor-pointer rounded-md py-2 px-2">
                    {" "}
                    <p>Bildirim Ayarları</p>
                    <IoIosNotificationsOutline />
                  </div>
                  <div className="container flex items-center justify-between hover:bg-[#303035] cursor-pointer rounded-md py-2 px-2">
                    {" "}
                    <p className="hover:bg-[#303035] cursor-pointer rounded-md ">
                      Gizlilik Ayarları
                    </p>
                    <MdOutlineSecurity />
                  </div>
                  <div className="container flex items-center justify-between hover:bg-[#303035] cursor-pointer rounded-md py-2 px-2">
                    {" "}
                    <p className="  truncate">
                      Sunucu Başına Profilini özelleştir
                    </p>
                    <PiPencilSimpleDuotone />
                  </div>
                  <div className="container flex items-center justify-between hover:bg-[#303035] cursor-pointer rounded-md py-2 px-2">
                    {" "}
                    <p className=" ">Sust. Kanalları Gizle</p>
                  </div>
                  {/* bu server name altındaki uzun çizgi. */}
                  <div className="long-line border-b border-[#303035] mt-2 mb-2"></div>
                  <div className="container flex items-center justify-between hover:bg-[#34282D] cursor-pointer rounded-md py-2 px-2">
                    <p className=" text-red-500 ">Sunucudan Ayrıl</p>
                    <ImExit className="text-red-500" />
                  </div>
                </div>
              </div>
            </div>
            {/* sohbet ve ses odaları kısmı. */}
            <div className="mt-2">
              <ServerMutliChannelButton ChannelType="text" ChannelName="tuta" />
              <ServerMutliChannelButton
                ChannelType="text"
                ChannelName="koser"
              />
              <ServerMutliChannelButton
                ChannelType="voice"
                ChannelName="erkan"
              />
              <ServerMutliChannelButton
                ChannelType="string"
                ChannelName="ozan"
              />
            </div>
          </div>
        ) : (
          /* Sohbet bul butonu*/
          <div className="SOHBET-BUTONU flex flex-col  h-12   items-center w-full pb-1 pt-1 mx-auto border-b border-[#1C1C1E] ">
            <button
              onClick={() => setOpenFindFriends(true)}
              className="bg-[#1C1C1E] h-full rounded-xl w-[95%]  pt-2 pb-2 hover:bg-[#27272A] hover:cursor-pointer transition-all "
            >
              <span className="text-sm font-semibold">
                Sohbet bul ya da başlat
              </span>
            </button>
            {/* seçenekler kısmı */}
            <div className="pb-2 w-full border-b  border-[#212124]">
              {iconsAndTitles.map(({ Icon, title, route }, index) => (
                <IconButton
                  key={index}
                  Icon={Icon}
                  title={title}
                  route={route}
                />
              ))}
            </div>
            {/* Direkt mesajlar kısmı */}
            <div className="mb-4 w-full  " onClick={() => setIsOpen(false)}>
              <DmOlusturYazısı
                text={"Direkt Mesaj"}
                beforeContentText={"DM Oluştur"}
              />
              <DirectConversationItems />
            </div>
            {openCreateDmModal && <CreateDMModal />}
          </div>
        )}
      </div>

      <div
        onMouseDown={handleMouseDown}
        className="w-1   hover:bg-gray-500 cursor-col-resize"
      />

      {openFindFriends && (
        <Transparentmodal setOpenFindFriends={setOpenFindFriends}>
          <FindFriends friendList={friendList} setOpenFindFriends={setOpenFindFriends} />
        </Transparentmodal>
      )}
    </>
  );
}
export default DirectMessagesSideBar;
