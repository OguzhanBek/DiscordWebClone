import { useContext, useState } from "react";
import tuta from "../../assets/Tuta.png";
import { MdEdit } from "react-icons/md";
import { AppContext } from "../../context/userProvider";

// type ProfileEditorProps = {
//   setActiveTab: React.Dispatch<React.SetStateAction<string>>;
// };

function ProfieEditor() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    return null;
  }
  const { userInfo, setUserInfo } = ctx;

  const [bio, _setBio] = useState("Tutanın yaveri");
  const [pronouns, setPronouns] = useState("");
  const [color, setColor] = useState("#9333EA");

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header Banner */}

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-700 mb-6">
        <button className="text-white font-semibold pb-3 border-b-2 border-blue-500">
          Ana Profil
        </button>
        <button className="text-gray-400 hover:text-white pb-3 transition-colors">
          Sunucu başına profiller
        </button>
      </div>
      <div className="bg-linear-to-r from-purple-600 via-pink-500 to-blue-500 rounded-lg p-6 mb-6 relative overflow-hidden">
        <div className="absolute topy-2 right-4">
          <button className="bg-white/90 hover:bg-white text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-colors">
            Mağazaya Git
          </button>
        </div>
        <div className="flex items-center gapy-2">
          <div className="relative">
            <img
              src={tuta || "/default-avatar.png"}
              alt="avatar"
              className="w-20 h-20 rounded-full border-4 border-white"
            />
          </div>
          <div>
            <h2 className="text-white text-xl font-bold mb-1">
              Profiline taze bir görünüm ver
            </h2>
            <p className="text-white/90 text-sm">
              En yeni avatar dekorasyonlarına, profil efektlerine ve isim
              plaklarına göz at, en sevdiğin tarzları topla.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Form */}
        <div className="space-y-6">
          {/* Görünen Ad */}
          <div>
            <label className="block text-white font-semibold text-sm mb-2">
              Görünen Ad
            </label>
            <input
              type="text"
              value={userInfo?.user_name || ""}
              onChange={(e) =>
                setUserInfo(
                  (prev) =>
                    prev ? { ...prev, user_name: e.target.value } : prev, // user in fo null olabiilr diye ternary koymam gerekti yoksa tip hatası veriyor.
                )
              }
              className="w-full text-white px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500 border-2 border-[#303036]"
              placeholder="Görünen adınızı girin"
            />
          </div>

          <div className="bg-[#313131] h-px w-full " />

          {/* Hitaplar */}
          <div>
            <label className="block text-white font-semibold text-sm mb-2">
              Hitaplar
            </label>
            <input
              type="text"
              value={pronouns}
              onChange={(e) => setPronouns(e.target.value)}
              className="w-full  text-white px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-[#7040e0] border-2 border-[#303036] "
              placeholder="Tutanın yaveri"
            />
          </div>

          <div className="bg-[#313131] h-px w-full" />

          {/* Profil Widget'ları */}
          <div className=" rounded-lg   ">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-white font-semibold">Profil Widget'ları</h3>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Panona widget ekleyerek profilini tamamen özelleştir
            </p>
            <button className="bg-[#5865f2]  hover:bg-[#4452bb] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer">
              Widget'ları ekle
            </button>
          </div>

          <div className="bg-[#313131] h-px w-full" />

          <div className=" rounded-lg  ">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-white font-semibold">Avatar</h3>
              </div>
            </div>

            <button className="bg-[#5865f2]  hover:bg-[#4452bb] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer">
              Avatarını değiştir
            </button>
            <button className="bg-[#38383f] ml-2 hover:bg-[#323238] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer">
              Avatarını kaldır
            </button>
          </div>

          <div className="bg-[#313131] h-px w-full" />

          <div className=" rounded-lg  ">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-white font-semibold">Avatar Dekorasyonu</h3>
              </div>
            </div>

            <button className="bg-[#5865f2]  hover:bg-[#4452bb] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer">
              Dekorasyonu değiştir
            </button>
          </div>

          <div className="bg-[#313131] h-px w-full" />

          <div className=" rounded-lg  ">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-white font-semibold">İsim Plakası</h3>
              </div>
            </div>

            <button className="bg-[#5865f2]  hover:bg-[#4452bb] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer">
              İsim Plakasını değiştir
            </button>
          </div>

          <div className="bg-[#313131] h-px w-full" />

          <div className=" rounded-lg  ">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-white font-semibold">Profil Efekti</h3>
              </div>
            </div>

            <button className="bg-[#5865f2]  hover:bg-[#4452bb] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer">
              Efekti Değiştir
            </button>
          </div>

          <div className="bg-[#313131] h-px w-full" />

          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-white font-semibold">Afiş Rengi</h3>
              </div>
            </div>

            <div className="relative w-20 h-12 rounded-lg">
              <input
                className=" w-20 h-12 rounded-lg border-none outline-none cursor-pointer"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
              <button className="absolute select-none top-2 right-2 pointer-events-none ">
                <MdEdit className="text-[#41424a]" size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Preview */}
        <div>
          <h3 className="text-white  font-semibold text-sm mb-4">Önizleme</h3>

          {/* Preview Card */}
          <div className="bg-[#111214] rounded-lg overflow-hidden">
            {/* Banner */}
            <div style={{ backgroundColor: color }} className={`h-24`}></div>

            {/* Profile Info */}
            <div className="px-4 pb-4">
              <div className="flex justify-between items-start -mt-12 mb-4">
                <div className="relative">
                  <img
                    src={tuta || "/default-avatar.png"}
                    alt="avatar"
                    className="w-20 h-20 rounded-full border-6 border-[#111214]"
                  />
                  <div className="absolute bottom-0 right-0 w-5 h-5 bg-red-500 rounded-full border-4 border-[#111214]"></div>
                </div>
                <div className="mt-14">
                  <span className="text-xs text-gray-400">
                    tutadan iyisi Şamda kayısı
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <h2 className="text-white text-xl font-bold">
                  {userInfo?.user_name}
                </h2>
                <p className="text-gray-300 text-sm">
                  {userInfo?.user_name || "userinfo adı gelmedi"}
                  {pronouns && `• ${pronouns}`}
                </p>
              </div>

              {bio && (
                <div className="mb-4">
                  <p className="text-gray-300 text-sm">{bio}</p>
                </div>
              )}

              <button className="w-full bg-[#5865f2]  hover:bg-[#4452bb] text-white text-sm py-2 rounded-md font-medium transition-colors cursor-pointer">
                Örnek Butonu
              </button>
            </div>
          </div>
          {/* İsim Plakası Ön İzlemesi */}
          <div className="flex items-center justify-between mt-4 w-full">
            <div className="w-full">
              <h4 className="text-white font-semibold text-sm my-2">
                İsim Plakası Ön İzlemesi
              </h4>
              <div className="bg-[#323238] h-12 w-full flex items-center gap-4 pl-2 rounded-lg">
                <img
                  src={tuta}
                  alt="tuta"
                  className="w-8 h-8 object-cover rounded-full"
                />
                <h3 className="text-white">
                  {userInfo?.user_name || "userinfo adı gelmedi"}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfieEditor;
