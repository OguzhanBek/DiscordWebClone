import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";

export type changePasswordProps = {
  isOpen: boolean;
  onClose: () => void;
  currentPassword: string;
  onSave: (newPassword: string) => void;
};

function ChangePassword({
  isOpen,
  onClose,
  currentPassword,
  onSave,
}: changePasswordProps) {
  const [currentPasswordInput, setCurrentPasswordInput] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  const [isAnimating, setIsAnimating] = useState(false);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };
  const isFormValid =
    !!currentPasswordInput && !!newPassword && !!newPasswordConfirm;
  const handleSave = () => {
    if (!currentPasswordInput || !newPassword || !newPasswordConfirm) return;

    if (newPassword !== newPasswordConfirm) {
      alert("Yeni şifreler uyuşmuyor");
      return;
    }

    onSave(newPassword);
    handleClose();
  };
  useEffect(() => {
    if (isOpen) {
      setCurrentPasswordInput("");
      setNewPassword("");
      setNewPasswordConfirm("");
      setIsAnimating(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={`fixed inset-0 bg-black/50 z-100 flex items-center justify-center transition-opacity duration-200 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-[#242429] rounded-lg w-[440px] p-0 relative transition-all duration-200 ${
          isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 relative">
          <h2 className="text-white text-xl font-semibold text-center">
            Şifreyi Güncelle
          </h2>
          <p className="text-gray-400 text-sm text-center mt-2">
            Mevcut Şifreni ve yeni şifreni gir
          </p>
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Form */}
        <form autoComplete="off" className="px-4 pb-4 space-y-4">
          <input
            type="email"
            name="email"
            autoComplete="email"
            style={{
              position: "absolute",
              opacity: 0,
              height: 0,
              pointerEvents: "none",
            }}
          />

          <input
            type="password"
            name="password"
            autoComplete="current-password"
            style={{
              position: "absolute",
              opacity: 0,
              height: 0,
              pointerEvents: "none",
            }}
          />
          <div>
            <label
              htmlFor="CurrentPassword"
              className="block text-gray-300 text-xs font-semibold uppercase mb-2"
            >
              Mevcut Şifren
            </label>
            <input
              type="password"
              name="cp-field"
              autoComplete="new-password"
              value={currentPasswordInput}
              onChange={(e) => setCurrentPasswordInput(e.target.value)}
              className="w-full bg-[#1E1F22] text-white px-3 py-2.5 rounded outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="block text-gray-300 text-xs font-semibold uppercase mb-2"
            >
              Yeni Şifre
            </label>
            <input
              type="password"
              name="np-field"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-[#1E1F22] text-white px-3 py-2.5 rounded outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="newPasswordApprove"
              className="block text-gray-300 text-xs font-semibold uppercase mb-2"
            >
              Yeni Şifreyi Onayla
            </label>
            <input
              type="password"
              name="npc-field"
              autoComplete="new-password"
              value={newPasswordConfirm}
              onChange={(e) => setNewPasswordConfirm(e.target.value)}
              className="w-full bg-[#1E1F22] text-white px-3 py-2.5 rounded outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </form>

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
            disabled={!isFormValid}
            className={`px-6 py-2 rounded text-sm font-medium transition-colors ${
              isFormValid
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

export default ChangePassword;
