import { useState } from "react";
import {
  FiPlus,
  FiArrowDownCircle,
  FiArrowUpCircle,
  FiUsers,
  FiCreditCard,
} from "react-icons/fi";
import { useGroup } from "../context/groups/GroupsContext";
import { useExpense } from "../context/expense/ExpenseContext";
import AddExpenseModal from "../modals/AddExpenseModal";

export default function Dashboard() {
  // Using allUsers and groups from the updated GroupsContext
  const { allUsers, groups } = useGroup();
  const { balances, expenses, isLoading } = useExpense();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hasGroups = groups.length > 0;
  const hasExpenses = expenses.length > 0;

  // Calculate balances from the backend array
  const youOwe = balances
    .filter((b) => b.amount < 0)
    .reduce((sum, b) => sum + Math.abs(b.amount), 0);

  const youAreOwed = balances
    .filter((b) => b.amount > 0)
    .reduce((sum, b) => sum + b.amount, 0);

  const totalBalance = youAreOwed - youOwe;

  const formatINR = (val: number) =>
    `₹${val.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-(--color-border) border-t-(--color-primary) rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!hasExpenses) {
    return (
      <>
        <div className="flex flex-col items-center justify-center text-center py-20 px-6 bg-(--color-surface) border border-(--color-border) rounded-(--btn-radius) shadow-sm">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-(--color-primary)/10 mb-5">
            <FiCreditCard size={28} className="text-(--color-primary)" />
          </div>
          <h3 className="text-lg font-semibold text-(--color-text) mb-1.5">
            No expenses yet
          </h3>
          <p className="text-sm text-(--color-text-muted) mb-6 max-w-xs">
            Start by adding your first expense to track shared costs and
            balances.
          </p>

          <div className="relative group w-full max-w-xs">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full flex justify-center items-center gap-2 px-4 py-2.5 bg-(--color-primary) hover:bg-(--color-primary-hover) text-(--color-surface) text-sm font-medium rounded-(--btn-radius) transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-(--color-primary)"
              disabled={!hasGroups}
            >
              <FiPlus size={16} />
              Add Expense
            </button>

            {!hasGroups && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max max-w-55 bg-(--color-text) text-(--color-surface) text-xs font-medium px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-lg z-10">
                Please create a group to add an expense
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-(--color-text) rotate-45"></div>
              </div>
            )}
          </div>
        </div>

        <AddExpenseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="relative group w-full md:w-auto">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full md:w-auto flex justify-center items-center gap-2 px-4 py-2.5 bg-(--color-primary) hover:bg-(--color-primary-hover) text-(--color-surface) text-sm font-medium rounded-(--btn-radius) transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-(--color-primary)"
                disabled={!hasGroups}
              >
                <FiPlus size={16} />
                Add Expense
              </button>

              {!hasGroups && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max max-w-55 bg-(--color-text) text-(--color-surface) text-xs font-medium px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-lg z-10">
                  Please create a group to add an expense
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-(--color-text) rotate-45"></div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Total Balance Card */}
          <div className="relative bg-(--color-surface) border border-(--color-border) p-6 rounded-(--btn-radius) shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-32 h-32 bg-(--color-primary)/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-(--color-text-muted)">
                  Total Balance
                </p>
                <p
                  className={`text-3xl font-bold mt-2 ${
                    totalBalance > 0
                      ? "text-(--color-success)"
                      : totalBalance < 0
                        ? "text-(--color-danger)"
                        : "text-(--color-text)"
                  }`}
                >
                  {totalBalance < 0 ? "-" : ""}
                  {formatINR(Math.abs(totalBalance))}
                </p>
                <p className="text-xs text-(--color-text-muted) mt-2 flex items-center gap-1">
                  {totalBalance > 0 ? (
                    <>
                      <FiArrowUpCircle
                        size={12}
                        className="text-(--color-success)"
                      />
                      You are owed overall
                    </>
                  ) : totalBalance < 0 ? (
                    <>
                      <FiArrowDownCircle
                        size={12}
                        className="text-(--color-danger)"
                      />
                      You owe overall
                    </>
                  ) : (
                    <>
                      <span className="text-[12px] font-semibold">₹</span>
                      All settled up
                    </>
                  )}
                </p>
              </div>
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-(--btn-radius) ${
                  totalBalance >= 0
                    ? "bg-(--color-primary)/10 text-(--color-primary)"
                    : "bg-(--color-danger)/10 text-(--color-danger)"
                }`}
              >
                <span className="text-2xl font-semibold">₹</span>
              </div>
            </div>
          </div>

          {/* You Owe Card */}
          <div className="relative bg-(--color-surface) border border-(--color-border) p-6 rounded-(--btn-radius) shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-32 h-32 bg-(--color-danger)/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-(--color-text-muted)">
                  You Owe
                </p>
                <p className="text-3xl font-bold text-(--color-danger) mt-2">
                  {formatINR(youOwe)}
                </p>
                <p className="text-xs text-(--color-text-muted) mt-2 flex items-center gap-1">
                  <FiUsers size={12} />
                  Across {allUsers.length} members
                </p>
              </div>
              <div className="w-12 h-12 flex items-center justify-center rounded-(--btn-radius) bg-(--color-danger)/10 text-(--color-danger)">
                <FiArrowDownCircle size={24} />
              </div>
            </div>
          </div>

          {/* You are Owed Card */}
          <div className="relative bg-(--color-surface) border border-(--color-border) p-6 rounded-(--btn-radius) shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-32 h-32 bg-(--color-success)/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-(--color-text-muted)">
                  You are Owed
                </p>
                <p className="text-3xl font-bold text-(--color-success) mt-2">
                  {formatINR(youAreOwed)}
                </p>
                <p className="text-xs text-(--color-text-muted) mt-2 flex items-center gap-1">
                  <FiUsers size={12} />
                  Across {allUsers.length} members
                </p>
              </div>
              <div className="w-12 h-12 flex items-center justify-center rounded-(--btn-radius) bg-(--color-success)/10 text-(--color-success)">
                <FiArrowUpCircle size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
