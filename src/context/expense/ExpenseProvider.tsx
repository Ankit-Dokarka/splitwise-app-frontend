import { useEffect, useState, type ReactNode } from "react";
import { ExpenseContext } from "./ExpenseContext";
import type { Expense } from "../../types/expence";
import useAuth from "../../hooks/useAuth";
import type { Member } from "../../types/member";

type ExpenseProviderProps = {
  children: ReactNode;
};

export function ExpenseProvider({ children }: ExpenseProviderProps) {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    if (!user) return;

    const allExpenses = JSON.parse(localStorage.getItem("expenses") ?? "{}");

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setExpenses(allExpenses[user.email] ?? []);
  }, [user]);

  const addExpense = (expense: Expense) => {
    if (!user) return;

    const updatedExpenses = [...expenses, expense];
    setExpenses(updatedExpenses);

    const allExpenses = JSON.parse(localStorage.getItem("expenses") ?? "{}");

    allExpenses[user.email] = updatedExpenses;

    const allMembers = JSON.parse(localStorage.getItem("members") ?? "{}");
    const userMembers: Member[] = allMembers[user.email] ?? [];

    const member = userMembers.find((m) => m.id === expense.memberId);

    if (member && member.email !== user.email) {
      const otherUserExpenses: Expense[] = allExpenses[member.email] ?? [];

      const exists = otherUserExpenses.some((e) => e.id === expense.id);
      if (!exists) {
        allExpenses[member.email] = [...otherUserExpenses, expense];
      }
    }

    localStorage.setItem("expenses", JSON.stringify(allExpenses));
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        setExpenses,
        addExpense,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}
