import { useContext, useState } from "react";
import tuta from "../../assets/Tuta.png";
import type { FriendType } from "../../types/types";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/userProvider";
import { toast } from "react-toastify";

type FindFriendsProps = {
  friendList?: FriendType[];
  setOpenFindFriends: React.Dispatch<React.SetStateAction<boolean>>;
};

function FindFriends({ friendList, setOpenFindFriends }: FindFriendsProps) {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const ctx = useContext(AppContext);
  if (!ctx) return null;
  const { setDmFriendName, jwtToken } = ctx;

  const createOrOpenChat = async (friendId: string) => {
    if (!jwtToken) {
      toast.error("Oturum süreniz dolmuş.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:5200/api/chat/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ friendId }),
      });

      if (!response.ok) {
        toast.error("Chat açılamadı");
        return;
      }

      const data = await response.json();
      navigate(`/directMessage/${data.conversationId}`);
      setDmFriendName(data.friendName);
    } catch {
      toast.error("Bir hata oluştu");
    }
  };

  return (
    <>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        type="text"
        placeholder="Nereye Gitmek İstersin"
        className="border-[#39393d] bg-[#212125] text-white text-xl m-auto outline-none border rounded-2xl w-full mt-4 mb-4 py-5 px-4"
      />

      <span className="text-xs">ÖNCEKİ KANALLAR</span>

      <div className="bg-[#212125] h-40 overflow-y-auto">
        {friendList
          ?.filter((f) =>
            f.userName.toLowerCase().includes(input.toLowerCase())
          )
          .map((friend) => (
            <div
              key={friend.friendId}
              onClick={() => {
                createOrOpenChat(friend.friendId);
                setOpenFindFriends(false);
              }} 
              className="px-2 flex items-center gap-2 hover:bg-[#2f2f3a] cursor-pointer py-2"
            >
              <img className="h-6 w-6 rounded-2xl" src={tuta} />
              <span>{friend.userName}</span>
            </div>
          ))}
      </div>
    </>
  );
}

export default FindFriends;
