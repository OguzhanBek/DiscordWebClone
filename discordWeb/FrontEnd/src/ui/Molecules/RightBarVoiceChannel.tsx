import { FaHeadphonesAlt } from "react-icons/fa"

type VoiceChannelProps = {
  src: string;
}

function VoiceChannel( {src}: VoiceChannelProps) {
  return (
          <div className="bg-[#2a2a2e] hover:bg-[#363434] transition-colors cursor-pointer border border-[#36363b] rounded-xl p-3 mb-3">
          <div className="flex gap-3 items-center mb-2">
            <img src={src} className="h-8 w-8 rounded-full" />
            <span className="text-sm font-semibold">
              Mirket, memoRY ve 2 kişi daha
            </span>
          </div>
          <div className="bg-[#1d1d20] rounded-lg p-2 text-xs flex items-center gap-2">
            <FaHeadphonesAlt />
            <span className="text-gray-400">Bir Ses Kanalında</span>
          </div>
        </div>
  )
}

export default VoiceChannel