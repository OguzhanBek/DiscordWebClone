import { useContext } from "react";
import type { Message } from "../../../types/chat/message";
import type { TypingUser } from "../../../types/chat/typing";
import { AppContext } from "../../../context/userProvider";
import { normalizePhotoUrl } from "../../../helpers/helpers";

type messagesProps = {
  messages: Message[];
  typingUsers: TypingUser[];
  dmParticipants?: { userId: string; profilePhoto?: string }[];
};

function Messages({
  messages,
  typingUsers,
  dmParticipants: dmParticipantsProp,
}: messagesProps) {
  const ctx = useContext(AppContext);
  if (!ctx) return null;

  const { userInfo, dmParticipants: dmParticipantsCtx } = ctx;
  const dmParticipants = dmParticipantsProp ?? dmParticipantsCtx;

  const getMessageAuthorPhoto = (userId: string) => {
    const participant = dmParticipants?.find((p) => p.userId === userId);
    if (participant) return normalizePhotoUrl(participant.profilePhoto);
    return normalizePhotoUrl(userInfo?.profilePhoto);
  };

  return (
    <div className="flex flex-col">
      {messages.map((msg, index) => {
        const isFirstOfSequence =
          index === 0 || messages[index - 1].authorUserId !== msg.authorUserId;

        /* ─────────────────────────────────────
           IMAGE MESSAGE
        ───────────────────────────────────── */
        if (msg.messageType === "file") {
          console.log("tıtaaa :", msg.content);
          return (
            <div
              key={msg.createdAt}
              className="flex gap-3 mb-3 px-4 group hover:bg-[#28282D] transition-all py-2 rounded-lg"
            >
              {/* Avatar */}
              <img
                src={getMessageAuthorPhoto(msg.authorUserId)}
                alt={msg.authorUsername}
                className="select-none h-10 w-10 rounded-full mt-1 shrink-0"
              />

              <div className="flex flex-col gap-1 max-w-xs">
                {/* Yazar + zaman */}
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold text-sm">
                    {msg.authorUsername}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {/* Görsel kart */}
                <div className="rounded-xl overflow-hidden min-w-20 min-h-10 max-w-80 max-h-40 shadow-lg flex items-center justify-center">
                  <img
                    src={normalizePhotoUrl(msg.content)}
                    alt="shared image"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
            </div>
          );
        }

        /* ─────────────────────────────────────
           TEXT MESSAGE
        ───────────────────────────────────── */
        return (
          <div
            key={msg.createdAt}
            className="flex gap-4 mb-1 group hover:bg-[#28282D] transition-all px-4 py-0.5 rounded"
          >
            {/* Avatar sadece dizinin ilk mesajında */}
            {isFirstOfSequence ? (
              <img
                src={getMessageAuthorPhoto(msg.authorUserId)}
                alt={msg.authorUsername}
                className="select-none h-10 w-10 rounded-full mt-4 shrink-0"
              />
            ) : (
              <div className="w-10 flex items-center justify-center shrink-0">
                <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            )}

            <div className="text-white min-w-0">
              {/* Başlık satırı — yalnızca sekans ilk mesajı */}
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
              <p
                className={`wrap-break-words leading-relaxed ${isFirstOfSequence ? "mt-1" : ""}`}
              >
                {msg.content}
              </p>
            </div>
          </div>
        );
      })}

      {/* ─── Typing Indicator ─── */}
      {typingUsers.length > 0 && (
        <div className="flex gap-4 mb-6 px-4 items-center">
          <img
            src={getMessageAuthorPhoto(typingUsers[0].userId)}
            alt="typing user"
            className="select-none h-10 w-10 rounded-full shrink-0"
          />
          <div className="text-gray-400 flex items-center gap-2">
            <span className="italic text-sm">
              {typingUsers.map((u) => u.username).join(", ")} yazıyor
            </span>
            <div className="flex gap-0.5">
              <span className="animate-bounce text-lg leading-none">.</span>
              <span
                className="animate-bounce text-lg leading-none"
                style={{ animationDelay: "0.15s" }}
              >
                .
              </span>
              <span
                className="animate-bounce text-lg leading-none"
                style={{ animationDelay: "0.3s" }}
              >
                .
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Messages;
