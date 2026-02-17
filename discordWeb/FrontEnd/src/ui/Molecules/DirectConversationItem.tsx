import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AppContext } from "../../context/userProvider";
import type { Participant } from "../../types/chat/conversation";
import { normalizePhotoUrl } from "../../helpers/helpers";

interface DirectConversationItemProps {
  conversationId: string;
  participants: Participant[];
  profilePhoto: (string | undefined)[];
}

function DirectConversationItem({
  conversationId,
  participants,
  profilePhoto,
}: DirectConversationItemProps) {
  const ctx = useContext(AppContext);
  const navigate = useNavigate();

  if (!ctx) return null;

  const { setDmParticipants } = ctx;

  const handleClick = () => {
    setDmParticipants(participants);
    navigate(`/directMessage/${conversationId}`);
  };
  const displayName = participants.map((p) => p.userName).join(", ");



  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-3 px-2 py-2 rounded hover:bg-[#35363C] cursor-pointer "
    >
      {participants.length > 1 ? (
        <div className="flex -space-x-2">
          {profilePhoto.slice(0, 2).map((photo, index) => (
            <img
              key={index}
              src={normalizePhotoUrl(photo)}
              alt="user"
              className="w-8 h-8 rounded-full border-2 border-[#111214]"
            />
          ))}
        </div>
      ) : (
        <img
          src={normalizePhotoUrl(profilePhoto[0])}
          alt="user"
          className="w-8 h-8 rounded-full"
        />
      )}

      <span className="text-gray-300 font-medium truncate">{displayName}</span>
    </div>
  );
}
export default DirectConversationItem;