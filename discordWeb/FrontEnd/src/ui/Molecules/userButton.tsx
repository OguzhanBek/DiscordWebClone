import { IoMdClose } from "react-icons/io";
import type { User } from "../../types/types";

function DirectMessageButton({ userName, userPhoto }: User) {
  return (
    <div className="SEÇENEKLER-VE-DİREKT-MESAJLAR relative flex flex-col items-center  m-auto justify-center mt-2  ">
      <button className="flex gap-2 h-8  items-center bg-[#121214] rounded-xl w-[95%] pt-6 pb-6 hover:bg-[#1C1C1E] hover:cursor-pointer active:bg-[#2C2C30] group hover:text-white">
        <img className="h-8 w-8 rounded-2xl ml-4" src={userPhoto} alt="" />
        <p className="text-md font-semibold text-gray-400 group-hover:text-white">
          {userName}
        </p>
        <span className="absolute  right-6 text-gray-400 group-hover:text-white group-hover:visible invisible">
          <IoMdClose className="text-gray-400 hover:text-white" />
        </span>
      </button>
    </div>
  );
}

export default DirectMessageButton;
