import { useContext, useEffect, useMemo } from "react";
import { AppContext } from "../../context/userProvider";
import DirectConversationItem from "../Molecules/DirectConversationItem";
import tuta from "../../assets/Tuta.png";
import {
  getConversationList,
  getFriendList,
  UnauthorizedError,
} from "../../helpers/helpers";
import { useNavigate } from "react-router-dom";

function DirectConversationItems() {
  const ctx = useContext(AppContext);
  if (!ctx) return null;
  const navigate = useNavigate();
  const {
    jwtToken,
    setJwtToken,
    conversationList,
    setConversationList,
    setFriendList,
  } = ctx;

  useEffect(() => {
    const handleGetFriendList = async () => {
      if (!jwtToken) return;

      try {
        const list = await getConversationList(jwtToken);
        const friendList = await getFriendList(jwtToken);
        setConversationList(list);
        setFriendList(friendList);
      } catch (err) {
        if (err instanceof UnauthorizedError) {
          localStorage.removeItem("jwtToken");
          setJwtToken(null);
          navigate("/login");
        }
      }
    };
    handleGetFriendList();
  }, []);

  // ✅ Conversation'ları conversationId'ye göre grupla
  const groupedConversations = useMemo(() => {
    if (!conversationList) return [];

    const grouped = conversationList.reduce(
      (acc, item) => {
        const existing = acc.find(
          (c) => c.conversationId === item.conversationId,
        );

        if (existing) {
          // Aynı conversation'a ait başka bir kullanıcı, ekle
          existing.participants.push({
            friendId: item.friendId,
            userName: item.userName,
          });
        } else {
          // Yeni conversation
          acc.push({
            conversationId: item.conversationId,
            participants: [
              {
                friendId: item.friendId,
                userName: item.userName,
              },
            ],
          });
        }

        return acc;
      },
      [] as Array<{
        conversationId: string;
        participants: Array<{ friendId: string; userName: string }>;
      }>,
    );

    return grouped;
  }, [conversationList]);

  console.log("grouped conversations:", groupedConversations);

  return (
    <div className="mt-2">
      {groupedConversations?.map(({ conversationId, participants }) => (
        <DirectConversationItem
          key={conversationId}
          conversationId={conversationId}
          participants={participants}
          userPhoto={tuta}
        />
      ))}
    </div>
  );
}

export default DirectConversationItems;
