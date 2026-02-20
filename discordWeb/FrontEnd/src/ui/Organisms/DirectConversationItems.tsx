import { useContext, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { AppContext } from "../../context/userProvider";
import DirectConversationItem from "../Molecules/DirectConversationItem";
import {
  getConversationList,
  getFriendList,
  UnauthorizedError,
} from "../../helpers/helpers";

function DirectConversationItems() {
  const ctx = useContext(AppContext);
  if (!ctx) return null;
  const location = useLocation();
  const id = location.pathname.split("/").pop();
  console.log("aaa", id);
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

  const groupedConversations = useMemo(() => {
    if (!conversationList) return [];

    const grouped = conversationList.reduce(
      (acc, item) => {
        const existing = acc.find(
          (c) => c.conversationId === item.conversationId,
        );

        if (existing) {
          existing.participants.push({
            userId: item.friendId,
            userName: item.userName,
            profilePhoto: item.profilePhoto,
          });
        } else {
          acc.push({
            conversationId: item.conversationId,
            participants: [
              {
                userId: item.friendId,
                userName: item.userName,
                profilePhoto: item.profilePhoto,
              },
            ],
          });
        }

        return acc;
      },
      [] as Array<{
        conversationId: string;
        participants: Array<{
          userId: string;
          userName: string;
          profilePhoto?: string;
        }>;
      }>,
    );

    return grouped;
  }, [conversationList]);

  return (
    <div className="mt-2">
      {groupedConversations?.map(({ conversationId, participants }) => (
        <DirectConversationItem
          key={conversationId}
          conversationId={conversationId}
          participants={participants}
          profilePhoto={participants.map((tuta) => tuta.profilePhoto)}
          selectedDm={id}

        />
      ))}
    </div>
  );
}

export default DirectConversationItems;
