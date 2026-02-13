import { useContext } from "react";
import { AppContext } from "../../../context/userProvider";
import { useLocation } from "react-router-dom";
import Friend from "../../../assets/svg/Screenshot_1 (1).svg";
function TopSide() {
  const ctx = useContext(AppContext);
  if (!ctx) return null;
  const location = useLocation();
  const { topSideTitle } = ctx;

  const renderIcon = () => {
    if (location.pathname === "/") {
      return <img src={Friend} alt="icon" className="w-5 h-5" />;
    }

    const { Icon } = topSideTitle;

    if (typeof Icon === "string") {
      return <img src={Icon} alt="icon" className="w-5 h-5" />;
    }

    if (Icon) {
      const IconComponent = Icon;
      return <IconComponent className="text-[#AAAAB1]" />;
    }

    return null;
  };

  return (
    <div className="w-full h-8 flex justify-center select-none items-center gap-1 text-center text-amber-50 bg-[#121214]">
      {renderIcon()}
      <p className="text-sm font-semibold">
        {location.pathname === "/" ? "Arkadaşlar" : topSideTitle.title}
      </p>
    </div>
  );
}

export default TopSide;
