import React from "react";
import { grayBackground } from "../../Colors";


type IconWithHoverTextProps = {
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  tooltipText?: string;
};

function IconWithUpSideHoverText({
  Icon,
  tooltipText,
}: IconWithHoverTextProps) {
  return (
    <span className="IconWithUpSideHoverText  gap-1">
      <span className="relative group/item">
        <span className="hover:cursor-pointer text-lg">
          <Icon size={20} className="hover:text-gray-200 cursor-pointer" />
        </span>

        {/* Tooltip */}
        {tooltipText ? (
          <span
            style={{ backgroundColor: grayBackground }}
            className="absolute left-1/2 -translate-x-1/2 bottom-[130%] opacity-0 group-hover/item:opacity-100 transition-opacity text-white px-3 py-2 rounded-md text-sm pointer-events-none z-10 whitespace-normal min-w-[250px]"
          >
            {tooltipText}
          </span>
        ) : null}
      </span>
    </span>
  );
}

export default IconWithUpSideHoverText;
