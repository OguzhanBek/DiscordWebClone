function PurpleButton({ text }: { text: string }) {
  return (
    <button className="bg-[#525dcc] hover:opacity-80 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 transform  hover:shadow-xl cursor-pointer">
      {text}
    </button>
  );
}

export default PurpleButton;
