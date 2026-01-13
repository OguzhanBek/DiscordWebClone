import { PiGifFill, PiSubtitlesDuotone } from "react-icons/pi";
import ben from "../../../assets/Tuta.png";
import IconWithUpSideHoverText from "../../Molecules/IconWithHoverText";
import { FaGift, FaPlus } from "react-icons/fa";
import { LuSticker } from "react-icons/lu";
import { BiSolidWidget } from "react-icons/bi";
import { useContext, useEffect, useState } from "react";
import { AiTwotoneFileAdd } from "react-icons/ai";
import { RiSurveyFill } from "react-icons/ri";
import { useParams } from "react-router-dom";
import { AppContext } from "../../../context/userProvider";
import { toast } from "react-toastify";

function MainContent() {
  type Message = {
    conversationId: string;
    authorUserId: string;
    authorUsername: string;
    content: string;
    createdAt: string;
    editedAt: string;
  };

  const [openDropdown, setOpenDropdown] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const { chatId } = useParams<{ chatId: string }>();
  const context = useContext(AppContext);
  if (!context) return null;

  const { jwtToken, dmFriendName, setDmFriendName } = context;

  useEffect(() => {
    if (!chatId) return;

    const getMessages = async () => {
      try {
        const response = await fetch(
          `http://localhost:5200/api/chat/${chatId}/messages`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );

        if (!response.ok) {
          toast.error("Mesajlar alınamadı");
          return;
        }

        const data = await response.json();
        setMessages(data.messages);
        setDmFriendName(data.friendName?.userName || "Bilinmeyen Kullanıcı");
      } catch (error) {
        console.log(error);
      }
    };

    getMessages();
  }, [chatId, jwtToken]);

  const sendMessage = async () => {
    if (!input.trim() || !chatId)
      toast.error("chatId eksik veya yanlış yazılmış");

    try {
      const response = await fetch(
        `http://localhost:5200/api/chat/${chatId}/message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({
            content: input,
          }),
        }
      );

      if (!response.ok) {
        toast.error("Mesaj gönderilemedi");
        return;
      }

      const data: Message = await response.json();

      setMessages((prev) => [...prev, data]);
      setInput("");
    } catch (error) {
      console.error(error);
      toast.error("Bir hata oluştu");
    }
  };

  return (
    <div className="flex h-full flex-col-reverse  overflow-y-auto discord-scrollbar">
      {/* Message Input Bar – en altta */}
      <div className="mx-auto  fixed w-[82%] px-2 bg-[#1A1A1E]  h-14">
        <div className="mx-auto flex items-center bg-[#232428] rounded-xl px-4 gap-3  h-full">
          {/* Attach Button */}
          <div
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
                    openDropdown === true
                      ? "pointer-events-auto"
                      : "pointer-events-none"
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
          </div>
          {/* Input */}
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            type="text"
            placeholder="Mesaj gönder..."
            className="flex-1 h-full bg-transparent outline-none text-gray-200 placeholder-gray-500"
          />
          {/* Right Icons */}
          <div className="flex items-center gap-3 text-gray-400 text-lg">
            <IconWithUpSideHoverText
              Icon={FaGift}
              tooltipText="Arkadaşlarını yükselt! Onlara Nitro ile muhteşem sohbet S Lavantajlar hediye et. etkinleştirmek icin Avarlar'a gidi"
            />
            <IconWithUpSideHoverText Icon={PiGifFill} tooltipText="" />
            <IconWithUpSideHoverText Icon={LuSticker} tooltipText="" />
            <IconWithUpSideHoverText Icon={BiSolidWidget} tooltipText="" />
          </div>
        </div>
      </div>

      {/* Messages + Header */}
      <div className="w-[calc(100%-50px)] pb-[60px] select-text mx-auto">
        {/* Header (kanal adı bölümü) */}
        <div className="mt-22 mb-5">
          <img
            src={ben}
            className=" select-none mb-4 p-2 text-5xl rounded-full w-24 h-24 flex items-center justify-center"
          />
          <p className="text-3xl mb-3">{dmFriendName}</p>
          Bu <span className="font-bold">{dmFriendName}</span> kullanıcısıyla
          olan direkt mesaj geçmişinin başlangıcıdır.
          {/* Bölüm alt çizgisi */}
          <div className="w-full h-0.5 mb-4 bg-[#28282D] mt-4"></div>
        </div>

        {/* Message */}
        {messages.map((msg) => (
          <div key={msg.createdAt} className="flex gap-4 mb-6">
            <img src={ben} className="select-none h-10 w-10 rounded-full" />
            <div className="text-white">
              <div className="flex items-center gap-3">
                <span className="font-bold">{msg.authorUsername}</span>{" "}
                <span className="text-sm text-gray-500">
                  {new Date(msg.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="mt-1">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default MainContent;
