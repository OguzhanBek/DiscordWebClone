import { grayBackground } from "../../Colors";
{
  /* Bunu ismini güncellemek lazım . sidebar'da direkt mesaj yazan kısımı oluşturuyor ama fonkisyonel oldu artık. Yeni isim bul. */
}
function DmOlusturYazısı({
  text,
}: {
  text: string;
  beforeContentText: string;
}) {
  return (
    <div className=" Dm-Olustur-Yazısı  flex items-center w-[85%] m-auto justify-between mt-2 hover:text-white group">
      <p className="text-sm text-gray-400 hover:cursor-default select-none group-hover:text-white">
        {text}
      </p>

      <span className="DM-Olustur-Before-Context  gap-1  ">
        <span className="relative group/item  ">
          <span className="hover:cursor-pointer text-lg text-gray-400 ">+</span>
          {/* Her item'ın kendi tooltip'i */}
          <span
            style={{ backgroundColor: grayBackground }}
            className="absolute left-1/2 -translate-x-1/2 bottom-[130%] opacity-0 group-hover/item:opacity-100 transition-opacity text-white px-2 py-2 rounded-md text-sm pointer-events-none whitespace-nowrap z-10"
          >
            DM Oluştur
          </span>
        </span>
      </span>

      {/* <DmOlusturBeforeContent
        items={[{ content: "+", tooltipText: beforeContentText }]}
      /> */}
    </div>
  );
}
export default DmOlusturYazısı;
