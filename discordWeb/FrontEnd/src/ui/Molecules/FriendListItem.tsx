import { useContext } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoChatbubble } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/userProvider";
import { toast } from "react-toastify";

function FriendListItem({
  userPhoto,
  userName,
  onlineStatus,
  friendId,
}: {
  userPhoto: string;
  userName: string;
  onlineStatus: string;
  friendId: string;
}) {
  const navigate = useNavigate();
  const context = useContext(AppContext);
  if (!context) return null;

  const { jwtToken, setDmFriendName,setJwtToken } = context;

  const createOrOpenChat = async () => {
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
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 saniye timeout

      const response = await fetch("http://localhost:5200/api/chat/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          friendId: friendId,
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
        console.log(response.text);
        toast.error(`"Bir hata oluştu. Lütfen tekrar deneyin. `);
        return;
      }

      const data = await response.json();
      console.log("data", data);
      if (!data?.conversationId) {
        toast.error("Geçersiz sunucu yanıtı.");
        return;
      }

      console.log(data);
      navigate(`/directMessage/${data.conversationId}`);
      setDmFriendName(data.friendName);
    } catch (error: any) {
      if (error.name === "AbortError") {
        toast.error("İstek zaman aşımına uğradı. Lütfen tekrar deneyin.");
      } else if (error instanceof TypeError) {
        toast.error(
          "Sunucuya bağlanılamıyor. İnternet bağlantınızı kontrol edin."
        );
      } else {
        console.error("Chat açılırken hata:", error);
        toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    }
  };

  return (
    <button
      className="border-t group border-[#31313b] hover:border-transparent flex items-center justify-between
             rounded-md h-16 transition-all bg-[#1A1A1E] w-full px-4
             hover:bg-[#232327] hover:cursor-pointer active:bg-[#2C2C30] group"
    >
      {/* LEFT SIDE */}
      <div className="flex items-center gap-3">
        <img className="h-10 w-10 rounded-2xl" src={userPhoto} alt="" />

        <div className="flex flex-col items-start">
          <p className="text-md font-semibold text-white">{userName}</p>
          <span className="text-xs  text-gray-400">{onlineStatus}</span>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-2 group text-gray-400  ">
        <div className="relative group/icon">
          <IoChatbubble
            onClick={() => {
              createOrOpenChat();
            }}
            size={40}
            className="group-hover:bg-[#19191D] hover:text-white rounded-full p-2 transition"
          />

          <span
            className="absolute left-1/2 -translate-x-1/2 -translate-y-full top-0
               p-2  text-white text-xs  rounded opacity-0
               group-hover/icon:opacity-100 transition-opacity whitespace-nowrap pointer-events-none bg-[#36363b]"
          >
            Mesaj gönder
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-400  ">
          <div className="relative group/icon">
            <BsThreeDotsVertical
              size={40}
              className="group-hover:bg-[#19191D] hover:text-white rounded-full p-2 transition"
            />
            <span
              className="absolute left-1/2 -translate-x-1/2  bg-[#36363b] -translate-y-full top-0
                text-white text-xs p-2  rounded opacity-0
               group-hover/icon:opacity-100 transition-opacity whitespace-nowrap pointer-events-none"
            >
              Daha fazla
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
export default FriendListItem;
