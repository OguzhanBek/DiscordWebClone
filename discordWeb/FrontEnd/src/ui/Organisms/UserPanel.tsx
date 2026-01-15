// UserPanel.tsx
import { useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import tuta from "../../assets/Tuta.png";
import { FaMicrophone, FaHeadphones } from "react-icons/fa";
import { AppContext } from "../../context/userProvider";
import { IoIosSettings } from "react-icons/io";
import { fetchUser, UnauthorizedError } from "../../helpers/helpers";
import { useNavigate } from "react-router-dom";

function UserPanel() {
  const navigate = useNavigate();

  const [mounted, setMounted] = useState(false);
  const [root, setRoot] = useState<HTMLElement | null>(null);

  const ctx = useContext(AppContext);
  if (!ctx) {
    return null;
  }
  const { sidebarWidth, jwtToken, setJwtToken, setUserInfo, userInfo } = ctx;

  useEffect(() => {
    setMounted(true);
    setRoot(document.getElementById("root"));
  }, []);

  useEffect(() => {
    if (!jwtToken) return;

    const loadUser = async () => {
      try {
        const user = await fetchUser(jwtToken!);
        setUserInfo(user);
      } catch (error) {
        if (error instanceof UnauthorizedError) {
          localStorage.removeItem("jwtToken");
          setJwtToken(null);
          navigate("/login");
        }
      }
    };

    loadUser();
  }, [jwtToken]);

  if (!ctx || !mounted || !root) {
    return null;
  }
  console.log(" User info : ", userInfo);

  return createPortal(
    <div
      style={{ width: sidebarWidth + 60 }}
      className={`absolute text-white flex items-center justify-between ml-2 rounded-xl bottom-2 h-16 bg-[#202024]`}
    >
      {/* Sol kısım */}
      <div className="flex flex-1 mx-2 h-10 hover:bg-[#323238] cursor-pointer transition-all rounded-xl items-center">
        <img src={tuta} alt="tuta" className="w-8 rounded mx-2" />

        {/* Orta kısım */}
        <div className="username-and-description flex flex-col justify-center leading-tight text-left min-w-0 h-8">
          <h3 className="username text-sm truncate">{userInfo?.user_name}</h3>
          <span className="text-xs truncate">Açıklama</span>
        </div>
      </div>

      {/* Sağ kısım */}
      <div className="flex gap-2 mr-2">
        <div className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#3a3a3f] cursor-pointer transition">
          <FaMicrophone size={16} />
        </div>

        <div className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#3a3a3f] cursor-pointer transition">
          <FaHeadphones size={16} />
        </div>

        <div className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#3a3a3f] cursor-pointer transition">
          <IoIosSettings size={20} />
        </div>
      </div>
    </div>,
    root
  );
}

export default UserPanel;
