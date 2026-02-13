import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/userProvider";
import { createPortal } from "react-dom";

type LogoutProps = {
  isLogout: boolean;
  setIsLogout: React.Dispatch<React.SetStateAction<boolean>>;
};

function Logout({ isLogout, setIsLogout }: LogoutProps) {
  const context = useContext(AppContext);

  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isLogout) {
      setIsAnimating(true);
    }
  }, [isLogout]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsLogout(false);
    }, 200);
  };

  return createPortal(
    <>
      <div
        onClick={handleClose}
        className={`${isAnimating ? "opacity-100" : "  opacity-0"} transition-opacity duration-200 fixed inset-0 z-50 bg-black/60`}
      />
      <div
        onClick={(e) => e.stopPropagation()}
        className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-100 bg-[#242429] p-6 rounded-xl text-white select-none transform transition-all duration-200 z-50 ${isAnimating ? "scale-100 opacity-100" : "scale-90 opacity-0"}
  `}
      >
        <h1 className="text-xl mb-2">Çıkış yap</h1>
        <p className="mb-4 text-[#87878d]">
          Çıkış yapmak istediğinize emin misiniz?
        </p>

        <div className="flex justify-center gap-3">
          <button
            onClick={handleClose}
            className="w-40 h-10 bg-[#2b2b30] hover:bg-[#36363C] rounded cursor-pointer"
          >
            İptal
          </button>
          <button
            onClick={context?.logout}
            className="w-40 h-10 bg-red-600 hover:bg-red-700 rounded cursor-pointer transition-opacity duration-200"
          >
            Çıkış yap
          </button>
        </div>
      </div>
    </>,
    document.body,
  );
}
export default Logout;
