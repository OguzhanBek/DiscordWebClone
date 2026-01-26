import { ChevronDown, Filter } from "lucide-react";
import { useState } from "react";

import secretGarden from "../../assets/discordmağazaimage.png";
import Tutacard from "../Organisms/Tutacard";

const TakeALookPage = () => {
  const [sortBy, setSortBy] = useState("Yakın Zamanda Eklenen");

  const products = [
    {
      id: 1,
      name: "After the Rain Bundle",
      price: "£115.99",
      originalPrice: "£127.99",
      discount: "-8%",
      orbs: "7600",
      image: "/api/placeholder/280/180",
      gradient: "from-emerald-900 to-teal-800",
    },
    {
      id: 2,
      name: "Butterfly Garden Bundle",
      price: "£115.99",
      originalPrice: "£127.99",
      discount: "-8%",
      orbs: "7600",
      image: "/api/placeholder/280/180",
      gradient: "from-pink-900 to-purple-800",
    },
    {
      id: 3,
      name: "Greenhouse Bundle",
      price: "£115.99",
      originalPrice: "£127.99",
      discount: "-8%",
      orbs: "7600",
      image: "/api/placeholder/280/180",
      gradient: "from-green-900 to-emerald-800",
    },
    {
      id: 4,
      name: "Terrarium",
      price: "£62.99",
      orbs: "4100",
      image: "/api/placeholder/280/180",
      gradient: "from-blue-900 to-cyan-800",
    },
  ];

  return (
    <div className=" select-none w-[75%] mt-10 mx-auto bg-[#1E1F22] overflow-y-auto discord-scrollbar">
      {/* Hero Section */}
      <div className="px-8 py-6 ">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center justify-end space-x-4 w-full">
            <span className="text-white font-medium">Sıralama Ölçütü:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#2B2D31] text-white px-4 py-2 pr-8 rounded-lg border border-[#40444B] focus:outline-none focus:ring-2 focus:ring-[#5865F2] cursor-pointer appearance-none"
              >
                <option value="Yakın Zamanda Eklene">
                  Yakın Zamanda Eklene
                </option>
                <option value="Fiyat: Düşükten Yükseğe">
                  Fiyat: Düşükten Yükseğe
                </option>
                <option value="Fiyat: Yüksekten Düşüğe">
                  Fiyat: Yüksekten Düşüğe
                </option>
                <option value="Popülerlik">Popülerlik</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <button className="flex items-center space-x-2 bg-[#2B2D31] text-white px-4 py-2 rounded-lg border border-[#40444B] hover:bg-[#36393F] transition-colors">
              <Filter className="w-4 h-4" />
              <span>Filtreleri Göster</span>
            </button>
          </div>
        </div>
      </div>
      {/* Header Section */}
      <div className="relative    bg-amber-50 rounded-4xl">
        <header
          className={`bg-[#1E1F22]  border-gray-600  flex items-center justify-between min-w-200 rounded-4xl`}
        >
          <div
            style={{
              backgroundImage: `
     
      url(https://cdn.discordapp.com/assets/content/e51b486a1d5cc225f1bdd42744c472eeac5a08e50ac8f40215b4b229ae282e35.jpg)`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className="flex  items-center    relative rounded-4xl w-full h-[200px]  "
          >
            <img
              src={secretGarden}
              alt="secretGarden"
              className="w-100 h-22 rounded-4xl ml-8"
            />
          </div>
        </header>
      </div>

      {/* Filters and Sort */}

      {/* Products Grid */}
      <div className=" py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {products.map((product) => (
              <Tutacard key={product.id} />
            ))}
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {products.map((product) => (
              <Tutacard key={`second-${product.id}`} />
            ))}
          </div>

          {/* Third Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Tutacard key={`third-${product.id}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeALookPage;
