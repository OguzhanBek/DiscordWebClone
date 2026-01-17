import { useNavigate } from "react-router-dom";

function ServerListItem({
  photo,
  name,
  index,
  activeServer,
  setActiveServer,
}: {
  photo: string;
  name: string;
  index: number;
  activeServer: number | null;
  setActiveServer: React.Dispatch<React.SetStateAction<number | null>>;
}) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        console.log(`Clicked server ${index}`);
        setActiveServer(index);
        navigate(`/channels/${index}`);
      }}
      className={`server-item relative group mt-2 h-10 w-[40%] hover:cursor-pointer transition-all select-none
    before:content-[''] before:absolute before:left-[-26px] before:top-1/2 before:-translate-y-1/2 
    before:transition-all before:w-0 before:bg-white before:rounded before:pointer-events-none hover:before:w-1.5 hover:before:h-5
    ${
      activeServer === index
        ? "before:h-8 before:w-1.5 hover:before:w-1.5 hover:before:h-8"
        : "before:h-0 before:w-0"
    } 
    `}
    >
      <img className="h-full w-full rounded-[30%]" src={photo} alt={name} />

      <span
        className="
          absolute left-full z-10 font-semibold text-sm top-1/2 -translate-y-1/2 bg-[#1A1A1E]   ml-2  px-2 py-2 rounded-md  invisible
           group-hover:visible before:content-[''] before:absolute before:-left-1 before:top-1/2 before:-translate-y-1/2 before:bg-[#1A1A1E] before:h-2 before:w-2 before:rotate-45 pointer-events-none 
           
     "
      >
        {name}
      </span>
    </div>
  );
}

export default ServerListItem;
