import { useContext } from "react";
import { BsThreeDots, BsPersonPlus } from "react-icons/bs";
import { IoChevronForward } from "react-icons/io5";
import { AppContext } from "../../context/userProvider";
import { SignalRContext } from "../../context/signalRContext";
import defaultPhoto from "../../../public/discord kullanıcı default foto.jpeg";
import { normalizePhotoUrl } from "../../helpers/helpers";

function FriendInfo() {
  const ctx = useContext(AppContext);
  if (!ctx) return null;

  const signalctx = useContext(SignalRContext);
  if (!signalctx) return null;

  const { dmParticipants } = ctx;

  const isGroup = dmParticipants && dmParticipants.length > 1;
  const displayName =
    dmParticipants?.map((p) => p.userName).join(", ") || "Kullanıcı";
  const firstParticipant = dmParticipants?.[0];



  const profilePhoto = firstParticipant?.profilePhoto
    ? normalizePhotoUrl(firstParticipant.profilePhoto)
    : defaultPhoto;

  // GRUP GÖRÜNÜMÜ
  if (isGroup) {
    return (
      <div className="h-full bg-[#1A1A1E] w-full text-white flex flex-col overflow-hidden border-l-2 border-[#28282D]">
        {/* Üyeler başlığı */}
        <div className="px-4 pt-5 pb-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Üyeler—{dmParticipants.length}
          </h3>
        </div>

        {/* Üye listesi */}
        <div className="flex-1 overflow-y-auto discord-scrollbar px-2">
          {dmParticipants.map((participant, index) => (
            <div
              key={index}
              className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#2e2f35] cursor-pointer transition-colors group"
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <img
                  src={normalizePhotoUrl(participant.profilePhoto)}
                  alt={participant.userName}
                  className="w-9 h-9 rounded-full object-cover"
                />
                {/* Online göstergesi — opsiyonel, hep yeşil */}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#242429]" />
              </div>

              {/* İsim */}
              <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors truncate">
                {participant.userName}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }


  return (
    <div className="h-full bg-[#242429] w-full text-white flex flex-col overflow-hidden">
      {/* HEADER / BANNER */}
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

      {/* PROFILE */}
      <div className="px-4 -mt-14">
        <div className="relative inline-block">
          <img
            src={profilePhoto}
            alt="avatar"
            className="w-24 h-24 rounded-full border-4 border-[#1e1f22]"
          />
          <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#1e1f22]" />
        </div>

        <h2 className="mt-1 ml-1 text-xl font-bold">{displayName}</h2>
        <p className="text-sm ml-1 text-gray-400 flex items-center gap-2">
          {firstParticipant?.userName || "kullanici"}{" "}
          <span className="text-green-400">#</span>
        </p>
      </div>

      {/* CONTENT */}
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

      {/* FOOTER */}
      <div className="border-t border-[#2a2b30] px-4 py-3 text-center text-sm text-gray-400 hover:text-white cursor-pointer">
        Profilin Tamamını Görüntüle
      </div>
    </div>
  );
}

export default FriendInfo;
