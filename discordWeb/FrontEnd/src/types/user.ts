export type user = {
  token: string;
  email: string;
  userId: string;
  userName: string;
};
export type User = {
  email: string;
  userName: string | undefined;
  token: string;
  profilePhoto?: string;
};
