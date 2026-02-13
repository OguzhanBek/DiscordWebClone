import { PiGifFill, PiSubtitlesDuotone } from "react-icons/pi";
import { FaGift, FaPlus } from "react-icons/fa";
import { LuSticker } from "react-icons/lu";
import { BiSolidWidget } from "react-icons/bi";
import { AiTwotoneFileAdd } from "react-icons/ai";
import { RiSurveyFill } from "react-icons/ri";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

import ben from "../../../assets/Tuta.png";
import IconWithUpSideHoverText from "../IconWithUpSideHoverText";
import { useContext, useEffect, useState, useRef } from "react";
import { AppContext } from "../../../context/userProvider";
import { SignalRContext } from "../../../context/signalRContext";
import type { Message } from "../../../types/chat/message";
import type { TypingUser } from "../../../types/chat/typing";

function MainContent() {
  const context = useContext(AppContext);
  const signalContext = useContext(SignalRContext);
  const { chatId } = useParams<{ chatId: string }>();
  const typingTimeoutRef = useRef<number | null>(null);

  const [openDropdown, setOpenDropdown] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);

  //contextler en üsste olur. Sonra bir altta hook varsa hoook gelir. Hooktan sonra da userefler gelir. Sonra da usestate gelir. Sonra da useffect. useEffectlerden sonra da if'ler gelir.

  if (!context) return null;

  const { jwtToken, dmFriendName, setDmFriendName } = context;

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

      // settimeout kullanmadan kullanmam lazımmış.
      typingTimeoutRef.current = setTimeout(async () => {
        await signalContext.chatConnection?.invoke("UserTyping", chatId, false);
      }, 2000); // her input değişiminde burası burayı resetliyorum. Sürekli 2 saniye sonra kapanıcak şekilde ayarlanıyor.
    } catch (error) {
      console.error("Typing event gönderilemedi:", error);
    }
  };

  //Bunu service dosyasına feth kodunu yazıp , sonra useQury ile hook oluşturulmalı.
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

        if (!dmFriendName || dmFriendName.length === 0) {
          const friendNames = Array.isArray(data.friendName)
            ? data.friendName
            : [data.friendName || "Bilinmeyen Kullanıcı"];
          setDmFriendName(friendNames);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getMessages();
  }, [chatId, jwtToken]);

  useEffect(() => {
    if (!signalContext?.chatConnection) return;

    const setupListeners = async () => {
      if (signalContext.chatConnection?.state !== "Connected") {
        await new Promise((resolve) => {
          const checkConnection = setInterval(() => {
            if (signalContext.chatConnection?.state === "Connected") {
              clearInterval(checkConnection);
              resolve(true);
            }
          }, 100);
        });
      }

      const handleReceiveMessage = (msg: Message) => {
        if (msg.conversationId !== chatId) return;
        setMessages((prev) => [...prev, msg]);
      };

      const handleUserTyping = (data: {
        conversationId: string;
        userId: string;
        username: string;
        isTyping: boolean; // bu şekilde object destructin type ı istemioyrlar. Types dosyasından gelcek her type.
      }) => {
        if (data.conversationId !== chatId) return;

        setTypingUsers((prev) => {
          if (data.isTyping) {
            if (!prev.find((u) => u.userId === data.userId)) {
              return [
                ...prev,
                { userId: data.userId, username: data.username },
              ];
            }
            return prev;
          } else {
            return prev.filter((u) => u.userId !== data.userId);
          }
        });
      };

      signalContext.chatConnection?.on("ReceiveMessage", handleReceiveMessage);
      signalContext.chatConnection?.on("UserTyping", handleUserTyping);

      return () => {
        signalContext.chatConnection?.off(
          "ReceiveMessage",
          handleReceiveMessage,
        );
        signalContext.chatConnection?.off("UserTyping", handleUserTyping);
      };
    };

    setupListeners();
  }, [signalContext?.chatConnection, chatId]);

  useEffect(() => {
    return () => {
      // Component unmount olduğunda timeout'u temizle
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

    joinConversation(); // bu şekilde kod yazılmaz. UseEffect içine fonksyion yazılmaz. Fonskiyton callback olarak dışarıdan çağırılmalı. useCallback ile yapabilirim.

    return () => {
      signalContext.chatConnection
        ?.invoke("LeaveConversation", chatId)
        .catch((err: any) => console.error("Ayrılma hatası:", err));
    };
  }, [chatId, signalContext?.chatConnection]);

  return (
    <div className="flex h-full flex-col-reverse overflow-y-scroll  discord-scrollbar">
      {/* Message Input Bar – en altta */}
      <div className="fixed bottom-0 w-full px-2 shrink-0 bg-[#1A1A1E]">
        <div className="mx-auto flex items-center bg-[#232428] rounded-xl px-4 py-4 gap-3 h-full">
          {/* Attach Button */}
          <div className="text-gray-300 transition-all hover:text-white text-3xl flex items-center justify-center">
            {/* + butonu - Dropdown menü  Burası tamamen klomponent olacak.*/}
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

                  {/* DROPDOWN MENU */}
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
          {/* Input */}
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
      <div className="w-[calc(100%-50px)] h-200 select-text mx-auto pb-20 shrink-0  flex flex-col justify-end">
        {/* Header (kanal adı bölümü) */}
        <div className="mt-22 ">
          <img
            src={ben}
            className="select-none mb-4 p-2 text-5xl rounded-full w-24 h-24 flex items-center justify-center"
          />
          <p className="text-3xl mb-3">{dmFriendName.join(", ")}</p>
          Bu <span className="font-bold">{dmFriendName.join(", ")}</span>{" "}
          kullanıcısıyla olan direkt mesaj geçmişinin başlangıcıdır.
          {/* Bölüm alt çizgisi */}
          <div className="w-full h-0.5 mb-4 bg-[#28282D] mt-4"></div>
        </div>

        {/* Messages Container */}
        <div className="flex flex-col">
          {messages.map((msg, index) => {
            const isFirstOfSequence =
              index === 0 ||
              messages[index - 1].authorUserId !== msg.authorUserId;

            return (
              <div
                key={msg.createdAt}
                className="flex gap-4 mb-1 group hover:bg-[#28282D] transition-all "
              >
                {isFirstOfSequence ? (
                  <img
                    src={ben}
                    className="select-none h-10 w-10 rounded-full mt-4"
                  />
                ) : (
                  <div className="w-10 flex items-center justify-center">
                    <span
                      className="text-xs text-gray-500 opacity-0 
                       group-hover:opacity-100 transition-opacity"
                    >
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                )}

                <div className="text-white">
                  {/* HEADER */}
                  {isFirstOfSequence && (
                    <div className="flex items-center gap-3 mt-4">
                      <span className="font-bold">{msg.authorUsername}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  )}

                  {/* MESSAGE */}
                  <p className={isFirstOfSequence ? "mt-1" : ""}>
                    {msg.content}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {typingUsers.length > 0 && (
            <div className="flex gap-4 mb-6">
              <img src={ben} className="select-none h-10 w-10 rounded-full" />
              <div className="text-gray-400 flex items-center gap-2">
                <span className="italic">
                  {typingUsers.map((u) => u.username).join(", ")} yazıyor
                </span>
                <div className="flex gap-1">
                  <span className="animate-bounce">.</span>
                  <span
                    className="animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  >
                    .
                  </span>
                  <span
                    className="animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  >
                    .
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default MainContent;
