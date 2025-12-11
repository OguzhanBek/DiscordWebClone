import { FaDiscord } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function DiscordDefaultButton({
  activeServer,
  setActiveServer,
}: {
  activeServer?: number | null;
  setActiveServer?: React.Dispatch<React.SetStateAction<number | null>>;
}) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() =>{ setActiveServer?.(null); 
        navigate("/")
      }}
      className={`h-10 w-10 mb-2 relative rounded-xl  hover:bg-[#5764F1] focus:bg-[#5764F1] cursor-pointer flex items-center justify-center transition-all duration-200 server-item group mt-2   hover:cursor-pointer  select-none
      before:content-[''] before:absolute before:left-[-22px] before:top-1/2 before:-translate-y-1/2 
      before:transition-all before:w-0 before:h-0 
      hover:before:w-1.5 hover:before:h-5 before:bg-white before:rounded ${
        activeServer === null
          ? "before:h-8 before:w-1.5 hover:before:w-1.5 hover:before:h-8 bg-[#5764F1]"
          : "before:h-0 before:w-0 bg-[#202022]"
      }`}
    >
      <FaDiscord size={24} />
      <span
        className="
          absolute left-full whitespace-nowrap z-10 font-semibold text-sm top-1/2 -translate-y-1/2 bg-[#1A1A1E] text-white ml-2  px-2 py-1 rounded-md  invisible
           group-hover:visible before:content-[''] before:absolute before:left-[-4px] before:top-1/2 before:-translate-y-1/2 before:bg-[#1A1A1E] before:h-2 before:w-2 before:rotate-45 pointer-events-none
           
     "
      >
        {"Direkt Mesajlar"}
      </span>
      <hr className="absolute border-[#2d2d31] border-t w-8 top-12" />
    </div>
  );
}

export default DiscordDefaultButton;
