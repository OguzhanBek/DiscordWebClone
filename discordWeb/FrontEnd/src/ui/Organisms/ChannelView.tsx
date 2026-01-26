import {
  PiGifFill,
  PiPencilSimpleLineDuotone,
  PiSubtitlesDuotone,
} from "react-icons/pi";
import { FaGift, FaPlus } from "react-icons/fa";
import { LuSticker } from "react-icons/lu";
import { BiSolidWidget } from "react-icons/bi";
import { AiTwotoneFileAdd } from "react-icons/ai";
import { RiSurveyFill } from "react-icons/ri";
import { useState } from "react";

import ben from "../../assets/Tuta.png";
import IconWithUpSideHoverText from "../Molecules/IconWithUpSideHoverText";

function ChannelView() {
  const [openDropdown, setOpenDropdown] = useState(false);
  return (
    <div className="flex flex-col-reverse h-full overflow-y-auto">
      {/* Message Input Bar – en altta */}
      <div className="mx-auto w-full py-2 px-2 ">
        <div className="mx-auto flex items-center bg-[#232428] rounded-xl px-4 gap-3 border border-[#2B2D31] h-14">
          {/* Attach Button */}
          <button
            className="text-gray-300  transition-all hover:text-white 
text-3xl cursor-pointer  flex items-center justify-center"
          >
            {/* + butonu - Dropdown menü */}
            <div
              onClick={() => {
                setOpenDropdown(!openDropdown);
              }}
              className="flex  items-center relative space-x-1 cursor-pointer h-full"
            >
              <div className="Göz-At-Butonu  h-full flex items-center ">
                <FaPlus className="hover:bg-[#4B4C52] p-1   rounded-full" />

                {/* Dropdown Menü */}
                <div
                  className={`absolute bottom-[200px] translate-y-full left-1 text-sm rounded-xl opacity-0 flex flex-col 
         ${
           openDropdown && "opacity-100 "
         } bg-[#2b2b30] shadow-lg p-2 pointer-events-none ${
           openDropdown === true ? "pointer-events-auto" : "pointer-events-none"
         }  z-5000`}
                >
                  <button
                    className={` px-4 py-2 flex gap-2 cursor-pointer z-5000 rounded-xl hover:bg-[#303035] whitespace-nowrap  ${
                      openDropdown === true
                        ? "pointer-events-auto"
                        : "pointer-events-none"
                    }`}
                  >
                    <AiTwotoneFileAdd />
                    Bir dosya ekle
                  </button>
                  <button
                    className={` px-4 py-2 flex gap-2 cursor-pointer z-5000 rounded-xl hover:bg-[#303035] whitespace-nowrap  ${
                      openDropdown === true
                        ? "pointer-events-auto"
                        : "pointer-events-none"
                    }`}
                  >
                    <PiSubtitlesDuotone />
                    Alt başlık oluştur
                  </button>
                  <button
                    className={` px-4 py-2 flex gap-2 cursor-pointer z-5000 rounded-xl hover:bg-[#303035] whitespace-nowrap  ${
                      openDropdown === true
                        ? "pointer-events-auto"
                        : "pointer-events-none"
                    }`}
                  >
                    <RiSurveyFill />
                    Anket oluştur
                  </button>
                  <button
                    className={` px-4 py-2 flex gap-2 cursor-pointer z-5000 rounded-xl hover:bg-[#303035] whitespace-nowrap  ${
                      openDropdown === true
                        ? "pointer-events-auto"
                        : "pointer-events-none"
                    }`}
                  >
                    <BiSolidWidget /> Uygulamaları kullan
                  </button>
                </div>
              </div>
            </div>
          </button>

          {/* Input */}
          <input
            type="text"
            placeholder="Mesaj gönder..."
            className="flex-1 h-full  bg-transparent outline-none  text-gray-200 placeholder-gray-500"
          />

          {/* Right Icons */}
          <div className="flex items-center gap-3 text-gray-400 text-lg">
            <IconWithUpSideHoverText
              Icon={FaGift}
              tooltipText="Arkadaşlarını yükselt! Onlara Nitro ile muhteşem sohbet S Lavantajlar hediye et.

etkinleştirmek icin Avarlar'a gidi"
            />
            <IconWithUpSideHoverText Icon={PiGifFill} tooltipText="" />
            <IconWithUpSideHoverText Icon={LuSticker} tooltipText="" />
            <IconWithUpSideHoverText Icon={BiSolidWidget} tooltipText="" />
          </div>
        </div>
      </div>

      {/* Messages + Header */}
      <div className="w-[calc(100%-50px)] select-text mx-auto">
        {/* Header (kanal adı bölümü) */}
        <div className="mt-22 mb-5">
          <span className="bg-[#393A41] mb-4 p-2 text-5xl rounded-full w-16 h-16 flex items-center justify-center">
            #
          </span>
          <p className="text-3xl mb-3">
            <span className="text-3xl"> # </span> Genele hoş geldiniz
          </p>
          <p className="mb-2"># Genelin doğuşu</p>

          <button className="flex select-none gap-2 items-center px-2 py-1 transition-all rounded-lg text-sm font-bold bg-[#232327] cursor-pointer hover:bg-[#2D2D33] active:bg-[#414149]">
            <PiPencilSimpleLineDuotone /> <span>Kanalı Düzenle</span>
          </button>
          {/* Bölüm alt çizgisi */}
          <div className="w-full h-0.5 mb-4 bg-[#2d2d4b] mt-4"></div>
        </div>

        {/* Message */}
        <div className="flex w-[calc(100%-50px)] gap-4 mb-8">
          <img src={ben} className="h-10 w-10 rounded-full" alt="user image" />
          <div className="text-white">
            <span className="font-bold mr-4">Tuta</span>
            <span className="text-sm text-gray-500">05.12.2025</span>
            <p> Noluyo özcan abi</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChannelView;
