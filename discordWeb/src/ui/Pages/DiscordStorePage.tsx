import React from "react";
import dcMagaza from "../../assets/discordmağazaimage.png";
import { Gamepad2 } from "lucide-react";

import DiscordStoreNavbar from "../../ui/Molecules/DiscordStorePageComponents/DiscordStoreNavbar";
import { useSearchParams } from "react-router-dom";

import TakeALookPage from "./TakeALookPage";

import OrbsPage from "./OrbsPage";
import Tutacard from "../Organisms/Tutacard";

const DiscordStorePage: React.FC = () => {
  let [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");

  return (
    <>
      <div className="Discord-Store-Page bg-[#1E1F22]  relative text-gray-200 font-sans overflow-y-auto custom-scrollbar">
        {/* Navbar */}
        <DiscordStoreNavbar />

        {tab === "orbs" ? (
          <OrbsPage />
        ) : tab === "catalog" ? (
          <TakeALookPage />
        ) : (
          <>
            {/* Öne Çıkanlar Sayfası */}
            <header
              className={`bg-[#1A1A1E]  mt-10 border-gray-600  flex items-center justify-between`}
            >
              <div
                style={{
                  backgroundImage: `
      linear-gradient(to bottom, rgba(26,26,30,0) 40%, rgba(26,26,30,1) 85%), 
      url(https://cdn.discordapp.com/assets/content/e51b486a1d5cc225f1bdd42744c472eeac5a08e50ac8f40215b4b229ae282e35.jpg)`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: "300px",
                  width: "100%",
                }}
                className="flex items-center justify-around"
              >
                <img src={dcMagaza} alt="" className="w-80 h-20" />
                <button className="bg-[#FFFFFF] whitespace-nowrap text-black  outline-none hover:bg-[#DFE0E2] cursor-pointer transition-all rounded-xl p-2">
                  Secret garden koleksiyonunu satın al
                </button>
              </div>
            </header>
            {/* Content Area */}
            <main className="p-6">
              <section className="mb-8 mx-auto w-[80%]">
                <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-y-20 gap-x-10 justify-items-center relative top-[-100px]">
                  <Tutacard />
                  <Tutacard />
                  <Tutacard />
                  <Tutacard />
                  <Tutacard />
                  <Tutacard />
                  <Tutacard />
                  <Tutacard />
                  <Tutacard />
                  <Tutacard />
                  <Tutacard />
                  <Tutacard />
                  <Tutacard />
                  <Tutacard />
                  <Tutacard />
                  <Tutacard />
                </div>
              </section>

              {/* Empty State */}
              <section className="text-center py-32 text-gray-500">
                <Gamepad2 className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                <h4 className="text-gray-400 text-xl font-semibold mb-2">
                  More games coming soon!
                </h4>
                <p className="text-sm max-w-md mx-auto leading-relaxed">
                  We're working hard to bring you more amazing games. Check back
                  later for new releases and updates.
                </p>
              </section>
            </main>
          </>
        )}

        {/* Header */}
      </div>
    </>
  );
};
export default DiscordStorePage;
