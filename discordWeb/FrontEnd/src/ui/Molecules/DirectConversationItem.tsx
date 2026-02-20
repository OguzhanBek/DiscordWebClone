import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AppContext } from "../../context/userProvider";
import type { Participant } from "../../types/chat/conversation";
import { normalizePhotoUrl } from "../../helpers/helpers";
import { SignalRContext } from "../../context/signalRContext";

interface DirectConversationItemProps {
  conversationId: string;
  participants: Participant[];
  profilePhoto: (string | undefined)[];
  selectedDm: string | undefined;
}

function DirectConversationItem({
  conversationId,
  participants,
  profilePhoto,
  selectedDm,
}: DirectConversationItemProps) {
  const ctx = useContext(AppContext);
  const signalCtx = useContext(SignalRContext);
  const navigate = useNavigate();

  if (!ctx) return null;
  if (!signalCtx) {
    return null;
  }
  const { setDmParticipants, onlineFriends } = ctx;

  const handleClick = () => {
    setDmParticipants(participants);
    navigate(`/directMessage/${conversationId}`);
  };

  const displayName = participants.map((p) => p.userName).join(", ");
  const isOnline = onlineFriends.some((f) =>
    participants.some((p) => p.userId === f.friendId),
  );
  return (
    <div
      onClick={handleClick}
      className={`flex items-center gap-3 my-1 ml-1 px-2 py-2 rounded transition-normal  cursor-pointer ${
        selectedDm === conversationId
          ? "bg-[#35363C] hover:bg-[#1C1C1E]"
          : "hover:bg-[#1d1d20]"
      }`}
    >
      {participants.length > 1 ? (
        <div className="flex w-8 h-8 shrink-0 -space-x-2 ">
          {profilePhoto.slice(0, 2).map((photo, index) => (
            <div className="relative w-8 h-8 ">
              {index === 0 ? (
                <img
                  key={index}
                  src={normalizePhotoUrl(photo)}
                  alt="user"
                  className=" absolute top-0 object-center left-0 w-6 h-6 rounded-full  border-[#111214]"
                />
              ) : (
                <img
                  key={index}
                  src={normalizePhotoUrl(photo)}
                  alt="user"
                  className=" absolute bottom-0 object-center right-0 w-6 h-6 rounded-full  border-[#111214]"
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="relative w-8 h-8">
          <img
            src={normalizePhotoUrl(profilePhoto[0])}
            alt="user"
            className="w-8 h-8 rounded-full"
          />
          {
            <div
              className={`absolute flex items-center justify-center -bottom-0.5 -right-0.5 w-3 h-3 rounded-full  ${isOnline ? "bg-[#45A366] border-2 border-[#121214]" : "bg-[#77787F] border-2 border-[#121214]"}`}
            >
              <div
                className={` ${isOnline ? "bg-[#45A366] " : " border-2 border-[#121214]  bg-[#121214]"} w-1 h-1 rounded-full`}
              />
            </div>
          }
        </div>
      )}

      <span className="text-gray-300  font-medium truncate">{displayName}</span>
    </div>
  );
}
export default DirectConversationItem;
