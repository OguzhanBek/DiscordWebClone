import { useState } from "react";
import screenshot1 from "../../../assets/screenshot_1.png";
import fadıl from "../../../assets/fadıl.webp";
import tuta from "../../../assets/Tuta.png";
import a from "../../../assets/Screenshot_2.png";
import b from "../../../assets/ben.jpg";
import c from "../../../assets/contra.jpg";
import h from "../../../assets/f2e2ae7b-326b-4025-a446-dae327d36bb3.jfif";
import j from "../../../assets/fadıl.webp";
import n from "../../../assets/resume1.png";
import z from "../../../assets/fadıl contra.png";
import DiscordHomeButton from "../../../ui/Molecules/DiscordHomeButton";
import { CiCirclePlus } from "react-icons/ci";
import { FaCompass } from "react-icons/fa";
import { TfiDownload } from "react-icons/tfi";
import type { ServerInfo } from "../../../types/types";
import ServerListItem from "../../../ui/Molecules/ServerListItem";
import ServerListAction from "../../../ui/Molecules/ServerListAction";



function Servers() {
  const [serverInfos, _setServerInfos] = useState<ServerInfo[]>([
    {
      photo: fadıl,
      name: "Fadıl",
    },
    {
      photo: tuta,
      name: "Tuta",
    },
    {
      photo: a,
      name: "AAAAA",
    },
    {
      photo: b,
      name: "BBBBB",
    },
    {
      photo: c,
      name: "CCCC",
    },
    {
      photo: h,
      name: "HHHH",
    },
    {
      photo: j,
      name: "JJJ",
    },
    {
      photo: n,
      name: "NUTA",
    },
    {
      photo: z,
      name: "ZUDE ",
    },
    {
      photo: screenshot1,
      name: "PORNO abdullah",
    },
  ]);
  const [activeServer, setActiveServer] = useState<number | null>(null);
  
  console.log("active server : ", activeServer);
  return (
    <>
      <div className="bg-[#121214] TUTA flex relative ">
        <div className="servers flex flex-col gap-0.5 w-20 items-center text-amber-50 ">
          <DiscordHomeButton activeServer={activeServer} setActiveServer = {setActiveServer}/>

          {serverInfos.map((serverInfo, index) => (
            <ServerListItem 
              index={index}
              activeServer={activeServer}
              setActiveServer={setActiveServer}
              photo={serverInfo.photo}
              name={serverInfo.name}
              key={index}
            />
          ))}
          <ServerListAction İcon={CiCirclePlus} name={"Bir Sunucu Ekle"} />
          <ServerListAction İcon={FaCompass} name={"Keşfet"} />
          <ServerListAction
            İcon={TfiDownload}
            name={"Uygulamaları İndir "}
          />
        </div>
      </div>
    </>
  );
}
export default Servers;
