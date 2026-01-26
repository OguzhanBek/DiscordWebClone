import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";

import tuta from "../../assets/Tuta.png";
import { AppContext } from "../../context/userProvider";
import type { FriendType } from "../../types/friend";

type FindFriendsProps = {
  friendList?: FriendType[];
  setOpenFindFriends: React.Dispatch<React.SetStateAction<boolean>>;
};

function StartConversationPanel({
  friendList,
  setOpenFindFriends,
}: FindFriendsProps) {
  const ctx = useContext(AppContext);
  const navigate = useNavigate();

  const [input, setInput] = useState("");

  if (!ctx) return null;
  const { setDmFriendName, jwtToken, setJwtToken, setConversationList } = ctx;

  const createOrOpenDm = async (friendId: string[]) => {
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

      if (response.status === 401) {
        localStorage.removeItem("jwtToken");
        setJwtToken(null);
        navigate("/login");
        return;
      }

      if (!response.ok) {
        toast.error("Chat açılamadı");
        return;
      }

      const data = await response.json();

      // 🔹 friendName her zaman array olsun
      const friendNames = Array.isArray(data.friendName)
        ? data.friendName
        : [data.friendName];

      setDmFriendName(friendNames);

      // 🔹 ConversationList için entry’ler
      const newConversations = friendNames.map((name: string) => ({
        conversationId: data.conversationId,
        friendId: friendId,
        userName: name,
      }));

      setConversationList((prev) => {
        const current = prev || [];

        const firstOccurrenceIndex = current.findIndex(
          (c) => c.conversationId === data.conversationId,
        );

        if (firstOccurrenceIndex === -1) {
          return [...current, ...newConversations];
        }

        const withoutOld = current.filter(
          (c) => c.conversationId !== data.conversationId,
        );

        withoutOld.splice(firstOccurrenceIndex, 0, ...newConversations);
        return withoutOld;
      });

      navigate(`/directMessage/${data.conversationId}`);
    } catch (error) {
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

      <div className="discord-scrollbar bg-[#212125] h-full overflow-y-auto">
        {friendList
          ?.filter((f) =>
            f.userName.toLowerCase().includes(input.toLowerCase()),
          )
          .map((friend) => (
            <div
              key={friend.friendId}
              onClick={() => {
                createOrOpenDm([friend.friendId]);
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
export default StartConversationPanel;
