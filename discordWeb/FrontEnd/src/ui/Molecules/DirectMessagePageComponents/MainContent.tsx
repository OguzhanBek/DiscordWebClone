import { PiGifFill, PiSubtitlesDuotone } from "react-icons/pi";
import ben from "../../../assets/Tuta.png";
import IconWithUpSideHoverText from "../IconWithUpSideHoverText";
import { FaGift, FaPlus } from "react-icons/fa";
import { LuSticker } from "react-icons/lu";
import { BiSolidWidget } from "react-icons/bi";
import { useContext, useEffect, useState, useRef } from "react"; //genellikle en üstte paketler olur , boşluk olucak bir altta sonra da kendi yazdıklarımız olacak.
import { AiTwotoneFileAdd } from "react-icons/ai";
import { RiSurveyFill } from "react-icons/ri";
import { useParams } from "react-router-dom";
import { AppContext } from "../../../context/userProvider";
import { toast } from "react-toastify";
import { SignalRContext } from "../../../context/signalRContext";

function MainContent() {
  type Message = {
    conversationId: string;
    authorUserId: string;
    authorUsername: string;
    content: string;
    createdAt: string;
    editedAt: string;
  };

  type TypingUser = {
    userId: string;
    username: string;
  };
  //contextler en üsste olur. Sonra bir altta hook varsa hoook gelir. Hooktan sonra da userefler gelir. Sonra da usestate gelir. Sonra da useffect. useEffectlerden sonra da if'ler gelir.

  
  const context = useContext(AppContext);
  const signalContext = useContext(SignalRContext);

  const { chatId } = useParams<{ chatId: string }>();

  const typingTimeoutRef = useRef<number | null>(null);



  const [openDropdown, setOpenDropdown] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);

  if (!context) return null;

  const { jwtToken, dmFriendName, setDmFriendName } = context;

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
        console.log(error);
      }
    };

    getMessages();
  }, [chatId, jwtToken]);

  const sendMessage = async () => {
    if (!input.trim() || !chatId) {
      toast.error("chatId eksik veya yanlış yazılmış");
      return;
    }

    try {
      //socketi provider'dan yönetilen hook şeklinde istiyorlar.
      await signalContext?.chatConnection?.invoke("SendMessage", chatId, input);

      // Typing durumunu kapat
      await signalContext?.chatConnection?.invoke("UserTyping", chatId, false);
      console.log("signal context mount bilgisi : ", signalContext);
      console.log(
        "signal context chat konection bilgisi : ",
        signalContext?.chatConnection,
      );
      setInput("");
    } catch (error) {
      console.error(error);
      toast.error("Bir hata oluştu");
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);

    if (!chatId || !signalContext) return;

    // Typing
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

  useEffect(() => {
    if (!signalContext?.chatConnection) return;

    // Bağlantının hazır olmasını bekle
    const setupListeners = async () => {
      // Eğer bağlantı "Connected" durumunda değilse, bekle
      if (signalContext.chatConnection?.state !== "Connected") {
        console.log("Bağlantı henüz hazır değil, bekleniyor...");
        // Bağlantının kurulmasını bekle
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
        console.log("Mesaj alındı:", msg.content);
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

      // Listener'ları ekle
      signalContext.chatConnection?.on("ReceiveMessage", handleReceiveMessage);
      signalContext.chatConnection?.on("UserTyping", handleUserTyping);

      console.log("✅ SignalR listeners kuruldu");

      // Cleanup
      return () => {
        signalContext.chatConnection?.off(
          "ReceiveMessage",
          handleReceiveMessage,
        );
        signalContext.chatConnection?.off("UserTyping", handleUserTyping);
        console.log("🧹 SignalR listeners temizlendi");
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
        console.log("✅ Sohbete katıldı:", chatId);
      } catch (error) {
        console.error("❌ Sohbete katılamadı:", error);
      }
    };

    joinConversation(); // bu şekilde kod yazılmaz. UseEffect içine fonksyion yazılmaz. Fonskiyton callback olarak dışarıdan çağırılmalı. useCallback ile yapabilirim.

    return () => {
      signalContext.chatConnection
        ?.invoke("LeaveConversation", chatId)
        .catch((err) => console.error("Ayrılma hatası:", err));
    };
  }, [chatId, signalContext?.chatConnection]);

  return (
    <div className="flex h-full flex-col-reverse overflow-y-auto discord-scrollbar">
      {/* Message Input Bar – en altta */}
      <div className="mx-auto fixed w-[82%] px-2 bg-[#1A1A1E] h-14">
        <div className="mx-auto flex items-center bg-[#232428] rounded-xl px-4 gap-3 h-full">
          {/* Attach Button */}
          <div
            className="text-gray-300 transition-all hover:text-white 
text-3xl cursor-pointer flex items-center justify-center"
          >
            {/* + butonu - Dropdown menü  Burası tamamen klomponent olacak.*/}
            <div
              onClick={() => {
                setOpenDropdown(!openDropdown);
              }}
              className="flex items-center relative space-x-1 cursor-pointer h-full"
            >
              <div className="Göz-At-Butonu h-full flex items-center">
                <FaPlus className="hover:bg-[#4B4C52] p-1 rounded-full" />

                {/* Dropdown Menü */}
                <div
                  className={`absolute bottom-[200px] translate-y-full left-1 text-sm rounded-xl opacity-0 flex flex-col 
         ${
           openDropdown && "opacity-100 "
         } bg-[#2b2b30] shadow-lg p-2 pointer-events-none ${
           openDropdown === true ? "pointer-events-auto" : "pointer-events-none"
         } z-5000`}
                >
                  <button
                    className={`px-4 py-2 flex gap-2 cursor-pointer z-5000 rounded-xl hover:bg-[#303035] whitespace-nowrap ${
                      openDropdown === true
                        ? "pointer-events-auto"
                        : "pointer-events-none"
                    }`}
                  >
                    <AiTwotoneFileAdd />
                    Bir dosya ekle
                  </button>
                  <button
                    className={`px-4 py-2 flex gap-2 cursor-pointer z-5000 rounded-xl hover:bg-[#303035] whitespace-nowrap ${
                      openDropdown === true
                        ? "pointer-events-auto"
                        : "pointer-events-none"
                    }`}
                  >
                    <PiSubtitlesDuotone />
                    Alt başlık oluştur
                  </button>
                  <button
                    className={`px-4 py-2 flex gap-2 cursor-pointer z-5000 rounded-xl hover:bg-[#303035] whitespace-nowrap ${
                      openDropdown === true
                        ? "pointer-events-auto"
                        : "pointer-events-none"
                    }`}
                  >
                    <RiSurveyFill />
                    Anket oluştur
                  </button>
                  <button
                    className={`px-4 py-2 flex gap-2 cursor-pointer z-5000 rounded-xl hover:bg-[#303035] whitespace-nowrap ${
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
      <div className="w-[calc(100%-50px)] pb-[60px] select-text mx-auto">
        {/* Header (kanal adı bölümü) */}
        <div className="mt-22 mb-5">
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

        {/* Messages */}
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
  );
}
export default MainContent;
