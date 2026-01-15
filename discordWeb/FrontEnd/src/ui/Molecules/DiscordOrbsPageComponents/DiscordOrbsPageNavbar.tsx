function DiscordOrbsPageNavbar() {
  return (
    <header className="relative w-full h-[300px] flex items-center justify-around  ">
      <div className="absolute inset-0 bg-center bg-cover bg-no-repeat bg-[url(https://cdn.discordapp.com/assets/content/8f774ab3b8482a9fd205e8b7285cc372448c4893d8fe9b50d37ddb70c922240d.png)]"></div>
      <div className="absolute inset-0 bg-linear-to-b from-[#1D1A44] to-transparent" />

      <h3 className="w-80 h-20 text-2xl  text-white z-50">İşte Discord Orbs</h3>
      <button className="bg-[#FFFFFF] text-black outline-none hover:bg-[#DFE0E2] cursor-pointer transition-all rounded-xl p-2 z-50">
        Görevler ana sayfasına git
      </button>
    </header>
  );
}

export default DiscordOrbsPageNavbar;
