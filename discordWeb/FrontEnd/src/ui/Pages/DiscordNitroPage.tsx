import { Crown, Upload, Users, MessageCircle, Star, Check } from "lucide-react";

import discordNitroFooter from "../../assets/discord nitro footerpicture.png";
import NitroSecondaryButton from "../Atoms/NitroSecondaryButton";
import NitroPrimaryButton from "../Atoms/NitroPrimaryButton";
import NitroSecondaryWideButton from "../Atoms/NitroSecondaryWideButton";
import NitroPrimaryWideButton from "../Atoms/NitroPrimaryWideButton";

export default function DiscordNitroPage() {
  const features = [
    {
      icon: <Upload className="w-8 h-8" />,
      title: "Daha Büyük Dosya Yükleme",
      description: "100MB'a kadar dosya paylaş",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Sunucu Boost",
      description: "Sevdiğin sunucuları güçlendir",
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Özel Emoji ve Çıkartmalar",
      description: "Her yerde özel emojileri kullan",
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "HD Video",
      description: "Daha yüksek kalitede görüntülü ara",
    },
  ];

  const plans = [
    {
      name: "Nitro",
      price: "99.99₺",
      period: "/ay",
      features: [
        "100MB dosya yükleme",
        "Özel emoji ve çıkartmalar",
        "HD video ve ses",
        "2 Sunucu Boost",
        "Özel profil rozeti",
      ],
      popular: true,
    },
    {
      name: "Nitro Basic",
      price: "29.99₺",
      period: "/ay",
      features: [
        "50MB dosya yükleme",
        "Özel emoji kullanımı",
        "Özel profil rozeti",
        "Yüksek kalite video",
      ],
      popular: false,
    },
  ];

  return (
    <div className="discord-scrollbar min-h-screen bg-[#121212] text-white overflow-y-auto select-none">
      {/* Hero Section */}
      <section className="relative bg-[#18181b] overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <Crown className="w-20 h-20 text-yellow-400" />
            </div>
            <h1 className="text-6xl font-bold mb-6 bg-linear-to-r from-[#706d5f] to-white bg-clip-text  text-transparent">
              Discord Nitro
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Discord deneyimini bir üst seviyeye taşı. Daha büyük dosyalar,
              özel emojiler, HD video ve daha fazlası için Nitro'yu dene.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NitroPrimaryButton text={"Nitro Al"} />

              <NitroSecondaryButton text={"Daha Fazla Bilgi"} />
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-24 bg-[#1e1f24]">
        {" "}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Nitro ile Neler Yapabilirsin?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Discord'u kullanma şeklini değiştiren özelliklerle tanış
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-[#2a2b30] hover:bg-[#35363c] rounded-xl p-6 transition-all duration-200 transform hover:shadow-lg cursor-pointer"
              >
                <div className="text-indigo-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Pricing Section */}
      <section className="py-24 bg-[#18191d]">
        {" "}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Planını Seç</h2>
            <p className="text-xl text-gray-400">Sana uygun olan planı bul</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-[#202225] rounded-2xl p-8 ${
                  plan.popular ? "border-2 border-indigo-500" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2  -translate-x-1/2">
                    <span className="bg-[#525dcc] text-white px-4 py-2 rounded-full text-sm font-semibold">
                      En Popüler
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-center justify-center">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-400 ml-1">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 h-60">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="w-5 h-5 text-green-400 mr-3 shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                {plan.popular ? (
                  <NitroPrimaryWideButton text={plan.name} />
                ) : (
                  <NitroSecondaryWideButton text={plan.name} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="CTA Section py-24 bg-linear-to-r from-[#1d1d1f] to-[#222227]">
        {" "}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Hemen Başla</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Discord Nitro ile sohbet deneyimini zenginleştir. İstediğin zaman
            iptal edebilirsin.
          </p>

          <NitroSecondaryButton text={"Ücretsiz Dene"} />
        </div>
      </section>
      {/* App Bottom Section */}
      <section className="py-16 bg-[#18191c]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-linear-to-r from-[#201f20] to-[#212224] rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">
              Nitro ile Discord'u Keşfet
            </h3>
            <p className="text-gray-200 mb-6">
              Daha iyi bir Discord deneyimi için Nitro'nun tüm özelliklerini
              keşfet
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-[#5864F0] hover:bg-[#DFE0E2] px-6 py-3 rounded-md font-semibold transition-all duration-200 transform cursor-pointer">
                Nitro Satın Al
              </button>
              <NitroSecondaryButton text={"Daha fazla bilgi"} />
            </div>
          </div>

          <div className="text-sm text-gray-500">
            Nitro özelliklerini istediğin zaman ayarlarından yönetebilirsin
          </div>
        </div>
      </section>
      <footer className="text-gray-500 text-center bg-[#101113]">
        <img
          src={discordNitroFooter}
          className="mx-auto"
          alt="discordNitroFooter"
        />
      </footer>
    </div>
  );
}
