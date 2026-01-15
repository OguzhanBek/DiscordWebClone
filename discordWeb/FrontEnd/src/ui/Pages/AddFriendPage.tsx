import { useContext, useState } from "react";
import { AppContext } from "../../context/userProvider";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getFriendRequests, UnauthorizedError } from "../../helpers/helpers";

function AddFriendPage() {
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const context = useContext(AppContext);
  if (!context) return null;
  const { jwtToken, setJwtToken, setFriendRequests } = context;

  const sendFriendRequest = async () => {
    if (!input.trim()) {
      toast.warning("Kullanıcı adı boş olamaz.");
      return;
    }

    if (!jwtToken) {
      toast.error("Token bulunamadı.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5200/api/friendrequest/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({
            ReceiverName: input.trim(),
            SenderId: jwtToken,
          }),
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("jwtToken");
        setJwtToken(null);
        navigate("/login");
        throw new UnauthorizedError("Token expired");
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const requests = await getFriendRequests(jwtToken);
      setFriendRequests(requests);

      setInput("");
      toast.success("Arkadaşlık isteği başarıyla gönderildi.");
    } catch (err) {
      console.error("Hata detayı:", err);

      if (err instanceof UnauthorizedError) {
        localStorage.removeItem("jwtToken");
        setJwtToken(null);
        navigate("/login");
        return;
      }

      toast.error(err instanceof Error ? err.message : "İstek gönderilemedi");
    }
  };

  //Yukarıdaki fonksiyonu adam etmek için bir de backend'e istek yollamak elzemdir.
  return (
    <div className=" w-full  mx-auto border-b-2 border-solid border-[#28282D] bg-[#1A1A1E]">
      <div className=" w-[95%] mx-auto mb-4 mt-4">
        <h1 className="mt-2 mb-2 text-xl">Arkadaş Ekle</h1>
        <p className="mb-2">
          Arkadaşlarını Discord kullanıcı adı ile ekleyebilirsin.
        </p>
        <div className=" rounded-xl w-full h-14  flex flex-row justify-between items-center bg-[#1E1F22] focus:border-blue-50   focus-within:border-[#5197ed] border-transparent border">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            name="arkadaşekle"
            id="arakdaşekle"
            placeholder="Arkadaşlarını Discord kullanıcı adı ile ekleyebilirsin"
            className=" h-full rounded-xl outline-none border-solid-2   w-full px-2 bg-transparent text-[#607C77] text-lg "
          />
          <button
            onClick={sendFriendRequest}
            className={` w-70 py-1.5 mr-4 rounded-lg text-white font-light text-center bg-[#4654C0]   transition-all   ${
              input.length == 0
                ? "opacity-40 "
                : "hover:bg-[#4343e9] cursor-pointer"
            } `}
          >
            Arkadaşlık İsteği Gönder
          </button>
        </div>
      </div>
    </div>
  );
}
export default AddFriendPage;
