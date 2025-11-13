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
    <div className="ARKADAŞLAR ">
      {}

      <button className="relative border-t border-[#31313b] hover:border-transparent flex rounded-md gap-2 h-8 transition-all items-center    bg-[#1A1A1E]  w-full pt-6 pb-6 hover:bg-[#353538] hover:cursor-pointer active:bg-[#2C2C30] group hover:text-white ">
        <img className="h-8 w-8 rounded-2xl ml-4" src={userPhoto} alt="" />
        <div className=" flex flex-col items-start">
          <p className="text-md font-semibold text-white ">{userName}</p>
          <span className="text-xs text-gray-400 ">{onlineStatus}</span>
        </div>
        <span className="absolute group flex gap-2 right-6 text-gray-400 group-hover:text-white  ">
          <IoChatbubble
            size={40}
            className="text-gray-400 hover:text-white group-hover:bg-[#19191D] rounded-[50%] p-2 before:content['aaaaaaa']  before:absolute before:left-[-22px] before:top-1/2 before:-translate-y-1/2 
      before:transition-all "
          />
          <BsThreeDotsVertical
            size={40}
            className="group-hover:bg-[#19191D] rounded-[50%] p-2"
          />
        </span>
      </button>
    </div>
  );
}

export default FriendsButton;
