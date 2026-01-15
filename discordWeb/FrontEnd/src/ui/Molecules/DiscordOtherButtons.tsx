import type { DiscordOtherButton } from "../../types/types";

function DiscordOtherButtons({
  İcon,
  name,
}: DiscordOtherButton) {
  return (
    <div className="h-10 group w-10 mt-2 relative rounded-xl bg-[#202022] hover:bg-[#5764F1] focus:bg-[#5764F1] cursor-pointer flex items-center justify-center transition-all duration-200  ">
      <İcon size={24} />
      <span
        className={` absolute left-full z-10 font-semibold text-sm top-1/2 -translate-y-1/2 bg-[#1A1A1E] text-white ml-2  px-2 py-1 rounded-md  invisible whitespace-nowrap group-hover:visible before:content-[''] before:absolute before:-left-1 before:top-1/2 before:-translate-y-1/2 before:bg-[#1A1A1E] before:h-2 before:w-2 before:rotate-45 pointer-events-none`}
      >
        {name}
      </span>
    </div>
  );
}

export default DiscordOtherButtons;
