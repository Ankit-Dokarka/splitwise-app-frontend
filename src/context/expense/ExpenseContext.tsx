import { createContext, useContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Expense } from "../../types/expence";

type ExpenseContextType = {
  expenses: Expense[];
  setExpenses: Dispatch<SetStateAction<Expense[]>>;
  addExpense: (expense: Expense) => void;
};

export const ExpenseContext = createContext<ExpenseContextType | null>(null);

export function useExpense() {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error("useExpense must be used within an AuthProvider");
  }
  return context;
}
