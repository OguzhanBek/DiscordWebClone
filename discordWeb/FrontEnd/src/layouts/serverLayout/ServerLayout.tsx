
import { Outlet } from "react-router-dom";
import Sidebar from "../../ui/Organisms/Sidebar";
import Rightbar from "../../ui/Organisms/Rightbar";

function ServerLayout() {
  

  return (
    <div className="text-white flex h-full border-t-1 border-l-1 rounded-xl border-[#212124] select-none ">
      {/* Sidebar genişliği state'ten geliyor */}
     
        <Sidebar />

        {/* Drag handle */}


      {/* İçerik kısmı */}
      <div className="Outlet-container flex flex-1 h-[calc(100vh-32px)]">
        <div className="flex flex-col flex-1 bg-[#1A1A1E]">
          <Outlet />
        </div>
        <Rightbar />
      </div>
    </div>
  );
}

export default ServerLayout;
