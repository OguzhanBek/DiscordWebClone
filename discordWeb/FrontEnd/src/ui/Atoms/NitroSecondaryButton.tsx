type NitroSecondaryButtonProps = {
  text: string;
};
function NitroSecondaryButton({ text }: NitroSecondaryButtonProps) {
  return (
    <button
      className={` py-3 px-6 rounded-lg font-semibold transition-all duration-200 transform cursor-pointer  bg-[#2d2f35] hover:bg-[#393b42] text-white hover:shadow-lg
            `}
    >
      {text}
    </button>
  );
}

export default NitroSecondaryButton;
