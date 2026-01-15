import { TiTickOutline } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";
import { useContext } from "react";
import { AppContext } from "../../context/userProvider";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getFriendList, UnauthorizedError } from "../../helpers/helpers";

function FriendRequest({
  userPhoto,
  otherPersonName,
  isSentByMe,
  requestId,
}: {
  userPhoto: string;
  otherPersonName: string;
  isSentByMe: boolean;
  requestId: number;
}) {
  const context = useContext(AppContext);
  if (!context) return null;
  const {
    jwtToken,
    setJwtToken,
    setFriendRequests,
    friendRequests,
    setFriendList,
  } = context;
  const navigate = useNavigate();
  const acceptFriendRequest = async () => {
    try {
      console.log("=== Accept Friend Request ===");
      console.log("JWT Token:", jwtToken);
      console.log("Username:", otherPersonName);

      const response = await fetch(
        "http://localhost:5200/api/friendrequest/accept",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({
            OtherPersonName: otherPersonName.trim(),
          }),
        }
      );

      console.log("Response status:", response.status);

      if (response.status === 401) {
        localStorage.removeItem("jwtToken");
        setJwtToken(null);
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);

        try {
          const errorJson = JSON.parse(errorText);
          toast.error(errorJson.message || errorJson);
        } catch {
          toast.error(errorText);
        }
        return;
      }

      const result = await response.text();
      console.log("Success response:", result);

      toast.success("Arkadaşlık isteği kabul edildi.");

      const updatedRequests = friendRequests.filter(
        (req: any) => req.requestId !== requestId
      );
      setFriendRequests(updatedRequests);

      // Arkadaş listesini yenile
      const friendList = await getFriendList(jwtToken);
      setFriendList(friendList);
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        localStorage.removeItem("jwtToken");
        setJwtToken(null);
        navigate("/login");
      }
      console.error("Fetch error:", err);
      toast.error("Sunucuya bağlanılamadı.");
    }
  };

  const rejectFriendRequest = async () => {
    try {
      const response = await fetch(
        "http://localhost:5200/api/friendrequest/reject",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({
            OtherPersonName: otherPersonName.trim(),
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.json();
        toast.error(errorText);
        return;
      }
      if (response.status === 401) {
        localStorage.removeItem("jwtToken");
        setJwtToken(null);
        navigate("/login");
        return;
      }
      const data = await response.text();
      toast.success(data);

      // State'ten bu isteği requestId ile kaldır
      const updatedRequests = friendRequests.filter(
        (req: any) => req.requestId !== requestId
      );
      setFriendRequests(updatedRequests);
    } catch (err) {
      console.error(err);
      toast.error("Sunucuya bağlanılamadı.");
    }
  };

  return (
    <button
      className="border-t group border-[#31313b] hover:border-transparent flex items-center justify-between
             rounded-md h-16 transition-all bg-[#1A1A1E] w-full px-4
             hover:bg-[#232327] hover:cursor-pointer active:bg-[#2C2C30] group"
    >
      {/* LEFT SIDE */}
      <div className="flex items-center gap-3">
        <img className="h-10 w-10 rounded-2xl" src={userPhoto} alt="" />

        <div className="flex flex-col items-start">
          <p className="text-md font-semibold text-white">{otherPersonName}</p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-2 group text-gray-400">
        {isSentByMe ? (
          " "
        ) : (
          <div
            onClick={() => {
              acceptFriendRequest();
            }}
            className="relative group/icon hover:text-green-500 cursor-pointer"
          >
            <TiTickOutline size={24} />
          </div>
        )}

        <div
          onClick={() => {
            rejectFriendRequest();
          }}
          className="relative group/icon hover:text-red-500 cursor-pointer"
        >
          <RxCross2 size={24} />
        </div>
      </div>
    </button>
  );
}

export default FriendRequest;
