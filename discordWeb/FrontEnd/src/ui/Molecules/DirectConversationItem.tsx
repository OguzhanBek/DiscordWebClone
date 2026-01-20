import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/userProvider";

interface Participant {
  friendId: string;
  userName: string;
}

interface DirectConversationItemProps {
  conversationId: string;
  participants: Participant[];
  userPhoto: string;
}

function DirectConversationItem({
  conversationId,
  participants,
  userPhoto,
}: DirectConversationItemProps) {
  const ctx = useContext(AppContext);
  const navigate = useNavigate();

  if (!ctx) return null;

  const { setDmFriendName } = ctx;

  const handleClick = () => {
    // Tüm participant isimlerini context'e kaydet
    const names = participants.map((p) => p.userName);
    setDmFriendName(names);
    
    // Conversation'a yönlendir
    navigate(`/directMessage/${conversationId}`);
  };

  // Gösterim için isimleri birleştir
  const displayName = participants.map((p) => p.userName).join(", ");

  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-3 px-2 py-2 rounded hover:bg-[#35363C] cursor-pointer "
    >
      <img
        src={userPhoto}
        alt="user"
        className="w-8 h-8 rounded-full"
      />
      <span className="text-gray-300 font-medium truncate">
        {displayName}
      </span>
    </div>
  );
}

export default DirectConversationItem;