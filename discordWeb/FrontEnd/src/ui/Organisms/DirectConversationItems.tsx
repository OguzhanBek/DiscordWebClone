import { useContext, useEffect } from "react";
import { AppContext } from "../../context/userProvider";
import DirectConversationItem from "../Molecules/DirectConversationItem";
import tuta from "../../assets/Tuta.png";
import { getFriendList, UnauthorizedError } from "../../helpers/helpers";
import { useNavigate } from "react-router-dom";

function DirectConversationItems() {
  const ctx = useContext(AppContext);
  if (!ctx) return null;
  const navigate = useNavigate();
  const { friendList, jwtToken, setJwtToken, setFriendList } = ctx;
  useEffect(() => {
    const handleGetFriendList = async () => {
      if (!jwtToken) return;

      try {
        const list = await getFriendList(jwtToken);
        setFriendList(list);
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
