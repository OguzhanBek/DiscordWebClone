import { useContext } from "react";
import { AppContext } from "../../context/userProvider";
import { toast } from "react-toastify";

function NavbarButton({ buttonText }: { buttonText: string }) {
  const ctx = useContext(AppContext);
  if (!ctx) return null;
  const token = localStorage.getItem("jwtToken");
  const {
    selectedNavbarButton,
    setSelectedNavbarButton,
    setFriendRequests,
    getFriendList,
  } = ctx;

  const getFriendRequests = async () => {
    try {
      const response = await fetch(
        "http://localhost:5200/api/friendrequest/check",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        console.log("response", response);
        const data = await response.json();
        console.log("data", data);
        setFriendRequests(data);
        toast.success("artkaşlık isteği yüklendi", data);
        return;
      }

      const message = await response.text();

      if (response.status === 404) {
        setFriendRequests([]); // listeyi temizle
        toast.info(message); // "Arkadaşlık isteği yok."
      } else {
        toast.error(message);
      }
    } catch (error: any) {
      toast.error("Sunucuya bağlanılamadı");
      console.error(error);
    }
  };

  return (
    <button
      onClick={() => {
        setSelectedNavbarButton(buttonText.toLowerCase().trim());
        if (buttonText.toLowerCase().trim() === "bekleyen") getFriendRequests();
        if (buttonText.toLowerCase().trim() === "tümü") getFriendList();
      }}
      className={` p-2  rounded-xl text-gray-300 ${
        buttonText.toLowerCase().trim() === "arkadaş ekle"
          ? "bg-[#4654C0] cursor-pointer  transition-all font-semibold  hover:bg-[#4343e9] "
          : "  transition-all cursor-pointer  focus:bg-[#404044]   hover:text-white hover:bg-[#232327] active:bg-[#404044] "
      } ${
        selectedNavbarButton == buttonText.toLowerCase().trim() &&
        buttonText.toLowerCase().trim() != "arkadaş ekle" &&
        " text-white bg-[#404044]"
      }
      ${
        selectedNavbarButton.toLowerCase().trim() === "arkadaş ekle"
          ? buttonText.toLowerCase().trim() == "arkadaş ekle" &&
            "bg-[#232540] text-[#7A80CA]! hover:bg-[#232540] cursor-default! "
          : " "
      }  `}
    >
      {buttonText}
    </button>
  );
}

export default NavbarButton;
