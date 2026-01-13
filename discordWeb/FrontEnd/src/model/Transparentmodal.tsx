function Transparentmodal({
  setOpenFindFriends,
  children,
}: {
  children: React.ReactNode;
  setOpenFindFriends: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div
      onClick={() => setOpenFindFriends(false)}
      className="fixed inset-0 flex items-center justify-center z-100  "
    >
      {/* Arka plan (sadece buraya opacity veriyoruz) */}

      <div className="absolute inset-0 bg-black opacity-60"></div>
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-[#212125] w-2xl h-100 rounded-2xl "
      >
        <div className="w-[95%] m-auto">{children}</div>
      </div>
    </div>
  );
}

export default Transparentmodal;
