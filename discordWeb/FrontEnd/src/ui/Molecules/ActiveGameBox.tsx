import { FaGamepad } from "react-icons/fa";
function ActiveGameBox({ src }: { src: string }) {
  return (
    <div className="bg-[#2a2a2e] cursor-pointer hover:bg-[#363434] transition-colors border border-[#36363b] rounded-xl p-3 mb-3">
      <div className="flex gap-3 items-center mb-2">
        <img src={src} className="h-8 w-8 rounded-full" />
        <span className="text-sm font-semibold">
          Bora, GsFMeGaTRoN ve 1 kişi daha
        </span>
      </div>
      <div className="bg-[#1d1d20] rounded-lg p-2 text-xs flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <FaGamepad />
          <span className="text-gray-400">League of Legends – 12dk</span>
        </div>
        <span className="text-gray-500 text-[11px]">12:42 geçti</span>
      </div>
    </div>
  );
}
export default ActiveGameBox;