import { motion } from "framer-motion";
import { Gamepad2, Compass, ArrowLeft } from "lucide-react";
import React from "react";

/**
 * Discord esintili NotFound sayfası
 * - React tek bileşen
 * - Tailwind ile stil (pad/margin bazıları style ile)
 * - Framer Motion animasyonlar
 * - Renk paleti Discord:
 *   Blurple: #5865F2
 *   Dark:    #1e1f22
 *   Darker:  #0b0c10
 *   Green:   #57F287
 *   Red:     #ED4245
 *   Yellow:  #FEE75C
 */

const BG_GRADIENT =
  "radial-gradient(1200px 600px at 10% -10%, rgba(88,101,242,0.18), transparent 50%)," +
  "radial-gradient(1000px 600px at 110% 10%, rgba(87,242,135,0.10), transparent 50%)," +
  "radial-gradient(900px 500px at 50% 120%, rgba(237,66,69,0.10), transparent 50%)";

const NotFoundPage: React.FC = () => {

  return (
    <div
      className="min-h-screen text-white relative "
      style={{ backgroundColor: "#1e1f22", padding: 0, margin: 0 }}
    >
      {/* Arka plan grid dokusu */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(transparent 23px, rgba(255,255,255,0.06) 24px), linear-gradient(90deg, transparent 23px, rgba(255,255,255,0.06) 24px)",
          backgroundSize: "24px 24px",
          margin: 0,
        }}
      />

      {/* Yumuşak renkli bloblar */}
      <div
        className="absolute inset-0"
        style={{ backgroundImage: BG_GRADIENT }}
      />

      {/* Yıldız tozu */}
      <Stars />

      {/* İçerik */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        {/* Logo/İkon + başlık */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 12 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3"
          style={{ marginTop: 24, marginBottom: 8 }}
        >
          <div
            className="p-3 rounded-2xl shadow-lg bg"
            style={{
              background: "rgba(88,101,242,0.12)",
              border: "1px solid rgba(88,101,242,0.35)",
            }}
          >
            <Gamepad2 className="w-7 h-7" />
          </div>
          <span className="uppercase tracking-widest text-xs text-gray-300">
            LOST IN THE SERVERVERSE
          </span>
        </motion.div>

        {/* 404 metni */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-center font-extrabold leading-tight"
          style={{
            fontSize: "clamp(56px, 8vw, 120px)",
            marginTop: 4,
            marginBottom: 8,
          }}
        >
          <span className="block" style={{ color: "#FEE75C" }}>
            404
          </span>
          <span
            className="block text-white/90"
            style={{ fontSize: "clamp(20px, 2.6vw, 36px)" }}
          >
            Bu sayfa <span style={{ color: "#5865F2" }}>kanal</span>'da değil.
          </span>
        </motion.h1>

        {/* Açıklama */}
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-center text-gray-300 max-w-xl"
          style={{
            paddingLeft: 16,
            paddingRight: 16,
            marginTop: 8,
            marginBottom: 20,
          }}
        >
          Aradığın kanal taşınmış, silinmiş ya da erişim yetkin olmayabilir.
          İstersen seni ana kanala ışınlayalım.
        </motion.p>

        {/* Butonlar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex flex-wrap items-center justify-center gap-3"
          style={{ marginTop: 4, marginBottom: 28 }}
        >
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 shadow-lg transition-transform hover:-translate-y-0.5"
            style={{
              backgroundColor: "#5865F2",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Ana kanala dön
          </a>

          <a
            href="/explore"
            className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 border backdrop-blur-sm transition-colors"
            style={{
              borderColor: "rgba(255,255,255,0.14)",
              background: "rgba(30,31,34,0.6)",
            }}
          >
            <Compass className="w-4 h-4" />
            Keşfet
          </a>
        </motion.div>

        {/* Alt bilgi */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-xs text-gray-400"
          style={{ marginBottom: 24 }}
        >
          Tip: <span style={{ color: "#57F287" }}>CTRL/⌘+K</span> ile hızlı
          komut paletini aç.
        </motion.div>
      </main>

      {/* Şerit dekorasyon */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        transition={{ duration: 1.2 }}
        className="absolute bottom-0 left-0 right-0 h-1.5"
        style={{
          background:
            "linear-gradient(90deg, #5865F2, #57F287, #FEE75C, #ED4245, #5865F2)",
          opacity: 0.8,
        }}
      />
    </div>
  );
};

export default NotFoundPage;

// --- Küçük yıldız alanı bileşeni ---
function Stars() {
  // Basit rastgele noktalar; her render'da değişen hafif bir parıltı animasyonu
  const dots = Array.from({ length: 80 }, (_, i) => i);
  return (
    <div className="absolute inset-0 overflow-hidden">
      {dots.map((i) => {
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const size = Math.random() * 2 + 1; // 1-3px
        const delay = Math.random() * 2; // 0-2s
        return (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: size,
              height: size,
              background: "rgba(255,255,255,0.9)",
              boxShadow: "0 0 6px rgba(88,101,242,0.7)",
            }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay,
            }}
          />
        );
      })}
    </div>
  );
}
