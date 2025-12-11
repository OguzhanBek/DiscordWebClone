import { useContext } from "react";
import { AppContext } from "../../../context/userProvider";
import { useLocation } from "react-router-dom";
import { FaUserFriends } from "react-icons/fa";
function TopSide() {
  const ctx = useContext(AppContext);
  if (!ctx) return null;
  const location = useLocation();
  const { topSideTitle } = ctx;

  return (
    <div className="w-full h-8! flex justify-center select-none items-center gap-1 text-center text-amber-50 bg-[#121214]">
      {location.pathname === "/" ? (
        <FaUserFriends className="text-gray-400" />
      ) : (
        <topSideTitle.Icon className="text-[#AAAAB1]" />
      )}
      <p className="text-sm font-semibold">
        {location.pathname === "/" ? "Arkadaşlar" : topSideTitle.title}
      </p>
    </div>
  );
}

export default TopSide;
