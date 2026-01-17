import React, { useContext } from "react";
import { Search, Globe } from "lucide-react";
import { FaDiscord } from "react-icons/fa";
import { AppContext } from "../../context/userProvider";
import { useSearchParams } from "react-router-dom";

const DiscordStoreNavbar: React.FC = () => {
  const ctx = useContext(AppContext);
  if (!ctx) return null;
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab");

  return (
    <nav className="Discord-Store-Navbar fixed  w-[-webkit-fill-available] h-12  z-100 bg-[#1A1A1E] text-white px-4  flex items-center justify-between  ">
      {/* Left side */}
      <div className="flex items-center space-x-6 h-12 ">
        <section
          className="flex items-center space-x-2 hover:cursor-pointer h-full "
          onClick={() => {
            setSearchParams("?tab=home");
          }}
        >
          <div className=" rounded flex items-center justify-center ">
            <FaDiscord size={24} />
          </div>
          <span className="font-semibold select-none whitespace-nowrap">
            Discord
            <span className="text-sm font-light "> Mağaza</span>
          </span>
        </section>

        <section className="catalogs-parent flex items-center space-x-4  text-gray-300  h-full">
          {/* Öne Çıkanlar - Dropdown'sız versiyon */}
          <h1
            onClick={() => setSearchParams("?tab=home")}
            className={`flex items-center whitespace-nowrap  relative space-x-1 h-full select-none hover:text-white ${
              tab === "home" || tab === null
                ? "before:visible before:bg-white text-white"
                : "before:invisible hover:before:visible hover:before:bg-blue-500"
            } cursor-pointer before:content-[''] before:absolute before:w-full before:h-0.5 before:bottom-0 `}
          >
            Öne Çıkanlar
          </h1>

          {/* Göz At - Dropdown menü düzeltildi */}
          <div
            className="flex group items-center relative space-x-1 cursor-pointer h-full"
            onClick={() => setSearchParams("?tab=catalog")}
          >
            <div className="Göz-At-Butonu h-full  flex items-center ">
              <h1
                className={` cursor-pointer  select-none  whitespace-nowrap 
                  before:content-[''] before:absolute before:w-full before:h-0.5 before:bottom-0 
                  ${
                    tab === "catalog"
                      ? "before:visible before:bg-white text-white"
                      : "before:invisible group-hover:before:visible group-hover:before:bg-blue-500 hover:text-white"
                  } 
                `}
              >
                Göz At
              </h1>

              <div
                style={{ transitionDelay: "200ms" }}
                className="absolute top-[90px] text-sm rounded-xl  left-0 w-50 opacity-0 flex flex-col 
                group-hover:opacity-100 group-hover:-translate-y-10 group-hover:transition-all group-hover:duration-200  
                bg-[#2b2b30] shadow-lg p-2 pointer-events-none group-hover:pointer-events-auto z-500"
              >
                <div className=" px-4 py-2 rounded-xl hover:bg-[#303035] whitespace-nowrap">
                  Avatar koleksiyonları
                </div>
                <div className=" px-4 py-2 rounded-xl hover:bg-[#303035] whitespace-nowrap">
                  Profil efektleri
                </div>
                <div className=" px-4 py-2 rounded-xl hover:bg-[#303035] whitespace-nowrap">
                  İsim Plakaları
                </div>
                <div className=" px-4 py-2 rounded-xl hover:bg-[#303035] whitespace-nowrap">
                  Paketler
                </div>
                <div className="] px-4 py-2 rounded-xl hover:bg-[#303035] whitespace-nowrap">
                  Tümünü Satın Al
                </div>
              </div>
            </div>
            <svg
              className={`w-4 group-hover:rotate-180 h-4 transition-transform duration-300  

              `}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {/* Orbs Özel - Dropdown'sız */}
          <h1
            onClick={() => setSearchParams("?tab=orbs")}
            className={`flex items-center relative whitespace-nowrap h-full space-x-1 select-none hover:text-white ${
              tab === "orbs"
                ? "before:visible before:bg-white text-white"
                : "before:invisible hover:before:visible hover:before:bg-blue-500"
            } cursor-pointer before:content-[''] before:absolute before:w-full before:h-0.5 before:bottom-0 `}
          >
            Orbs Özel
          </h1>
        </section>
      </div>

      {/* Right side */}
      <section className="flex items-center space-x-4">
        <div className="relative ">
          <input
            type="text"
            placeholder="Mağazada ara"
            className="bg-[#17171B]  text-gray-300 placeholder-gray-500 px-3 py-1.5 pl-8 rounded text-sm w-60 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-500" />
        </div>

        <div className="flex items-center space-x-2 text-gray-300">
          <Globe className="w-5 h-5" />
          <span className="text-sm">0</span>
        </div>
      </section>
    </nav>
  );
};

export default DiscordStoreNavbar;
