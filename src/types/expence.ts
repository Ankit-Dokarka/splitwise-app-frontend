export type Expense = {
  id: string;
  description: string;
  amount: number;
  memberId: string;
  paidBy: string;
  splitRule: "EQUAL";
  createdAt: string;
};
