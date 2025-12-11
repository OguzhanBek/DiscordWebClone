import tuta from "../../assets/Tuta.png";
function FindFriends() {
  return (
    <>
      <input
        type="text"
        placeholder="Nereye Gitmek İstersin"
        className="border-[#39393d] bg-[#212125]  text-white text-2xl  m-auto outline-none border-1 rounded-2xl w-[100%] mt-4 mb-4 py-8 px-4"
      />

      <span className="text-xs">ÖNCEKİ KANALLAR</span>
      <div className="bg-[#212125] h-40 overflow-y-auto">
        <div className="px-2 flex items-center gap-2 hover:bg-[#2f2f3a] mb-4 mt-2 hover:cursor-pointer py-2 select-none">
          <img className="h-6 w-6 rounded-2xl" src={tuta} alt="" />
          <span>Tuta</span>
        </div>
      </div>
    </>
  );
}

export default FindFriends;
