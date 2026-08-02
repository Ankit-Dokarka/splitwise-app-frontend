export type UserRef = {
  _id: string;
  fullName: string;
  email: string;
  avatar: string;
};

export type Participant = {
  user: UserRef;
  share: number;
};

export type Expense = {
  _id: string;
  description: string;
  amount: number;
  currency: string;
  paidBy: UserRef;
  participants: Participant[];
  splitType: string;
  createdAt: string;
};

export type Balance = {
  user: UserRef;
  amount: number;
};
