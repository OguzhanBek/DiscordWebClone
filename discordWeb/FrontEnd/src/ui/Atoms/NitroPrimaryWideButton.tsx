type NitroPrimaryWideButtonProps = {
  text: string;
};

function NitroPrimaryWideButton({ text }: NitroPrimaryWideButtonProps) {
  return (
    <button
      className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 transform cursor-pointer bg-[#525dcc] hover:bg-indigo-500 text-white hover:shadow-xl`}
    >
      {text}
    </button>
  );
}

export default NitroPrimaryWideButton;
