import { grayBackground } from "../../Colors";
import React from "react";

type NavbarActionIcon = {
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  tooltipText: string;
};

function NavbarActionIcon({
  Icon,
  tooltipText,
}: NavbarActionIcon) {
  return (
    <span className="NavbarActionIcon gap-1 shadow-xl ">
      <span className="relative group/item shadow-2xl shadow-xl/20">
        <span className="hover:cursor-pointer text-lg ">
          <Icon size={20} className="hover:text-gray-200 cursor-pointer " />
        </span>

        {/* Tooltip */}
        <span
          style={{ backgroundColor: grayBackground }}
          className="absolute left-1/2 -translate-x-1/2 top-[130%] hover:shadow-2xl shadow-[0_4px_10px_rgba(0,0,0,0.45)]  opacity-0 group-hover/item:opacity-100 transition-opacity text-white px-2 py-2 rounded-md text-sm pointer-events-none whitespace-nowrap z-10"
        >
          {tooltipText}
        </span>
      </span>
    </span>
  );
}

export default NavbarActionIcon;
