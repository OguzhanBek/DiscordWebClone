import { useContext, useState } from "react";
import { IoClose, IoSearchOutline } from "react-icons/io5";
import tuta from "../../assets/Tuta.png";
import { AppContext } from "../../context/userProvider";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function CreateDMModal() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const ctx = useContext(AppContext);
  if (!ctx) return null;
  const {
    setOpenCreateDmModal,
    friendList,
    jwtToken,
    setJwtToken,
    setDmFriendName,
  } = ctx;

  function toggleUser(id: string) {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }
  const createOrDm = async (friendId: string[]) => {
    if (!jwtToken) {
      toast.error("Oturum süreniz dolmuş.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:5200/api/chat/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ friendId }),
      });

      if (!response.ok) {
        toast.error("Chat açılamadı");
        return;
      }
      if (response.status === 401) {
        localStorage.removeItem("jwtToken");
        setJwtToken(null);
        navigate("/login");
        return;
      }
      const data = await response.json();
      navigate(`/directMessage/${data.conversationId}`);
      setDmFriendName([data.friendName]);
    } catch {
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
        <div className="scrollbar-discord h-[460px] overflow-y-auto px-2 text-left">
          {friendList
            ?.filter((f) =>
              f.userName.toLowerCase().includes(input.toLowerCase())
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
                    <img src={tuta} className="w-8 h-8 rounded-full" alt="" />
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
            onClick={() => createOrDm(selectedUsers)}
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
      {/* Discord Style Scrollbar CSS */}
      <style>{`
        .scrollbar-discord::-webkit-scrollbar {
          width: 8px;
        }
        
        .scrollbar-discord::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .scrollbar-discord::-webkit-scrollbar-thumb {
          background-color: #1a1b1e;
          border-radius: 4px;
        }
        
        .scrollbar-discord::-webkit-scrollbar-thumb:hover {
          background-color: #2e3035;
        }
        
        .scrollbar-discord {
          scrollbar-width: thin;
          scrollbar-color: #1a1b1e transparent;
        }
      `}</style>
    </div>
  );
}

export default CreateDMModal;
