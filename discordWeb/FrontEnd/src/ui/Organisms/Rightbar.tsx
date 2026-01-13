import tuta from "../../assets/Tuta.png";
import ActiveGameBox from "../Molecules/ActiveGameBox";
import VoiceChannel from "../Molecules/VoiceChannel";
import SpotifyBox from "../Molecules/SpotifyBox";
import { rightBarColor } from "../../Colors";
import { useLocation } from "react-router-dom";
function Rightbar() {
  const location = useLocation();

  const home = location.pathname === "/";
  const friendsPage = location.pathname === "/friends";
  const directMessagePage = location.pathname === "/directMessage";

  return (
    <>
      {(home || friendsPage || directMessagePage) && (
        <div className={` xl:block  hidden bg-[${rightBarColor}]`}>
          <div className="w-[90%] m-auto mt-4">
            <p className="text-sm font-semibold mb-2 text-gray-300">
              Şimdi Aktif
            </p>

            {/* 1. Aktif oyun kutusu */}
            <ActiveGameBox src={tuta} />

            {/* Ses Kanalı kutusu */}
            <VoiceChannel src={tuta} />

            {/*  Spotify kutusu */}
            <SpotifyBox src={tuta} />
          </div>
        </div>
      )}
    </>
  );
}
export default Rightbar;
