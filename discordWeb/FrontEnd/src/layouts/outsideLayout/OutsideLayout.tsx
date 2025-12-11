import Servers from "./outsideLayoutComponents/Servers";
import TopSide from "./outsideLayoutComponents/TopSide";
import ServerLayout from "../serverLayout/ServerLayout";

function OutsideLayout() {
  return (
    <div className="bg-[#121214] h-screen overflow-hidden flex flex-col">
      <TopSide />

      <div className="flex flex-1">
        <Servers />
        <div className="flex-1">
          <ServerLayout />
        </div>
      </div>
    </div>
  );
}
export default OutsideLayout;