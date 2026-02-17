export type conversationList = {
  conversationId: string;
  friendId: string;
  userName: string;
  profilePhoto?: string;
};
export type Participant = {
  userId: string; 
  userName: string;
  profilePhoto?: string;
};
export type DmParticipant = {
  userId: string;
  userName: string;
  profilePhoto?: string;
};