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
  const { conversationId } = useParams<{ conversationId: string }>();
  const typingTimeoutRef = useRef<number | null>(null);

  const [openDropdown, setOpenDropdown] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<{
    content: string | File;
    type: "text" | "file";
  }>({ content: "", type: "text" });
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);

  if (!context) return null;
  const { jwtToken, dmParticipants, setDmParticipants } = context;

  const sendMessage = async () => {
    if (
      (input.content instanceof File
        ? input.content.size === 0
        : !input.content.trim()) ||
      !conversationId
    ) {
      toast.error("İçerik boş");
      return;
    }

    if (input.type === "file") {
      try {
        const formData = new FormData();
        formData.append("file", input.content as File);
        formData.append("content", "");
        formData.append("messageType", "file");

        const response = await fetch(
          `http://localhost:5200/api/chat/${conversationId}/send`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
            body: formData,
          },
        );

        if (!response.ok) {
          toast.error("Resim gönderilemedi");
          return;
        }

        const data: Message = await response.json();
        setPreviewPhoto(null);
        setInput({ content: "", type: "text" });

        // Burada önceden signal.invoke("SendMessage") vardı. Onu değiştirdik. Yoksa 2 kere db'ye kaydediliyodu. Şu an olan şey file tipindeki bir mesajı önce fetch ile db'ye kaydedip sonra broadcasMessage kanalından onu dinliyorum.
        await signalContext?.chatConnection?.invoke(
          "BroadcastMessage",
          conversationId,
          `http://localhost:5200${data.content}`,
          data.messageType,
        );

        await signalContext?.chatConnection?.invoke(
          "UserTyping",
          conversationId,
          false,
        );
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Bir hata oluştu");
      }
      return;
    }

    // Text mesajı — SignalR ile gönder, hub DB'ye yazar
    try {
      await signalContext?.chatConnection?.invoke(
        "SendMessage",
        conversationId,
        input.content as string,
        input.type,
      );
      await signalContext?.chatConnection?.invoke(
        "UserTyping",
        conversationId,
        false,
      );
      setInput({ content: "", type: "text" });
    } catch (error) {
      console.error(error);
      toast.error("Bir hata oluştu");
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ content: e.target.value, type: "text" });

    if (!conversationId || !signalContext) return;

    try {
      await signalContext.chatConnection?.invoke(
        "UserTyping",
        conversationId,
        true,
      );

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(async () => {
        await signalContext.chatConnection?.invoke(
          "UserTyping",
          conversationId,
          false,
        );
      }, 2000);
    } catch (error) {
      console.error("Typing event gönderilemedi:", error);
    }
  };

  useEffect(() => {
    if (!conversationId) return;

    const getMessages = async () => {
      try {
        const response = await fetch(
          `http://localhost:5200/api/chat/${conversationId}/messages`,
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
  }, [conversationId, jwtToken]);

  useEffect(() => {
    if (!signalContext?.chatConnection) return;

    const handleReceiveMessage = (msg: Message) => {
      if (msg.conversationId !== conversationId) return;
      setMessages((prev) => [...prev, msg]);
    };

    const handleUserTyping = (data: {
      conversationId: string;
      userId: string;
      username: string;
      isTyping: boolean;
    }) => {
      if (data.conversationId !== conversationId) return;

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

    return () => {
      signalContext.chatConnection?.off("ReceiveMessage", handleReceiveMessage);
      signalContext.chatConnection?.off("UserTyping", handleUserTyping);
    };
  }, [signalContext?.chatConnection, conversationId]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!signalContext?.chatConnection || !conversationId) return;

    const joinConversation = async () => {
      try {
        await signalContext.chatConnection?.invoke(
          "JoinConversation",
          conversationId,
        );
      } catch (error) {
        console.error("❌ Sohbete katılamadı:", error);
      }
    };

    joinConversation();

    return () => {
      signalContext.chatConnection
        ?.invoke("LeaveConversation", conversationId)
        .catch((err: any) => console.error("Ayrılma hatası:", err));
    };
  }, [conversationId, signalContext?.chatConnection]);

  useEffect(() => {
    if (previewPhoto) setOpenDropdown(false);
  }, [previewPhoto]);

  const displayName =
    dmParticipants?.map((p) => p.userName).join(", ") || "Yükleniyor...";
  const profilePhotos =
    dmParticipants?.map((p) => normalizePhotoUrl(p.profilePhoto)) || [];

  const sidebarlength: string | null = localStorage.getItem("sidebarWith");
  const isRigthbarOpen: string | null = localStorage.getItem("rightbarOpen");
  const totalWidth =
    parseInt(sidebarlength ?? "0") - (isRigthbarOpen === "true" ? 0 : 344);

  return (
    <div className="flex h-full flex-col-reverse overflow-y-scroll discord-scrollbar">
      <div
        style={{
          width: `calc(77% - ${totalWidth}px)`,
        }}
        className="fixed bottom-0 px-2 shrink-0 bg-[#1A1A1E] "
      >
        {previewPhoto && (
          <div className="absolute bottom-full left-4 mb-2 p-2 bg-[#2b2b30] rounded-xl shadow-lg">
            <div className="relative inline-block">
              <img
                src={previewPhoto}
                alt="preview"
                className="h-40 w-40 object-cover rounded-lg"
              />
              <button
                onClick={() => {
                  setPreviewPhoto(null);
                  setInput({ content: "", type: "text" });
                }}
                className="absolute -top-2 -right-2 cursor-pointer bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-white text-xs"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="mx-auto flex items-center bg-[#232428] rounded-xl px-4 py-4 gap-3 h-full">
          <div className="text-gray-300 transition-all hover:text-white text-3xl flex items-center justify-center">
            <div className="Göz-At-Butonu h-full flex items-center relative">
              <FaPlus
                onClick={() => setOpenDropdown(!openDropdown)}
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
                    className="absolute bottom-full mb-2 left-1 z-50 text-sm rounded-xl flex flex-col bg-[#2b2b30] shadow-lg p-2"
                  >
                    <button
                      className="px-4 py-2 flex gap-2 rounded-xl hover:bg-[#303035] whitespace-nowrap cursor-pointer"
                      onClick={() => document.getElementById("tuta")?.click()}
                    >
                      <AiTwotoneFileAdd />
                      Bir dosya ekle
                    </button>

                    <input
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPreviewPhoto(URL.createObjectURL(file));
                          setInput({ content: file, type: "file" });
                        }
                      }}
                      type="file"
                      name="file"
                      id="tuta"
                      className="hidden"
                    />

                    <button className="px-4 py-2 flex gap-2 rounded-xl hover:bg-[#303035] whitespace-nowrap cursor-pointer">
                      <PiSubtitlesDuotone />
                      Alt başlık oluştur
                    </button>

                    <button className="px-4 py-2 flex gap-2 rounded-xl hover:bg-[#303035] whitespace-nowrap cursor-pointer">
                      <RiSurveyFill />
                      Anket oluştur
                    </button>

                    <button className="px-4 py-2 flex gap-2 rounded-xl hover:bg-[#303035] whitespace-nowrap cursor-pointer">
                      <BiSolidWidget />
                      Uygulamaları kullan
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <input
            value={input.type === "file" ? "" : (input.content as string)}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            type="text"
            placeholder={
              previewPhoto ? "Bir açıklama ekle..." : "Mesaj gönder..."
            }
            className="flex-1 h-full bg-transparent outline-none text-gray-200 placeholder-gray-500"
          />

          <div className="flex items-center gap-3 text-gray-400 text-lg">
            <IconWithUpSideHoverText
              Icon={FaGift}
              tooltipText="Arkadaşlarını yükselt! Onlara Nitro ile muhteşem sohbet avantajları hediye et."
            />
            <IconWithUpSideHoverText Icon={PiGifFill} tooltipText="" />
            <IconWithUpSideHoverText Icon={LuSticker} tooltipText="" />
            <IconWithUpSideHoverText Icon={BiSolidWidget} tooltipText="" />
          </div>
        </div>
      </div>

      <div className="w-[calc(100%-50px)] h-200 select-text mx-auto pb-20 shrink-0 flex flex-col justify-end">
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

        <Messages typingUsers={typingUsers} messages={messages} />
      </div>
    </div>
  );
}

export default MainContent;
