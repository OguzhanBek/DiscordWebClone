import { useContext, useState } from "react";
import { IoClose, IoSearchOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { AppContext } from "../../context/userProvider";
import { normalizePhotoUrl } from "../../helpers/helpers";

function CreateDMModal() {
  const ctx = useContext(AppContext);
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  if (!ctx) return null;
  const {
    setOpenCreateDmModal,
    friendList,
    jwtToken,
    setJwtToken,
    setDmParticipants,
    setConversationList,
  } = ctx;

  function toggleUser(id: string) {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  const createOrOpenDm = async (friendIds: string[]) => {
    if (!jwtToken) {
      toast.error("Oturum süreniz dolmuş.");
      navigate("/login");
      return;
    }

    if (friendIds.length === 0) {
      toast.error("En az bir arkadaş seçmelisiniz.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5200/api/chat/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ friendId: friendIds }),
      });

      if (response.status === 401) {
        localStorage.removeItem("jwtToken");
        setJwtToken(null);
        navigate("/login");
        return;
      }

      if (!response.ok) {
        toast.error("Chat açılamadı");
        return;
      }

      const data = await response.json();

      // Seçilen arkadaşların bilgilerini al
      const selectedFriends = friendList?.filter((f) =>
        friendIds.includes(f.friendId),
      );

      if (selectedFriends && selectedFriends.length > 0) {
        // Participant bilgilerini kaydet
        const participants = selectedFriends.map((friend) => ({
          userId: friend.friendId,
          userName: friend.userName,
          profilePhoto: friend.profilePhoto,
        }));

        setDmParticipants(participants);

        // ConversationList'e ekle
        setConversationList((prev) => {
          const current = prev || [];

          const firstOccurrenceIndex = current.findIndex(
            (c) => c.conversationId === data.conversationId,
          );

          // Her arkadaş için bir entry oluştur
          const newConversations = selectedFriends.map((friend) => ({
            conversationId: data.conversationId,
            friendId: friend.friendId,
            userName: friend.userName,
            profilePhoto: friend.profilePhoto,
          }));

          if (firstOccurrenceIndex === -1) {
            return [...current, ...newConversations];
          }

          const withoutOld = current.filter(
            (c) => c.conversationId !== data.conversationId,
          );

          withoutOld.splice(firstOccurrenceIndex, 0, ...newConversations);
          return withoutOld;
        });
      }

      navigate(`/directMessage/${data.conversationId}`);
    } catch (error) {
      console.error("DM oluşturma hatası:", error);
      toast.error("Bir hata oluştu");
    }
  };



  return (
    <div
      onClick={() => setOpenCreateDmModal(false)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    >
      {/* MODAL */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[440px] h-150 rounded-xl bg-[#242429] text-white shadow-xl"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#3f4147]">
          <div>
            <h2 className="text-lg text-left font-semibold">Arkadaşları Seç</h2>
            <p className="text-sm text-gray-400">
              {10 - selectedUsers.length} arkadaş daha ekleyebilirsin.
            </p>
          </div>
          <IoClose
            onClick={() => setOpenCreateDmModal(false)}
            className="text-xl text-gray-400 cursor-pointer hover:text-white"
          />
        </div>

        {/* SEARCH */}
        <div className="px-4 py-3">
          <div className="flex items-center bg-[#1e1f22] rounded-md px-2">
            <IoSearchOutline className="text-gray-400" />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Bir arkadaşının kullanıcı adını yaz"
              className="w-full bg-transparent px-2 py-2 outline-none text-sm"
            />
          </div>
        </div>

        {/* FRIEND LIST */}
        <div className="discord-scrollbar h-[460px] overflow-y-auto px-2 text-left">
          {friendList
            ?.filter((f) =>
              f.userName.toLowerCase().includes(input.toLowerCase()),
            )
            .map((friend) => {
              const isSelected = selectedUsers.includes(friend.friendId);

              return (
                <div
                  key={friend.friendId}
                  onClick={() => toggleUser(friend.friendId)}
                  className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer
                    ${isSelected ? "bg-[#3f4147]" : "hover:bg-[#2b2d31]"}`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={normalizePhotoUrl(friend.profilePhoto)}
                      className="w-8 h-8 rounded-full"
                      alt={friend.userName}
                    />
                    <div>
                      <p className="text-sm font-medium">{friend.userName}</p>
                      <p className="text-xs text-gray-400">tag</p>
                    </div>
                  </div>

                  {/* CHECKBOX */}
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center
                      ${
                        isSelected
                          ? "bg-[#5865F2] border-[#5865F2]"
                          : "border-gray-500"
                      }`}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 bg-white rounded-sm" />
                    )}
                  </div>
                </div>
              );
            })}
        </div>

        {/* FOOTER */}
        <div className="flex justify-center items-center gap-3 px-4 py-4 border-t bg-[#242429] border-[#3f4147]">
          <button
            onClick={() => setOpenCreateDmModal(false)}
            className="w-full px-5 py-2.5 text-sm rounded-md cursor-pointer
      bg-[#303036] hover:bg-[#36363C] transition-colors"
          >
            İptal
          </button>

          <button
            onClick={() => {
              createOrOpenDm(selectedUsers);
              setOpenCreateDmModal(false);
            }}
            disabled={selectedUsers.length === 0}
            className={`w-full disabled:cursor-not-allowed px-5 py-2.5 text-sm rounded-md bg-[#4654C0] cursor-pointer transition-all font-medium 
              ${
                selectedUsers.length === 0
                  ? "opacity-50 "
                  : "hover:bg-[#4343e9]"
              }`}
          >
            DM Oluştur
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateDMModal;