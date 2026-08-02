import { useEffect, useState, useCallback, type ReactNode } from "react";
import { ExpenseContext } from "./ExpenseContext";
import type { Expense, Balance } from "../../types/expence";
import useAuth from "../../hooks/useAuth";
import { expenseAPI } from "../../api/expense/api";

type ExpenseProviderProps = {
  children: ReactNode;
};

export function ExpenseProvider({ children }: ExpenseProviderProps) {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchExpenses = useCallback(async () => {
    if (!user) return;
    try {
      const data = await expenseAPI.getExpenses();
      setExpenses(data.expenses);
      setBalances(data.balances);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const addExpense = async (payload: {
    description: string;
    amount: number;
    memberId: string;
    paidBy: string;
  }) => {
    await expenseAPI.createExpense(payload);
    await fetchExpenses(); // Re-fetch to update the list and balances
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        setExpenses,
        balances,
        setBalances,
        addExpense,
        isLoading,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}
