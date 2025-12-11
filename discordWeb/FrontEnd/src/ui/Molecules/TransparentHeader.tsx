import dcMagaza from "../../assets/discordmağazaimage.png";

function TransparentHeader() {
  return (
    <header
      className={`bg-[#1A1A1E]   border-gray-600  flex items-center justify-between`}
    >
      <div
        style={{
          backgroundImage: `
      linear-gradient(to bottom, rgba(26,26,30,0) 40%, rgba(26,26,30,1) 85%), 
      url(https://cdn.discordapp.com/assets/content/e51b486a1d5cc225f1bdd42744c472eeac5a08e50ac8f40215b4b229ae282e35.jpg)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "300px",
          width: "100%",
        }}
        className="flex items-center justify-around"
      >
        <img src={dcMagaza} alt="" className="w-80 h-20" />
        <button className="bg-[#FFFFFF]  text-black  outline-none hover:bg-[#DFE0E2] cursor-pointer transition-all rounded-xl p-2">
          Secret garden koleksiyonunu satın al
        </button>
      </div>
    </header>
  );
}

export default TransparentHeader;
