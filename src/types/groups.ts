export type User = {
  _id: string;
  fullName: string;
  email: string;
  avatar?: string;
};
export type SearchedUser = User;

export type Group = {
  _id: string;
  name: string;
  description?: string;
  members: User[] | string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};
