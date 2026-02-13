import { useState, useEffect, useContext } from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";
import { SignalRContext } from "../../context/signalRContext";
import { AppContext } from "../../context/userProvider";

type EditUserNameProps = {
  isOpen: boolean;
  onClose: () => void;
  currentUsername: string;
  setCurrentUsername: React.Dispatch<React.SetStateAction<string>>;
};

function EditUsername({
  isOpen,
  onClose,
  currentUsername,
  setCurrentUsername,
}: EditUserNameProps) {
  const [username, setUsername] = useState(currentUsername || "oguzhan2000");
  const [password, setPassword] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  const signalctx = useContext(SignalRContext);
  const ctx = useContext(AppContext);
  if (!signalctx) {
    return null;
  }
  if (!ctx) {
    return null;
  }
  const { editConnection } = signalctx;
  const { setUserInfo } = ctx;

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!editConnection) return;

    const handleUpdateSuccess = (newUsername: string) => {
      setCurrentUsername(newUsername);
      setUserInfo((prev) =>
        prev ? { ...prev, user_name: newUsername } : prev,
      );
      handleClose();
    };

    const handleUpdateError = (error: string) => {
      console.error("Güncelleme hatası:", error);
      alert(error);
    };

    editConnection.on("UpdateSuccess", handleUpdateSuccess);
    editConnection.on("UpdateError", handleUpdateError);

    return () => {
      editConnection.off("UpdateSuccess", handleUpdateSuccess);
      editConnection.off("UpdateError", handleUpdateError);
    };
  }, [editConnection]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleSave = async () => {
    if (username && password) {
      try {
        await editConnection?.invoke("UpdateUsername", username, password);
      } catch (err) {
        console.error("İsim değiştirme sırasında hata oluştu:", err);
        alert("İsim değiştirme sırasında hata oluştu.");
      }
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className={`fixed inset-0 bg-black/50 z-100 flex items-center justify-center transition-opacity duration-200 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-[#313338] rounded-lg w-[440px] p-0 relative transition-all duration-200 ${
          isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 relative">
          <h2 className="text-white text-xl font-semibold text-center">
            Kullanıcı adını değiştir
          </h2>
          <p className="text-gray-400 text-sm text-center mt-2">
            Yeni bir kullanıcı adı ve mevcut şifreni gir.
          </p>
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Form */}
        <div className="px-4 pb-4 space-y-4">
          {/* Kullanıcı Adı */}
          <div>
            <label className="block text-gray-300 text-xs font-semibold uppercase mb-2">
              Kullanıcı Adı
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#1E1F22] text-white px-3 py-2.5 rounded outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Kullanıcı adını gir"
            />
            <p className="text-gray-400 text-xs mt-2">
              Lütfen yalnızca sayı, harf çizgi _, veya nokta kullan.
            </p>
          </div>

          {/* Mevcut Şifren */}
          <div>
            <label className="block text-gray-300 text-xs font-semibold uppercase mb-2">
              Mevcut Şifren
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1E1F22] text-white px-3 py-2.5 rounded outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Şifreni gir"
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="bg-[#2B2D31] px-4 py-4 flex justify-end gap-3 rounded-b-lg">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-white hover:underline transition-colors text-sm"
          >
            İptal
          </button>
          <button
            onClick={handleSave}
            disabled={!username || !password}
            className={`px-6 py-2 rounded text-sm font-medium transition-colors ${
              username && password
                ? "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                : "bg-blue-500/50 text-white/50 cursor-not-allowed"
            }`}
          >
            Bitti
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default EditUsername;
