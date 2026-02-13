import { useContext } from "react";
import ben from "../../assets/Tuta.png";
import { BsThreeDots, BsPersonPlus } from "react-icons/bs";
import { IoChevronForward } from "react-icons/io5";
import { AppContext } from "../../context/userProvider";
import { SignalRContext } from "../../context/signalRContext";

function FriendInfo() {
  const ctx = useContext(AppContext);
  if (!ctx) return null;
  const signalctx = useContext(SignalRContext);
  if (!signalctx) {
    return null;
  }
  const { dmFriendName } = ctx;

  return (
    <div className="h-full bg-[#242429] w-full text-white flex flex-col overflow-hidden">
      {/* HEADER / BANNER */}
      <div className="relative h-32">
        <img
          src={ben}
          alt="banner"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Top right icons */}
        <div className="absolute top-3 right-3 flex gap-2">
          <button className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center">
            <BsPersonPlus size={18} />
          </button>
          <button className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center">
            <BsThreeDots size={18} />
          </button>
        </div>
      </div>

      {/* PROFILE */}
      <div className="px-4 -mt-14 ">
        <div className="relative inline-block ">
          <img
            src={ben}
            alt="avatar"
            className="w-24 h-24 rounded-full border-4 border-[#1e1f22]"
          />
          {/* status */}
          <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#1e1f22]" />
        </div>

        <h2 className="mt-1 ml-1 text-xl font-bold">{dmFriendName}</h2>
        <p className="text-sm ml-1 text-gray-400 flex items-center gap-2">
          kosero6 <span className="text-green-400">#</span>
        </p>
      </div>

      {/* CONTENT */}
      <div className="px-4 mt-4 space-y-4 flex-1 overflow-y-auto discord-scrollbar ">
        {/* ABOUT CARD */}
        <div className="bg-[#2C2D32] rounded-lg p-4 space-y-3 ">
          <div>
            <h3 className="text-[12px] text-[#f7f7f7]  mb-1">Hakkında</h3>
            <p className="text-[12px] text-[#c7c7c7]">
              What can I do ? Sometimes
            </p>
          </div>

          <div>
            <h3 className="text-[12px] text-[#f7f7f7]  mb-1">
              Şu Tarihten Beri Üye:
            </h3>
            <p className="text-[12px] text-[#c7c7c7]">10 Nis 2017</p>
          </div>
        </div>

        <div>
          <div className="bg-[#2C2D32]   rounded-lg px-4 py-3 flex items-center justify-between hover:bg-[#2a2b30] cursor-pointer transition">
            <span className="text-sm">Ortak Sunucular — 5</span>
            <IoChevronForward className="text-gray-400" />
          </div>
          <div className="bg-[#2C2D32]  rounded-lg px-4 py-3 flex items-center justify-between hover:bg-[#2a2b30] cursor-pointer transition">
            <span className="text-sm">Ortak Arkadaşlar — 9</span>
            <IoChevronForward className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="border-t  border-[#2a2b30] px-4 py-3 text-center text-sm text-gray-400 hover:text-white cursor-pointer">
        Profilin Tamamını Görüntüle
      </div>
    </div>
  );
}

export default FriendInfo;
