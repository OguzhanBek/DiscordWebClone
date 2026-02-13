import  { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaInstagram, FaSteam } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";

function Connections() {
  const [connections, setConnections] = useState([
    {
      id: 1,
      platform: "Instagram",
      username: "oguzbek2000",
      icon: <FaInstagram className="text-2xl" />,
      color: "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400",
      connected: true,
    },
    {
      id: 2,
      platform: "Steam",
      username: "Daud",
      icon: <FaSteam className="text-2xl" />,
      color: "bg-[#171a21]",
      connected: true,
      showOnProfile: true,
    },
    {
      id: 3,
      platform: "X (Twitter)",
      username: "oguzhanbek",
      icon: <BsTwitterX className="text-2xl" />,
      color: "bg-black",
      connected: false,
    },
  ]);

  const toggleConnection = (id : number) => {
    setConnections(
      connections.map((conn) =>
        conn.id === id ? { ...conn, connected: !conn.connected } : conn,
      ),
    );
  };

  const toggleShowOnProfile = (id : number) => {
    setConnections(
      connections.map((conn) =>
        conn.id === id ? { ...conn, showOnProfile: !conn.showOnProfile } : conn,
      ),
    );
  };


  const removeConnection = (id : number) => {
    setConnections(
      connections.map((conn) =>
        conn.id === id
          ? { ...conn, connected: false, showOnProfile: false }
          : conn,
      ),
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-white text-2xl font-bold mb-2">
          Profiline hesap ekle
        </h1>
        <p className="text-gray-400 text-sm">
          Bu bilgi izinin olmadan Discord haricinde paylaşılmaz ve Discord'un{" "}
          <span className="text-blue-400 hover:underline cursor-pointer">
            Gizlilik Politikası
          </span>{" "}
          doğrultusunda kullanılır.
        </p>
      </div>

      {/* Available Platforms */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
        {connections.map((conn) => (
          <button
            key={conn.id}
            onClick={() => !conn.connected && toggleConnection(conn.id)}
            className={`${conn.color} p-3 rounded-lg hover:opacity-80 transition-opacity shrink-0 ${
              conn.connected
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
            disabled={conn.connected}
          >
            <div className="text-white">{conn.icon}</div>
          </button>
        ))}
      </div>

      {/* Connected Accounts */}
      <div className="space-y-4">
        {connections
          .filter((conn) => conn.connected)
          .map((conn) => (
            <div
              key={conn.id}
              className="bg-[#2B2D31] rounded-lg p-4 hover:bg-[#32353B] transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`${conn.color} p-2 rounded-lg`}>
                    <div className="text-white">{conn.icon}</div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-semibold">
                        {conn.username}
                      </h3>
                      <span className="text-gray-400 text-sm">
                        {conn.platform}
                      </span>
                    </div>

                  </div>

                  <button
                    onClick={() => removeConnection(conn.id)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <IoClose size={24} />
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="mt-4 space-y-3 pt-3  ">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Profilde görüntüle</span>
                  <button
                    onClick={() => toggleShowOnProfile(conn.id)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      conn.showOnProfile ? "bg-blue-500" : "bg-gray-600"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        conn.showOnProfile ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>


              </div>
            </div>
          ))}
      </div>

      {/* Add More Connections Message */}
      {connections.filter((conn) => !conn.connected).length > 0 && (
        <div className="mt-6 text-center text-gray-400 text-sm">
          Yukarıdaki ikonlara tıklayarak daha fazla hesap bağlayabilirsin
        </div>
      )}
    </div>
  );
}

export default Connections;
