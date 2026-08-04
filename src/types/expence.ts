export type UserRef = {
  _id: string;
  fullName: string;
  email: string;
  avatar: string;
};

export type Participant = {
  user: UserRef;
  amount: number;
  percentage: number;
  paid: boolean;
};

export type Expense = {
  _id: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  paidBy: UserRef;
  group: string;
  participants: Participant[];
  splitType: string;
  createdAt: string;
};

export type Balance = {
  user: UserRef;
  amount: number;
};

export type CreateExpensePayload = {
  title: string;
  description?: string;
  amount: number;
  groupId: string;
  splitType: "equal" | "percentage";
  participants: { user: string; percentage?: number }[];
  ticipants: { user: string; percentage?: number }[];
};
