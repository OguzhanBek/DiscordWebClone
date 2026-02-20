import { useContext, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoChatbubble } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { AppContext } from "../../context/userProvider";
import { normalizePhotoUrl } from "../../helpers/helpers";

type FriendListItemProps = {
  userName: string;
  friendId: string;
  profilePhoto?: string | undefined;
};

function FriendListItem({
  userName,
  friendId,
  profilePhoto,
}: FriendListItemProps) {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  if (!context) return null;

  const [isMoreOpen, setIsMoreOpen] = useState<boolean>(false);

  const {
    jwtToken,
    setDmParticipants,
    setJwtToken,
    setConversationList,
    onlineFriends,
  } = context;

  const isOnline = onlineFriends.some((f) => f.friendId === friendId);

  const createOrOpenDm = async () => {
    if (!jwtToken) {
      navigate("/login");
      return;
    }

    if (!friendId) {
      toast.error("Kullanıcı bilgisi bulunamadı.");
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch("http://localhost:5200/api/chat/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          friendId: [friendId],
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status === 401) {
        localStorage.removeItem("jwtToken");
        setJwtToken(null);
        navigate("/login");
        return;
      }

      if (response.status === 403) {
        toast.error("Bu kullanıcıyla mesajlaşma yetkiniz yok.");
        return;
      }

      if (response.status === 404) {
        toast.error("Kullanıcı bulunamadı.");
        return;
      }

      if (!response.ok) {
        console.error(response.text);
        toast.error(`"Bir hata oluştu. Lütfen tekrar deneyin. `);
        return;
      }

      const data = await response.json();
      if (!data?.conversationId) {
        toast.error("Geçersiz sunucu yanıtı.");
        return;
      }
      navigate(`/directMessage/${data.conversationId}`);

      setDmParticipants([
        {
          userId: friendId,
          userName: userName,
          profilePhoto: profilePhoto,
        },
      ]);

      setConversationList((prev) => {
        const current = prev || [];
        const firstOccurrenceIndex = current.findIndex(
          (c) => c.conversationId === data.conversationId,
        );

        const newConversation = {
          conversationId: data.conversationId,
          friendId: friendId,
          userName: userName,
          profilePhoto: profilePhoto,
        };

        if (firstOccurrenceIndex === -1) {
          return [...current, newConversation];
        }

        const withoutOld = current.filter(
          (c) => c.conversationId !== data.conversationId,
        );
        withoutOld.splice(firstOccurrenceIndex, 0, newConversation);
        return withoutOld;
      });
    } catch (error: any) {
      if (error.name === "AbortError") {
        toast.error("İstek zaman aşımına uğradı. Lütfen tekrar deneyin.");
      } else if (error instanceof TypeError) {
        toast.error(
          "Sunucuya bağlanılamıyor. İnternet bağlantınızı kontrol edin.",
        );
      } else {
        console.error("Chat açılırken hata:", error);
        toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    }
  };

  return (
    <div
      onClick={() => createOrOpenDm()}
      className="relative Friend-List-Item border-t border-[#31313b]
                 flex items-center justify-between rounded-md h-16
                 transition-all bg-[#1A1A1E] w-full px-4
                 hover:bg-[#232327] active:bg-[#2C2C30] cursor-pointer"
    >
      {/* LEFT SIDE */}
      <div className=" flex items-center gap-3">
        <div className="relative h-10 w-10 rounded-2xl">
          <div
            className={`absolute flex items-center justify-center -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#121214] ${
              isOnline ? "bg-[#45A366]" : "bg-[#77787F]"
            }`}
          >
            <div
              className={`w-1 h-1 rounded-full ${isOnline ? "bg-[#45A366]" : "bg-[#121214]"}`}
            />
          </div>
          <img
            className="h-10 w-10 rounded-2xl"
            src={normalizePhotoUrl(profilePhoto)}
            alt=""
          />
        </div>

        <div className="flex flex-col items-start">
          <p className="text-md font-semibold text-white">{userName}</p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-2 text-gray-400">
        {/* MESSAGE */}
        <div className="relative group/icon">
          <IoChatbubble
            onClick={createOrOpenDm}
            size={40}
            className="rounded-full p-2 hover:bg-[#19191D] hover:text-white transition cursor-pointer"
          />

          <span
            className="absolute left-1/2 -translate-x-1/2 -translate-y-full top-0
                       bg-[#36363b] text-white text-xs p-2 rounded
                       opacity-0 group-hover/icon:opacity-100 transition-opacity
                       whitespace-nowrap pointer-events-none"
          >
            Mesaj gönder
          </span>
        </div>

        <div className="relative">
          <div className="relative group/icon">
            <BsThreeDotsVertical
              onClick={(e) => {
                setIsMoreOpen(true);
                e.stopPropagation();
              }}
              size={40}
              className="rounded-full p-2 hover:bg-[#19191D] hover:text-white transition cursor-pointer"
            />

            <span
              className="absolute left-1/2 -translate-x-1/2 -translate-y-full top-0
                         bg-[#36363b] text-white text-xs p-2 rounded
                         opacity-0 group-hover/icon:opacity-100 transition-opacity
                         whitespace-nowrap pointer-events-none "
            >
              Daha fazla
            </span>
          </div>

          {/* OVERLAY + MENU */}
          {isMoreOpen && (
            <>
              <div
                className="fixed inset-0 z-40 select-none cursor-default"
                onClick={(e) => {
                  setIsMoreOpen(false);
                  e.stopPropagation();
                }}
              />
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute -top-4 left-10 z-50 select-none"
              >
                <ul className="w-56 rounded-lg bg-[#1f1f24] shadow-xl border border-[#2a2a2f] py-1 text-sm select-none">
                  <li className="px-4 py-2 hover:bg-[#2b2b30] cursor-pointer transition">
                    📹 Görüntülü arama başlat
                  </li>

                  <li className="px-4 py-2 hover:bg-[#2b2b30] cursor-pointer transition select-none">
                    🔊 Sesli arama başlat
                  </li>

                  <div className="my-1 border-t border-[#2a2a2f]" />

                  <li className="px-4 py-2 text-red-400 hover:bg-[#3a1f25] cursor-pointer transition select-none">
                    ❌ Arkadaşı çıkar
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
export default FriendListItem;
