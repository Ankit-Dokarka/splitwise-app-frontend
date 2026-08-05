import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FiLoader,
  FiCreditCard,
  FiUsers,
  FiCalendar,
  FiPlus,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { useGroup } from "../context/groups/GroupsContext";

const BASE_URL = import.meta.env.VITE_API_URL;

// Types
type UserRef = {
  _id: string;
  fullName: string;
  email: string;
};

type Participant = {
  user: UserRef;
  amount: number;
  percentage: number;
  paid: boolean;
};

type Expense = {
  _id: string;
  title: string;
  description: string;
  amount: number;
  paidBy: UserRef;
  participants: Participant[];
  splitType: string;
  createdAt: string;
};

export default function GroupDetails() {
  const { groupId } = useParams<{ groupId: string }>();
  const { groups } = useGroup();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentGroup = groups.find((g) => g._id === groupId);

  useEffect(() => {
    if (!groupId) return;

    const fetchGroupExpenses = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${BASE_URL}/api/expenses/group/${groupId}`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Failed to fetch expenses");

        setExpenses(data.expenses || []);
      } catch (err) {
        console.error("Error fetching group expenses:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroupExpenses();
  }, [groupId]);

  const formatINR = (val: number) =>
    `₹${val.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const formatDate = (isoString: string) =>
    new Date(isoString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  // Calculate total amount spent in this group
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="p-8 md:p-4 bg-(--color-bg) font-sans text-(--color-text)">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-(--color-primary)/10 text-(--color-primary) rounded-2xl">
              <FiUsers size={28} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                {currentGroup?.name || "Group Details"}
              </h1>
              <p className="text-sm text-(--color-text-muted) mt-0.5">
                {expenses.length}{" "}
                {expenses.length === 1 ? "Activity" : "Activities"} • Total{" "}
                {formatINR(totalSpent)}
              </p>
            </div>
          </div>

          <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-(--color-primary) hover:bg-(--color-primary-hover) text-white text-sm font-semibold rounded-(--btn-radius) transition-colors shadow-sm shadow-(--color-primary)/20">
            <FiPlus size={18} />
            Add Expense
          </button>
        </div>

        {/* Content Area */}
        {isLoading && (
          <div className="flex items-center justify-center py-24 bg-(--color-surface) border border-(--color-border) rounded-(--btn-radius) shadow-sm">
            <FiLoader
              className="animate-spin text-(--color-primary)"
              size={32}
            />
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 text-sm text-(--color-danger) bg-(--color-danger)/10 p-4 rounded-(--btn-radius) border border-(--color-danger)/30">
            <FiAlertCircle size={20} className="shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && expenses.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-20 px-6 bg-(--color-surface) border border-(--color-border) rounded-(--btn-radius) shadow-sm">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-(--color-primary)/10 mb-5">
              <FiCreditCard size={28} className="text-(--color-primary)" />
            </div>
            <h3 className="text-lg font-semibold text-(--color-text) mb-1.5">
              No expenses yet
            </h3>
            <p className="text-sm text-(--color-text-muted) mb-6 max-w-xs">
              Start tracking shared costs by adding your first expense to this
              group.
            </p>
          </div>
        )}

        {/* Expenses List */}
        {!isLoading && !error && expenses.length > 0 && (
          <div className="flex flex-col gap-5">
            {expenses.map((expense) => (
              <div
                key={expense._id}
                className="bg-(--color-surface) border border-(--color-border) rounded-(--btn-radius) shadow-sm overflow-hidden transition-all hover:shadow-md hover:border-(--color-primary)/20"
              >
                {/* Expense Header */}
                <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-(--color-border)/70">
                  <div className="flex items-center gap-4">
                    {/* Paid By Avatar */}
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-(--color-primary)/10 text-(--color-primary) flex items-center justify-center text-base font-bold border-2 border-(--color-surface)">
                        {expense.paidBy.fullName?.[0]?.toUpperCase()}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-(--color-success) rounded-full flex items-center justify-center border-2 border-(--color-surface)">
                        <FiCheckCircle size={10} className="text-white" />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-semibold text-(--color-text)">
                        {expense.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-(--color-text-muted)">
                        <span className="flex items-center gap-1">
                          <FiCalendar size={12} />
                          {formatDate(expense.createdAt)}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-(--color-text-muted)"></span>
                        <span>
                          Paid by{" "}
                          <strong className="text-(--color-text) font-medium">
                            {expense.paidBy.fullName}
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-left md:text-right pl-16 md:pl-0">
                    <p className="text-xl font-bold text-(--color-text)">
                      {formatINR(expense.amount)}
                    </p>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-(--color-primary) bg-(--color-primary)/10 px-2 py-0.5 rounded-full">
                      {expense.splitType} split
                    </span>
                  </div>
                </div>

                {/* Description (Optional) */}
                {expense.description && (
                  <div className="px-5 py-3 bg-(--color-bg)/40 text-sm text-(--color-text-muted) border-b border-(--color-border)/70 italic">
                    "{expense.description}"
                  </div>
                )}

                {/* Participants Breakdown */}
                <div className="p-5">
                  <h4 className="text-[11px] uppercase font-bold text-(--color-text-muted) mb-4 tracking-wider">
                    Split Breakdown
                  </h4>
                  <div className="flex flex-col gap-3">
                    {expense.participants.map((p, index) => {
                      const isPayer = p.user._id === expense.paidBy._id;

                      return (
                        <div
                          key={p.user._id || index}
                          className="flex items-center justify-between p-3 bg-(--color-bg) rounded-xl border border-(--color-border)/70"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-(--color-surface) border border-(--color-border) flex items-center justify-center text-xs font-semibold text-(--color-text)">
                              {p.user.fullName?.[0]?.toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-(--color-text)">
                                {p.user.fullName}{" "}
                                {isPayer && (
                                  <span className="text-(--color-text-muted) text-xs">
                                    (Payer)
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-(--color-text-muted)">
                                {p.user.email}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col items-end">
                            <p className="text-sm font-bold text-(--color-text)">
                              {formatINR(p.amount)}
                            </p>
                            {isPayer ? (
                              <span className="text-[10px] font-medium text-(--color-success) bg-(--color-success)/10 px-1.5 py-0.5 rounded mt-0.5">
                                Fronted the bill
                              </span>
                            ) : p.paid ? (
                              <span className="text-[10px] font-medium text-(--color-success) flex items-center gap-0.5 mt-0.5">
                                <FiCheckCircle size={10} /> Settled
                              </span>
                            ) : (
                              <span className="text-[10px] font-medium text-(--color-danger) bg-(--color-danger)/10 px-1.5 py-0.5 rounded mt-0.5">
                                Owes
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
