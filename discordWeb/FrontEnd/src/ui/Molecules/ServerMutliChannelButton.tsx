import { FaUserFriends } from "react-icons/fa";
import { CiSettings } from "react-icons/ci";
import { IoChatbubble } from "react-icons/io5";
import DmOlusturBeforeContent from "../Atoms/DmOlusturBeforeContent";
import { Link } from "react-router-dom";

function ServerMutliChannelButton({
  ChannelType,
  ChannelName,
}: {
  ChannelType: String;
  ChannelName: string;
}) {
  return (
    <>
      {ChannelType === "text" ? (
        <div className="w-[95%] flex flex-row mx-auto ">
          <Link
            to={"/channels/31"} // Buraya dinamik olarak server id'si gelecek.
            draggable={false}
            className="w-full group/channel hover:bg-[#1e1e20] focus:bg-[#2C2C30]  rounded-md px-2 py-1  "
          >
            <div className="flex flex-row justify-between items-center ">
              <div className="flex flex-row gap-2 ">
                <span>#</span>
                <p>{ChannelName}</p>
              </div>
              {/* Server'lardaki metin ve ses odalarına gelince yanlarında çıkan logolar. */}
              <DmOlusturBeforeContent
                items={[
                  { content: <FaUserFriends />, tooltipText: "Davet Oluştur" },
                  { content: <CiSettings />, tooltipText: "Kanalı Düzenle" },
                ]}
              />
            </div>
          </Link>
        </div>
      ) : (
        <div className="w-[95%] flex flex-row mx-auto">
          <Link
            draggable={false}
            to={"/channels/0"}
            className="w-full hover:bg-[#1e1e20] focus:bg-[#2C2C30]  rounded-md px-2 py-1 group/channel"
          >
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-row gap-2">
                <span>🔊</span>
                <p>{ChannelName}</p>
              </div>
              <DmOlusturBeforeContent
                items={[
                  {
                    content: <IoChatbubble />,
                    tooltipText: "Sohbeti Aç",
                  },
                  { content: <FaUserFriends />, tooltipText: "Davet Oluştur" },
                  { content: <CiSettings />, tooltipText: "Kanalı Düzenle" },
                ]}
              />
            </div>
          </Link>
        </div>
      )}
    </>
  );
}
export default ServerMutliChannelButton;
