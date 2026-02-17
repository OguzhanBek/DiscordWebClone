import { useContext, useState, useEffect } from "react";
import { MdEdit } from "react-icons/md";
import { AppContext } from "../../context/userProvider";
import defaultPhoto from "../../../public/discord kullanıcı default foto.jpeg";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import { normalizePhotoUrl } from "../../helpers/helpers";
import { SignalRContext } from "../../context/signalRContext";

function ProfileEditor() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    return null;
  }

  const signalctx = useContext(SignalRContext);
  if (!signalctx) {
    return null;
  }
  const { userInfo, setUserInfo, jwtToken } = ctx;
  const [bio, _setBio] = useState("Tutanın yaveri");
  const [pronouns, setPronouns] = useState("");
  const [color, setColor] = useState("#9333EA");
  const [isAvatarOptionsOpen, setIsAvatarOptionsOpen] =
    useState<boolean>(false);
  const [isChangeAvatar, setIsChangeAvatar] = useState<boolean>(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");

  useEffect(() => {
    if (photo) {
      const objectUrl = URL.createObjectURL(photo);
      setPhotoPreview(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
  }, [photo]);

  const handlePhotoChange = async () => {
    if (!photo) {
      toast.error("Lütfen bir fotoğraf seçin");
      return;
    }

    const formData = new FormData();
    formData.append("photo", photo);

    try {
      const response = await fetch("http://localhost:5200/api/photo", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Backend error:", errorData);
        toast.error(errorData.message || "Fotoğraf yüklenemedi");
        return;
      }
      const data = await response.json();
      const fullPhotoUrl = `http://localhost:5200${data.profilePhoto}`;

      setUserInfo((prev) => {
        const newUserInfo = prev
          ? {
              ...prev,
              profilePhoto: fullPhotoUrl,
            }
          : prev;
        console.log("📝 Yeni userInfo:", newUserInfo);
        return newUserInfo;
      });

      toast.success(data.message);
      await signalctx?.editConnection?.invoke(
        "UpdateProfilePhoto",
        data.profilePhoto,
      );

      setIsChangeAvatar(false);
      setPhoto(null);
      setPhotoPreview("");
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Bir hata oluştu");
    }
  };

  const displayPhoto =
    photoPreview || normalizePhotoUrl(userInfo?.profilePhoto) || defaultPhoto;
  return (
    <div
      onClick={() => setIsAvatarOptionsOpen(false)}
      className="max-w-4xl mx-auto p-6"
    >
      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-700 mb-6">
        <button className="text-white font-semibold pb-3 border-b-2 border-blue-500">
          Ana Profil
        </button>
        <button className="text-gray-400 hover:text-white pb-3 transition-colors">
          Sunucu başına profiller
        </button>
      </div>

      {/* Header Banner */}
      <div className="bg-linear-to-r from-purple-600 via-pink-500 to-blue-500 rounded-lg p-6 mb-6 relative overflow-hidden">
        <div className="absolute top-2 right-4">
          <button className="bg-white/90 hover:bg-white text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-colors">
            Mağazaya Git
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={displayPhoto || defaultPhoto}
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
              value={userInfo?.userName || ""}
              onChange={(e) =>
                setUserInfo((prev) =>
                  prev ? { ...prev, userName: e.target.value } : prev,
                )
              }
              className="w-full text-white px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500 border-2 border-[#303036] bg-transparent"
              placeholder="Görünen adınızı girin"
            />
          </div>

          <div className="bg-[#313131] h-px w-full" />

          {/* Hitaplar */}
          <div>
            <label className="block text-white font-semibold text-sm mb-2">
              Hitaplar
            </label>
            <input
              type="text"
              value={pronouns}
              onChange={(e) => setPronouns(e.target.value)}
              className="w-full text-white px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-[#7040e0] border-2 border-[#303036] bg-transparent"
              placeholder="Tutanın yaveri"
            />
          </div>

          <div className="bg-[#313131] h-px w-full" />

          {/* Profil Widget'ları */}
          <div className="rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold">Profil Widget'ları</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Panona widget ekleyerek profilini tamamen özelleştir
            </p>
            <button className="bg-[#5865f2] hover:bg-[#4452bb] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer">
              Widget'ları ekle
            </button>
          </div>

          <div className="bg-[#313131] h-px w-full" />

          {/* Avatar */}
          <div className="rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold">Avatar</h3>
            </div>
            <button
              onClick={() => setIsChangeAvatar(true)}
              className="bg-[#5865f2] hover:bg-[#4452bb] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
            >
              Avatarını değiştir
            </button>
            <button className="bg-[#38383f] ml-2 hover:bg-[#323238] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer">
              Avatarını kaldır
            </button>
          </div>

          <div className="bg-[#313131] h-px w-full" />

          {/* Avatar Dekorasyonu */}
          <div className="rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold">Avatar Dekorasyonu</h3>
            </div>
            <button className="bg-[#5865f2] hover:bg-[#4452bb] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer">
              Dekorasyonu değiştir
            </button>
          </div>

          <div className="bg-[#313131] h-px w-full" />

          {/* İsim Plakası */}
          <div className="rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold">İsim Plakası</h3>
            </div>
            <button className="bg-[#5865f2] hover:bg-[#4452bb] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer">
              İsim Plakasını değiştir
            </button>
          </div>

          <div className="bg-[#313131] h-px w-full" />

          {/* Profil Efekti */}
          <div className="rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold">Profil Efekti</h3>
            </div>
            <button className="bg-[#5865f2] hover:bg-[#4452bb] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer">
              Efekti Değiştir
            </button>
          </div>

          <div className="bg-[#313131] h-px w-full" />

          {/* Afiş Rengi */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold">Afiş Rengi</h3>
            </div>
            <div className="relative w-20 h-12 rounded-lg">
              <input
                className="w-20 h-12 rounded-lg border-none outline-none cursor-pointer"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
              <button className="absolute select-none top-2 right-2 pointer-events-none">
                <MdEdit className="text-[#41424a]" size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Preview */}
        <div>
          <h3 className="text-white font-semibold text-sm mb-4">Önizleme</h3>

          {/* Preview Card */}
          <div className="bg-[#111214] rounded-lg overflow-hidden">
            {/* Banner */}
            <div style={{ backgroundColor: color }} className="h-24"></div>

            {/* Profile Info */}
            <div className="px-4 pb-4">
              <div className="flex justify-between items-start -mt-12 mb-4">
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="relative group"
                >
                  <img
                    onClick={() => setIsAvatarOptionsOpen(!isAvatarOptionsOpen)}
                    src={displayPhoto}
                    alt="avatar"
                    className="w-20 h-20 rounded-full border-6 border-[#111214] transition-all duration-200 group-hover:brightness-75 cursor-pointer"
                  />

                  {/* Kalem İkonu */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <MdEdit className="text-white" size={24} />
                  </div>

                  {/* Durum İkonu */}
                  <div className="absolute bottom-0 right-0 w-5 h-5 bg-red-500 rounded-full border-4 border-[#111214]"></div>

                  {/* Avatar Seçenekleri Menüsü */}
                  <div
                    className={`absolute top-1/2 left-full ml-6 -translate-y-1/2 bg-[#28282D] rounded-lg shadow-xl border border-gray-700 overflow-hidden transition-all duration-200 whitespace-nowrap ${
                      isAvatarOptionsOpen
                        ? "visible opacity-100 -translate-x-4"
                        : "invisible opacity-0 translate-x-4"
                    }`}
                  >
                    <button
                      onClick={() => {
                        setIsChangeAvatar(true);
                        setIsAvatarOptionsOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#303035] transition-colors duration-150 cursor-pointer"
                    >
                      Avatarını değiştir
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#303035] transition-colors duration-150 cursor-pointer">
                      Dekorasyonu değiştir
                    </button>
                  </div>
                </div>

                <div className="mt-14">
                  <span className="text-xs text-gray-400">
                    tutadan iyisi Şamda kayısı
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <h2 className="text-white text-xl font-bold">
                  {userInfo?.userName || "Kullanıcı Adı"}
                </h2>
                <p className="text-gray-300 text-sm">
                  {userInfo?.userName || "username"}
                  {pronouns && ` • ${pronouns}`}
                </p>
              </div>

              {bio && (
                <div className="mb-4">
                  <p className="text-gray-300 text-sm">{bio}</p>
                </div>
              )}

              <button className="w-full bg-[#5865f2] hover:bg-[#4452bb] text-white text-sm py-2 rounded-md font-medium transition-colors cursor-pointer">
                Örnek Butonu
              </button>
            </div>
          </div>

          {/* İsim Plakası Ön İzlemesi */}
          <div className="mt-4">
            <h4 className="text-white font-semibold text-sm mb-2">
              İsim Plakası Ön İzlemesi
            </h4>
            <div className="bg-[#323238] h-12 w-full flex items-center gap-4 pl-2 rounded-lg">
              <img
                src={displayPhoto}
                alt="avatar"
                className="w-8 h-8 object-cover rounded-full"
              />
              <h3 className="text-white">
                {userInfo?.userName || "Kullanıcı Adı"}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Değiştirme Modal */}
      {isChangeAvatar &&
        createPortal(
          <div className="fixed inset-0 z-1500">
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => {
                setIsChangeAvatar(false);
                if (!userInfo?.profilePhoto) {
                  setPhoto(null);
                  setPhotoPreview("");
                }
              }}
            ></div>

            {/* Modal Content */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#313338] rounded-lg p-6 w-[480px]">
              <h2 className="text-white text-xl font-bold mb-4">
                Avatar Değiştir
              </h2>

              {/* Önizleme */}
              <div className="flex flex-col items-center mb-6">
                <img
                  src={displayPhoto}
                  alt="preview"
                  className="w-32 h-32 rounded-full object-cover mb-4"
                />
                <p className="text-gray-400 text-sm">
                  {photo ? photo.name : "Bir fotoğraf seç"}
                </p>
              </div>

              {/* Dosya Seçme */}
              <input
                type="file"
                id="avatar-input"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setPhoto(file);
                  }
                }}
              />

              {/* Butonlar */}
              <div className="flex gap-3">
                <label
                  htmlFor="avatar-input"
                  className="flex-1 bg-[#4a4a52] hover:bg-[#5a5a62] text-white px-4 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer text-center"
                >
                  Fotoğraf Seç
                </label>
                <button
                  onClick={handlePhotoChange}
                  disabled={!photo}
                  className="flex-1 bg-[#5865f2] hover:bg-[#4452bb] disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-md text-sm font-medium transition-colors"
                >
                  Kaydet
                </button>
              </div>

              <button
                onClick={() => {
                  setIsChangeAvatar(false);
                  if (!userInfo?.profilePhoto) {
                    setPhoto(null);
                    setPhotoPreview("");
                  }
                }}
                className="w-full mt-3 text-gray-400 hover:text-white text-sm transition-colors"
              >
                İptal
              </button>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

export default ProfileEditor;
