export type Message = {
  messageId: string;
  conversationId: string;
  authorUserId: string;
  authorUsername: string;
  content: string;
  createdAt: string;
  editedAt: string;
  messageType: "text" | "file";
};
