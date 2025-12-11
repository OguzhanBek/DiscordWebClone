import { grayBackground } from "../../Colors";
import type { DmOlusturBeforeContentProps } from "../../types/types";
{/* Bunun ismini de değiş. DMoluştur'a ait değil artık. Dinamik bir veriye hitap ediyor. */}
function DmOlusturBeforeContent({ items }: DmOlusturBeforeContentProps) {
  return (
    <span className="DM-Olustur-Before-Context  gap-1 hidden group- group-hover/channel:flex ">
      {items.map(({ content, tooltipText }, index) => (
        <span key={index} className="relative group/item  ">
          <span  className="hover:cursor-pointer hover:text-white text-lg text-gray-400 ">
            {content}
          </span>
          {/* Her item'ın kendi tooltip'i */}
          <span
            style={{ backgroundColor: grayBackground }}
            className="absolute left-1/2 -translate-x-1/2 bottom-[130%] opacity-0 group-hover/item:opacity-100 transition-opacity text-white px-2 py-2 rounded-md text-sm pointer-events-none whitespace-nowrap z-10"
          >
            {tooltipText}
          </span>
        </span>
      ))}
    </span>
  );
}

export default DmOlusturBeforeContent;
