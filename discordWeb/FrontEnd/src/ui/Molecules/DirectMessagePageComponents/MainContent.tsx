import { PiGifFill, PiSubtitlesDuotone } from "react-icons/pi";
import { FaGift, FaPlus } from "react-icons/fa";
import { LuSticker } from "react-icons/lu";
import { BiSolidWidget } from "react-icons/bi";
import { AiTwotoneFileAdd } from "react-icons/ai";
import { RiSurveyFill } from "react-icons/ri";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

import defaultPhoto from "../../../../public/discord kullanıcı default foto.jpeg";
import IconWithUpSideHoverText from "../IconWithUpSideHoverText";
import { useContext, useEffect, useState, useRef } from "react";
import { AppContext } from "../../../context/userProvider";
import { SignalRContext } from "../../../context/signalRContext";
import type { Message } from "../../../types/chat/message";
import type { TypingUser } from "../../../types/chat/typing";
import Messages from "./Messages";
import { normalizePhotoUrl } from "../../../helpers/helpers";

function MainContent() {
  const context = useContext(AppContext);
  const signalContext = useContext(SignalRContext);
  const { chatId } = useParams<{ chatId: string }>();
  const typingTimeoutRef = useRef<number | null>(null);

  const [openDropdown, setOpenDropdown] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);

  if (!context) return null;

  const { jwtToken, dmParticipants, setDmParticipants } = context;



  const sendMessage = async () => {
    if (!input.trim() || !chatId) {
      toast.error("chatId eksik veya yanlış yazılmış");
      return;
    }

    try {
      await signalContext?.chatConnection?.invoke("SendMessage", chatId, input);
      await signalContext?.chatConnection?.invoke("UserTyping", chatId, false);
      setInput("");
    } catch (error) {
      console.error(error);
      toast.error("Bir hata oluştu");
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);

    if (!chatId || !signalContext) return;

    try {
      await signalContext.chatConnection?.invoke("UserTyping", chatId, true);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(async () => {
        await signalContext.chatConnection?.invoke("UserTyping", chatId, false);
      }, 2000);
    } catch (error) {
      console.error("Typing event gönderilemedi:", error);
    }
  };

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
          },
        );

        if (!response.ok) {
          toast.error("Mesajlar alınamadı");
          return;
        }

        const data = await response.json();
        setMessages(data.messages);

        if (data.participants && Array.isArray(data.participants)) {
          const participants = data.participants.map((friend: any) => ({
            userId: friend.userId,
            userName: friend.userName,
            profilePhoto: friend.profilePhoto,
          }));

          setDmParticipants(participants);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getMessages();
  }, [chatId, jwtToken]);

  useEffect(() => {
    if (!signalContext?.chatConnection) return;

    // Connection hazır değilse bekle, ama bunu async yapmak yerine
    // listener'ları hemen bağla, connection açılınca zaten tetiklenir
    const handleReceiveMessage = (msg: Message) => {
      if (msg.conversationId !== chatId) return;
      setMessages((prev) => [...prev, msg]);
    };

    const handleUserTyping = (data: {
      conversationId: string;
      userId: string;
      username: string;
      isTyping: boolean;
    }) => {
      if (data.conversationId !== chatId) return;

      setTypingUsers((prev) => {
        if (data.isTyping) {
          if (!prev.find((u) => u.userId === data.userId)) {
            return [...prev, { userId: data.userId, username: data.username }];
          }
          return prev;
        } else {
          return prev.filter((u) => u.userId !== data.userId);
        }
      });
    };

    signalContext.chatConnection.on("ReceiveMessage", handleReceiveMessage);
    signalContext.chatConnection.on("UserTyping", handleUserTyping);

    // Bu artık gerçekten çalışıyor - async fonksiyon içinde değil
    return () => {
      signalContext.chatConnection?.off("ReceiveMessage", handleReceiveMessage);
      signalContext.chatConnection?.off("UserTyping", handleUserTyping);
    };
  }, [signalContext?.chatConnection, chatId]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!signalContext?.chatConnection || !chatId) return;

    const joinConversation = async () => {
      try {
        await signalContext.chatConnection?.invoke("JoinConversation", chatId);
      } catch (error) {
        console.error("❌ Sohbete katılamadı:", error);
      }
    };

    joinConversation();

    return () => {
      signalContext.chatConnection
        ?.invoke("LeaveConversation", chatId)
        .catch((err: any) => console.error("Ayrılma hatası:", err));
    };
  }, [chatId, signalContext?.chatConnection]);

  const displayName =
    dmParticipants?.map((p) => p.userName).join(", ") || "Yükleniyor...";
  const profilePhotos =
    dmParticipants?.map((p) => normalizePhotoUrl(p.profilePhoto)) || [];

  return (
    <div className="flex h-full flex-col-reverse overflow-y-scroll discord-scrollbar">
      <div className="fixed bottom-0 w-full px-2 shrink-0 bg-[#1A1A1E]">
        <div className="mx-auto flex items-center bg-[#232428] rounded-xl px-4 py-4 gap-3 h-full">
          <div className="text-gray-300 transition-all hover:text-white text-3xl flex items-center justify-center">
            <div className="Göz-At-Butonu h-full flex items-center relative">
              <FaPlus
                onClick={() => {
                  setOpenDropdown(!openDropdown);
                }}
                className="hover:bg-[#4B4C52] p-1 rounded-full cursor-pointer"
              />

              {openDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setOpenDropdown(false)}
                  />

                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-full mb-2 left-1 z-50
                 text-sm rounded-xl flex flex-col
                 bg-[#2b2b30] shadow-lg p-2"
                  >
                    <button className="px-4 py-2 flex gap-2 rounded-xl hover:bg-[#303035] whitespace-nowrap">
                      <AiTwotoneFileAdd />
                      Bir dosya ekle
                    </button>

                    <button className="px-4 py-2 flex gap-2 rounded-xl hover:bg-[#303035] whitespace-nowrap">
                      <PiSubtitlesDuotone />
                      Alt başlık oluştur
                    </button>

                    <button className="px-4 py-2 flex gap-2 rounded-xl hover:bg-[#303035] whitespace-nowrap">
                      <RiSurveyFill />
                      Anket oluştur
                    </button>

                    <button className="px-4 py-2 flex gap-2 rounded-xl hover:bg-[#303035] whitespace-nowrap">
                      <BiSolidWidget />
                      Uygulamaları kullan
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
          <input
            value={input}
            onChange={handleInputChange}
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

      <div className="w-[calc(100%-50px)] h-200 select-text mx-auto pb-20 shrink-0 flex flex-col justify-end">
        {/* Header */}
        <div className="mt-22">
          {profilePhotos.length > 1 ? (
            <div className="flex -space-x-2 mb-4">
              {profilePhotos.slice(0, 3).map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt="user"
                  className="select-none rounded-full w-24 h-24 border-4 border-[#1A1A1E]"
                />
              ))}
            </div>
          ) : (
            <img
              src={profilePhotos[0] || defaultPhoto}
              alt="user"
              className="select-none mb-4 rounded-full w-24 h-24"
            />
          )}
          <p className="text-3xl mb-3">{displayName}</p>
          Bu <span className="font-bold">{displayName}</span> kullanıcısıyla
          olan direkt mesaj geçmişinin başlangıcıdır.
          <div className="w-full h-0.5 mb-4 bg-[#28282D] mt-4"></div>
        </div>

        {/* Messages */}
        <Messages typingUsers={typingUsers} messages={messages} />
      </div>
    </div>
  );
}
export default MainContent;
