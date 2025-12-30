import { BsThreeDotsVertical } from "react-icons/bs";
import { IoChatbubble } from "react-icons/io5";


function FriendsButton({
  userPhoto,
  userName,
  onlineStatus,
}: {
  userPhoto: string;
  userName: string;
  onlineStatus: string;
}) {
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
          <p className="text-md font-semibold text-white">{userName}</p>
          <span className="text-xs  text-gray-400">{onlineStatus}</span>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-2 group text-gray-400  ">
        <div className="relative group/icon">
          <IoChatbubble
            size={40}
            className="group-hover:bg-[#19191D] hover:text-white rounded-full p-2 transition"
          />

          <span
            className="absolute left-1/2 -translate-x-1/2 -translate-y-full top-0
               p-2  text-white text-xs  rounded opacity-0
               group-hover/icon:opacity-100 transition-opacity whitespace-nowrap pointer-events-none bg-[#36363b]"
          >
            Mesaj gönder
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-400  ">
          <div className="relative group/icon">
            <BsThreeDotsVertical
              size={40}
              className="group-hover:bg-[#19191D] hover:text-white rounded-full p-2 transition"
            />
            <span
              className="absolute left-1/2 -translate-x-1/2  bg-[#36363b] -translate-y-full top-0
                text-white text-xs p-2  rounded opacity-0
               group-hover/icon:opacity-100 transition-opacity whitespace-nowrap pointer-events-none"
            >
              Daha fazla
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
export default FriendsButton;
