import { useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";

import { AppContext } from "../../context/userProvider";
import type { SidebarNavItemProps } from "../../types/common";

function SidebarNavItem({ Icon, title, route }: SidebarNavItemProps) {
  const ctx = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();
  if (!ctx) return null;
  const { setTopSideTitle } = ctx;

  const url: boolean = location.pathname.includes(route);

  return (
    <div
      onClick={() => {
        navigate(route);
        setTopSideTitle({ Icon, title });
      }}
      className="flex flex-col items-center m-auto justify-center mt-2"
    >
      <button
        style={{
          backgroundColor: url
            ? route === "/friends"
              ? "#1C1C1E"
              : route === "/store"
                ? "#1C1C1E"
                : route === "/shop"
                  ? "#1C1C1E"
                  : ""
            : "",
        }}
        className={`flex gap-2 h-8 items-center bg-[#121214] rounded-xl w-[95%] pt-2 pb-2 hover:bg-[#1C1C1E] hover:cursor-pointer active:bg-[#2C2C30]
 `}
      >
        <Icon className="ml-4" />
        <p className="text-md font-semibold text-gray-400">{title}</p>
      </button>
    </div>
  );
}

export default SidebarNavItem;
