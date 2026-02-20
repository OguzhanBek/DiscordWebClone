import { normalizePhotoUrl } from "../../helpers/helpers";
import type { DmParticipant } from "../../types/chat/conversation";

type MiniProfileCardProps = {
  handleOpen: (userId: string) => void;
  activeUserId: string | null;
  participant: DmParticipant;
  index: number;
  cardRef?: React.RefObject<HTMLDivElement | null>;
  isAnimating?: boolean;
  setShowUserDetails?: (value: boolean) => void;
  isParticipantOnline?: boolean;
};

export default function MiniProfileCard({
  handleOpen,
  activeUserId,
  participant,
  index,
  cardRef,
  isAnimating,
  setShowUserDetails,
  isParticipantOnline,
}: MiniProfileCardProps) {
  return (
    <div
      onClick={() => handleOpen(participant.userId)}
      key={index}
      className="flex relative items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#2e2f35] cursor-pointer transition-colors group"
    >
      {activeUserId === participant.userId && (
        <div
          onClick={(e) => e.stopPropagation()}
          ref={cardRef}
          className={`absolute -left-[270px] top-0 z-50 w-[260px] cursor-default rounded-lg bg-[#1e1f22] shadow-xl 
                      transition-all duration-200
                      ${isAnimating ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
        >
          {/* Banner */}
          <div className="h-20 bg-red-200 relative">
            <div className="absolute left-4 -bottom-8">
              <div className="relative w-16 h-16">
                {/* Avatar */}
                <div className="relative group/avatar  rounded-full ">
                  {" "}
                  <img
                    onClick={() =>
                      setShowUserDetails && setShowUserDetails(true)
                    }
                    src={normalizePhotoUrl(participant.profilePhoto)}
                    alt="avatar"
                    className="w-16 h-16 rounded-full object-cover border-4 border-[#1e1f22] cursor-pointer  transition-all"
                  />{" "}
                  <div className="absolute group-hover/avatar:inset-0 group-hover/avatar:bg-black/50 rounded-full cursor-pointer transition-all"></div>
                </div>

                {/* Online status */}
                <span
                  className={`absolute flex items-center justify-center bottom-0 right-0 w-4 h-4 rounded-full ${isParticipantOnline ? "bg-[#45A366] border-2 border-[#121214]" : "bg-[#77787F] border-2 border-[#121214]"}`}
                >
                  <span
                    className={`${isParticipantOnline ? "bg-[#45A366]" : "border-2 border-[#121214] bg-[#121214]"} w-1 h-1 rounded-full`}
                  />
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="pt-10 px-4 pb-4 space-y-2">
            <div>
              <h4 className="text-white font-semibold text-sm">
                {participant.userName}
              </h4>
              <p className="text-xs text-gray-400">
                @{participant.userName.toLowerCase()}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span
                className={
                  isParticipantOnline ? "text-green-400" : "text-gray-500"
                }
              >
                ●
              </span>
              {isParticipantOnline ? "Çevrimiçi" : "Çevrimdışı"}
            </div>

            <div className="text-xs text-gray-300 mt-2">
              What can I do? Sometimes
            </div>

            <input
              disabled
              placeholder={`@${participant.userName} kullanıcısına mesaj...`}
              className="w-full mt-3 px-3 py-2 text-xs rounded-md bg-[#2b2d31] text-gray-400 placeholder-gray-500 focus:outline-none"
            />
          </div>
        </div>
      )}

      <div className="relative shrink-0">
        <img
          src={normalizePhotoUrl(participant.profilePhoto)}
          alt={participant.userName}
          className={`w-9 h-9 rounded-full object-cover transition-all ${
            !isParticipantOnline
              ? "opacity-40 grayscale group-hover:opacity-100 group-hover:grayscale-0"
              : ""
          }`}
        />
        <div
          className={`absolute flex items-center justify-center -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ${
            isParticipantOnline
              ? "bg-[#45A366] border-2 border-[#121214]"
              : "bg-[#77787F] border-2 border-[#121214]"
          }`}
        >
          <div
            className={`${
              isParticipantOnline
                ? "bg-[#45A366]"
                : "border-2 border-[#121214] bg-[#121214]"
            } w-1 h-1 rounded-full`}
          />
        </div>
      </div>

      <span
        className={`text-sm font-medium transition-colors truncate ${
          isParticipantOnline
            ? "text-gray-300 group-hover:text-white"
            : "text-gray-600 group-hover:text-gray-500"
        }`}
      >
        {participant.userName}
      </span>
    </div>
  );
}
