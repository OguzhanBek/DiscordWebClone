import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../../context/userProvider";

type DirectConversationItemProps = {
  conversationId: string;
  participants: Array<{ friendId: string; userName: string }>;
  userPhoto: string;
};

function DirectConversationItem({
  conversationId,
  participants,
  userPhoto,
}: DirectConversationItemProps) {
  const navigate = useNavigate();
  const ctx = useContext(AppContext);
  if (!ctx) return null;
  const { setDmFriendName } = ctx;

  // ✅ Katılımcı isimlerini birleştir
  const displayName = participants.map(p => p.userName).join(", ");

  const openConversation = () => {
    // ✅ Conversation zaten var, direkt aç
    navigate(`/directMessage/${conversationId}`);
    setDmFriendName(participants.map(p => p.userName));
  };

  return (
    <div
      onClick={openConversation}
      className="DİREKT-MESAJLAR relative flex flex-col items-center m-auto"
    >
      <button className="flex gap-2 h-8 items-center bg-[#121214] rounded-xl w-[95%] pt-6 pb-6 hover:bg-[#1C1C1E] hover:cursor-pointer active:bg-[#2C2C30] group hover:text-white">
        <img className="h-8 w-8 rounded-2xl ml-2" src={userPhoto} alt="" />
        <p className="text-md font-semibold text-gray-400 group-hover:text-white">
          {displayName}
        </p>
        <span className="absolute right-6 text-gray-400 group-hover:text-white group-hover:visible invisible">
          <IoMdClose className="text-gray-400 hover:text-white" />
        </span>
      </button>
    </div>
  );
}

export default DirectConversationItem;