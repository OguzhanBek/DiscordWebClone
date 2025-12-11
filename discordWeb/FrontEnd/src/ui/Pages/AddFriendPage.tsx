import { useState } from "react";

function AddFriendPage() {
  const [input, setInput] = useState("");
  return (
    <div className=" w-[100%]  mx-auto border-b-2 border-solid border-[#28282D] bg-[#1A1A1E]">
      <div className=" w-[95%] mx-auto mb-4 mt-4">
        <h1 className="mt-2 mb-2 text-xl">Arkadaş Ekle</h1>
        <p className="mb-2">
          Arkadaşlarını Discrod kullanıcı adı ile ekleyebilrsin.
        </p>
        <div className=" rounded-xl w-full h-14  flex flex-row justify-between items-center bg-[#1E1F22] focus:border-blue-50   focus-within:border-[#5197ed] border-transparent border">
          <input
            value={input}
            onChange={(e)=> setInput(e.target.value)}
            type="text"
            name="arkadaşekle"
            id="arakdaşekle"
            placeholder="Arkadaşlarını Discord kullanıcı adı ile ekleyebilirsin"
            className=" h-full rounded-xl outline-none border-solid-2   w-full px-2 bg-transparent text-[#607C77] text-lg "
          />
          <button className= { ` w-70 py-1.5 mr-4 rounded-lg text-white font-light text-center bg-[#4654C0]   transition-all   ${input.length == 0 ? "opacity-40 " : "hover:bg-[#4343e9] cursor-pointer"} ` }>
            Arkadaşlık İsteği Gönder
          </button>
        </div>
      </div>
    </div>
  );
}
export default AddFriendPage;