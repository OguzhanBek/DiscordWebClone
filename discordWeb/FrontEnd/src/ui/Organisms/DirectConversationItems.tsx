import { useContext, useEffect } from "react";
import { AppContext } from "../../context/userProvider";
import DirectConversationItem from "../Molecules/DirectConversationItem";
import tuta from "../../assets/Tuta.png";

function DirectConversationItems() {
  const ctx = useContext(AppContext);
  if (!ctx) return null;

  const { friendList, getFriendList } = ctx;
  useEffect(() => {
    getFriendList();
  }, []);

  return (
    <div className="mt-2">
      {friendList?.map(({ userName, friendId }, index) => (
        <DirectConversationItem
          key={index}
          userName={userName}
          userPhoto={tuta}
          friendId={friendId}
        />
      ))}
    </div>
  );
}

export default DirectConversationItems;
