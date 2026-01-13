import { IoMdClose } from "react-icons/io";
import type { directMessageButton } from "../../types/types";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AppContext } from "../../context/userProvider";

function DirectConversationItem({
  userName,
  userPhoto,
  friendId,
}: directMessageButton) {
  const navigate = useNavigate();

  const ctx = useContext(AppContext);
  if (!ctx) return null;
  const { setDmFriendName, jwtToken } = ctx;

  const createOrOpenChat = async () => {
    if (!jwtToken) {
      toast.error("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
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
          friendId: friendId,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status === 401) {
        toast.error("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
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
    <div
      onClick={() => createOrOpenChat()}
      className="DİREKT-MESAJLAR  relative flex flex-col items-center  m-auto    "
    >
      <button className="flex gap-2 h-8  items-center bg-[#121214] rounded-xl w-[95%] pt-6 pb-6 hover:bg-[#1C1C1E] hover:cursor-pointer active:bg-[#2C2C30] group hover:text-white">
        <img className="h-8 w-8 rounded-2xl ml-2" src={userPhoto} alt="" />
        <p className="text-md font-semibold text-gray-400 group-hover:text-white">
          {userName}
        </p>
        <span className="absolute  right-6 text-gray-400 group-hover:text-white group-hover:visible invisible">
          <IoMdClose className="text-gray-400 hover:text-white" />
        </span>
      </button>
    </div>
  );
}

export default DirectConversationItem;
