import type { Game } from "../../types/types";
import tuta from "../../assets/tuta.png";
function Tutacard() {
  const games: Game[] = [
    {
      id: 1,
      title: "Sample Game Title",
      description:
        "An exciting adventure game with amazing graphics and immersive gameplay.",
      price: "Free",
      category: "Adventure",
    }
  ];
  return (
    <>
      {games.map((game) => (
        <div
          key={game.id}
          className="w-60 h-80 bg-[#1E1E22]   rounded-lg overflow-hidden cursor-pointer transition-all duration-150 hover:-translate-y-1 hover:shadow-xl border border-gray-700"
        >
          {/* Üst görsel kısmı */}
          <div className="h-[70%] bg-[#242429] flex items-center justify-center">
            <img
              src={game.imageUrl ?? tuta}
              alt={game.title}
              className="object-cover "
            />
          </div>

          {/* İçerik kısmı */}
          <div className="p-4 h-full bg-[#28282D]">
            <h4 className="text-white font-semibold text-sm truncate mb-2">
              {game.title}
            </h4>

            {/* Fiyat ve indirim */}
            <div className="flex items-center justify-between">
              <div className="text-gray-200 font-semibold">
                ₺{game.price}
                {game.discount && (
                  <span className="text-green-500 text-sm ml-2">
                    ({game.discount}%)
                  </span>
                )}
              </div>

              {/* Coin ikonu */}
              <div className="flex items-center text-gray-400 gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12h8m-4-4v8"
                  />
                </svg>
                <span className="text-sm">{game.coins ?? "7600"}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default Tutacard;
