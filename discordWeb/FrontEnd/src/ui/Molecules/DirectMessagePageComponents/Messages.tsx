import { useContext } from "react";
import type { Message } from "../../../types/chat/message";
import type { TypingUser } from "../../../types/chat/typing";
import { AppContext } from "../../../context/userProvider";
import { normalizePhotoUrl } from "../../../helpers/helpers";

type messagesProps = {
  messages: Message[];
  typingUsers: TypingUser[];
};

function Messages({ messages, typingUsers }: messagesProps) {
  const ctx = useContext(AppContext);
  if (!ctx) {
    return null;
  }
  const { userInfo, dmParticipants } = ctx;



  const getMessageAuthorPhoto = (userId: string) => {
    const participant = dmParticipants?.find((p) => p.userId === userId);
    if (participant) {
      return normalizePhotoUrl(participant.profilePhoto);
    }

    return normalizePhotoUrl(userInfo?.profilePhoto);
  };

  return (
    <div className="flex flex-col">
      {messages.map((msg, index) => {
        const isFirstOfSequence =
          index === 0 || messages[index - 1].authorUserId !== msg.authorUserId;

        return (
          <div
            key={msg.createdAt}
            className="flex gap-4 mb-1 group hover:bg-[#28282D] transition-all"
          >
            {isFirstOfSequence ? (
              <img
                src={getMessageAuthorPhoto(msg.authorUserId)}
                alt={msg.authorUsername}
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

              <p className={isFirstOfSequence ? "mt-1" : ""}>{msg.content}</p>
            </div>
          </div>
        );
      })}

      {/* Typing Indicator */}
      {typingUsers.length > 0 && (
        <div className="flex gap-4 mb-6">
          <img
            src={getMessageAuthorPhoto(typingUsers[0].userId)}
            alt="typing user"
            className="select-none h-10 w-10 rounded-full"
          />
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
  );
}

export default Messages;