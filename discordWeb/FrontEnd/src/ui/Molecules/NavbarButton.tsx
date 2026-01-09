import { useContext, useEffect } from "react";
import { AppContext } from "../../context/userProvider";

function NavbarButton({ buttonText }: { buttonText: string }) {
  const ctx = useContext(AppContext);
  if (!ctx) return null;
  const {
    selectedNavbarButton,
    setSelectedNavbarButton,
    getFriendList,
    friendRequests, 
    getFriendRequests
  } = ctx;

  useEffect(() => {
    getFriendRequests();
  }, []); 


  return (
    <button
      onClick={() => {
        setSelectedNavbarButton(buttonText.toLowerCase().trim());
        if (buttonText.toLowerCase().trim() === "bekleyen") getFriendRequests();
        if (buttonText.toLowerCase().trim() === "tümü") getFriendList();
      }}
      className={`relative p-2 rounded-xl text-gray-300 ${
        buttonText.toLowerCase().trim() === "arkadaş ekle"
          ? "bg-[#4654C0] cursor-pointer transition-all font-semibold hover:bg-[#4343e9]"
          : "transition-all cursor-pointer focus:bg-[#404044] hover:text-white hover:bg-[#232327] active:bg-[#404044]"
      } ${
        selectedNavbarButton == buttonText.toLowerCase().trim() &&
        buttonText.toLowerCase().trim() !== "arkadaş ekle" &&
        "text-white bg-[#404044]"
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
      {buttonText.toLowerCase().trim() === "bekleyen" && friendRequests?.length > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1.5">
          {friendRequests?.length }
        </span>
      )}
    </button>
  );
}

export default NavbarButton;