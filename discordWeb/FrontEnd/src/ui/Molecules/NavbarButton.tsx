import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/userProvider";
import {
  getFriendList,
  getFriendRequests,
  UnauthorizedError,
} from "../../helpers/helpers";
import { useNavigate } from "react-router-dom";

function NavbarButton({ buttonText }: { buttonText: string }) {
  const navigate = useNavigate();
  const [friendRequestLength, setFriendRequestLength] = useState<number>(0);
  const ctx = useContext(AppContext);
  if (!ctx) return null;
  const {
    jwtToken,
    setJwtToken,
    selectedNavbarButton,
    setSelectedNavbarButton,
    friendRequests,
    setFriendRequests,
    setFriendList,
  } = ctx;

  const handleGetFriendList = async () => {
    try {
      const list = await getFriendList(jwtToken);
      setFriendList(list);
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        localStorage.removeItem("jwtToken");
        setJwtToken(null);
        navigate("/login");
      }
    }
  };

  const handleGetFriendRequests = async () => {
    try {
      const requests = await getFriendRequests(jwtToken);
      setFriendRequests(requests);
    } catch (error: any) {
      if (error instanceof UnauthorizedError) {
        localStorage.removeItem("jwtToken");
        setJwtToken(null);
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    if (!friendRequests) {
      setFriendRequestLength(0);
      return;
    }

    const count = friendRequests.filter((req) => !req.isSentByMe).length;
    setFriendRequestLength(count);
  }, [friendRequests]);

  useEffect(() => {
    const handleGetFriendRequests = async () => {
      try {
        const requests = await getFriendRequests(jwtToken);
        setFriendRequests(requests);
      } catch (error: any) {
        if (error instanceof UnauthorizedError) {
          localStorage.removeItem("jwtToken");
          setJwtToken(null);
          navigate("/login");
        }
      }
    };
    handleGetFriendRequests();
  }, []);

  return (
    <button
      onClick={() => {
        setSelectedNavbarButton(buttonText.toLowerCase().trim());
        if (buttonText.toLowerCase().trim() === "bekleyen") {
          handleGetFriendRequests();
        }
        if (buttonText.toLowerCase().trim() === "tümü") {
          handleGetFriendList();
        }
      }}
      className={`relative px-3 py-1.5 rounded-lg text-sm text-gray-300 whitespace-nowrap
    ${
      buttonText.toLowerCase().trim() === "arkadaş ekle"
        ? "bg-[#4654C0] cursor-pointer transition-all font-medium hover:bg-[#4343e9]"
        : "transition-all cursor-pointer hover:text-white hover:bg-[#232327] active:bg-[#404044]"
    } ${
        selectedNavbarButton == buttonText.toLowerCase().trim() &&
        buttonText.toLowerCase().trim() !== "arkadaş ekle" &&
        "text-white bg-[#404044]"
      }
      ${
        selectedNavbarButton == buttonText.toLowerCase().trim() &&
        buttonText.toLowerCase().trim() !== "arkadaş ekle" &&
        "cursor-default! bg-[#404044]! "
      }
      ${
        selectedNavbarButton.toLowerCase().trim() === "arkadaş ekle"
          ? buttonText.toLowerCase().trim() == "arkadaş ekle" &&
            "bg-[#232540] text-[#7A80CA]! hover:bg-[#232540] cursor-default!"
          : ""
      }`}
    >
      {buttonText}

      {/* Bekleyen butonu için bildirim sayacı */}
      {buttonText.toLowerCase().trim() === "bekleyen" &&
        friendRequestLength > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1.5">
            {friendRequestLength}
          </span>
        )}
    </button>
  );
}

export default NavbarButton;
