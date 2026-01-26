import { FaSpotify } from "react-icons/fa";

type ServerListItemProps = {
  src: string;
};

function SpotifyBox({ src }: ServerListItemProps) {
  return (
    <div className="bg-[#2a2a2e] hover:bg-[#363434] transition-colors cursor-pointer border border-[#36363b] rounded-xl p-3 mb-3">
      <div className="flex gap-3 items-center mb-2">
        <img src={src} className="h-8 w-8 rounded-full" />
        <span className="text-sm font-semibold">Lucille</span>
        <FaSpotify className="ml-auto text-green-500" />
      </div>
      <div className="bg-[#1d1d20] rounded-lg p-2 text-xs">
        <span className="text-gray-400">Indigo Night</span>
        <br />
        <span className="text-gray-500 text-[11px]">Tamino</span>
      </div>
    </div>
  );
}

export default SpotifyBox;
