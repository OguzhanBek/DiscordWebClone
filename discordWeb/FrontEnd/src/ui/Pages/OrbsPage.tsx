import DiscordOrbsPageNavbar from "../Molecules/DiscordOrbsNavbar";
import orbbüyü from "../../assets/orb büyücüsü.png";
import Tutacard from "../Organisms/Tutacard";
function OrbsPage() {
  return (
    <div className="Orbs-Page select-none mt-10 bg-[#1A1A1E] text-gray-200 font-sans overflow-y-auto discord-scrollbar">
      {/* Navbar */}
      <DiscordOrbsPageNavbar />
      <main className="p-6">
        {/* Oyun Kartları */}
        <section className="mb-8 mx-auto w-[80%] ">
          <div className=" relative top-[-100px] grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-y-20 gap-x-10 justify-items-center">
            <Tutacard />
            <Tutacard />
            <Tutacard />
            <Tutacard />

            {/* Full width banner */}
            <div
              style={{
                backgroundImage: `url(${orbbüyü})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
              className=" w-full h-52 col-span-full relative rounded-3xl overflow-hidden "
            >
              {/* Yazı overlay'i */}
              <div className="absolute w-[70%]  h-full bg-linear-to-r from-[#121214]/80 to-[#403A92]/40 via-[#211F37]/10 "></div>
              <div className="absolute  inset-0 flex items-center ">
                <div className=" ml-6  w-80">
                  <h3 className="text-2xl text-white font-medium">
                    Orbs ile ne alabilirim
                  </h3>
                  <p className="text-lg mt-2 text-gray-500 font-medium ">
                    Özel içerikler için Orbs harca veya favorilerini ana
                    Mağaza'dan al .
                    <span className=" mt-2 text-lg   text-blue-200">
                      Daha fazla bilgi edin
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Sonraki kartlar */}
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-y-20 gap-x-10 justify-items-center">
            <Tutacard />
            <Tutacard />
            <Tutacard />
            <Tutacard />

            <Tutacard />
            <Tutacard />
            <Tutacard />
            <Tutacard />

            <Tutacard />
            <Tutacard />
            <Tutacard />
            <Tutacard />
          </div>
        </section>
      </main>
    </div>
  );
}

export default OrbsPage;
