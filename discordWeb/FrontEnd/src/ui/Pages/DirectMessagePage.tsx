import { useState } from "react";
import Navbar from "../Molecules/DirectMessagePageComponents/Navbar";
import MainContent from "../Molecules/DirectMessagePageComponents/MainContent";
import FriendInfo from "../Organisms/FriendInfo";

function DirectMessagePage() {
  const [isRightBarOpen, setIsRightBarOpen] = useState(()=> localStorage.getItem("rightbarOpen"));
 
  return (
    <div className="flex flex-col h-screen">
      <Navbar
        isRightBarOpen={isRightBarOpen}
        setIsRightBarOpen={setIsRightBarOpen}
      />
      <div className="flex flex-1 mt-12 overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <MainContent />
        </div>

        {isRightBarOpen === "true" && (
          <div className="w-86 border-l border-[#1C1C1E]  discord-scrollbar">
            <FriendInfo />
          </div>
        )}
      </div>
    </div>
  );
}
export default DirectMessagePage;
