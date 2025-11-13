import type { User } from "../../types/types";
import DirectMessageButton from "../Molecules/userButton";



type SideBarButtonsProps = {
  users: User[];
};
function DirectMessageButtons({ users }: SideBarButtonsProps) {
  return (
    <div>
      {users.map(({ userPhoto, userName }, index) => (
        <DirectMessageButton
          key={index}
          userName={userName}
          userPhoto={userPhoto}
        />
      ))}
    </div>
  );
}

export default DirectMessageButtons;
