import { useState, useEffect } from "react";
import { FiX, FiAlertCircle, FiLoader } from "react-icons/fi";
import { useExpense } from "../context/expense/ExpenseContext";
import { useGroup } from "../context/groups/GroupsContext";
import useAuth from "../hooks/useAuth";

type AddExpenseModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddExpenseModal({
  isOpen,
  onClose,
}: AddExpenseModalProps) {
  const { addExpense } = useExpense();
  // Updated to use allUsers instead of members
  const { allUsers } = useGroup();
  const { user } = useAuth();

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [memberId, setMemberId] = useState("");
  const [paidBy, setPaidBy] = useState(user?._id || "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // API states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setDescription("");
      setAmount("");
      setMemberId("");
      setPaidBy(user?._id || "");
      setErrors({});
      setApiError(null);
      setIsSubmitting(false);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!description.trim()) newErrors.description = "Description is required";
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = "Valid amount is required";
    }
    if (!memberId) newErrors.memberId = "Please select a member";
    if (!paidBy) newErrors.paidBy = "Please select who paid";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setApiError(null);

    try {
      await addExpense({
        description: description.trim(),
        amount: Number(amount),
        memberId,
        paidBy,
      });
      onClose();
    } catch (err) {
      setApiError(
        err instanceof Error ? err.message : "Failed to add expense.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative z-10 w-full max-w-md bg-(--color-surface) rounded-(--btn-radius) shadow-lg border border-(--color-border) overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-(--color-border)">
          <h3 className="text-base font-semibold text-(--color-text)">
            Add New Expense
          </h3>
          <button
            onClick={onClose}
            className="text-(--color-text-muted) hover:text-(--color-text) transition-colors p-1 rounded-(--btn-radius) hover:bg-(--color-bg)"
            aria-label="Close"
            disabled={isSubmitting}
          >
            <FiX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="p-5 flex flex-col gap-4">
            {apiError && (
              <div className="flex items-center gap-2 text-sm text-(--color-danger) bg-(--color-danger)/10 p-3 rounded-(--btn-radius) border border-(--color-danger)/30">
                <FiAlertCircle size={16} className="shrink-0" />
                <p>{apiError}</p>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-(--color-text)">
                Description
              </label>
              <input
                type="text"
                placeholder="e.g. Groceries, Rent"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 text-sm bg-(--color-bg) border border-(--color-border) rounded-(--btn-radius) focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition-all disabled:opacity-70"
              />
              {errors.description && (
                <p className="text-xs text-(--color-danger)">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-(--color-text)">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-muted) text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full pl-8 pr-4 py-2.5 text-sm bg-(--color-bg) border border-(--color-border) rounded-(--btn-radius) focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition-all disabled:opacity-70"
                />
              </div>
              {errors.amount && (
                <p className="text-xs text-(--color-danger)">{errors.amount}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-(--color-text)">
                Select Member
              </label>
              <select
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 text-sm bg-(--color-bg) border border-(--color-border) rounded-(--btn-radius) focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition-all disabled:opacity-70"
              >
                <option value="">Choose a member...</option>
                {allUsers.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.fullName} ({m.email})
                  </option>
                ))}
              </select>
              {errors.memberId && (
                <p className="text-xs text-(--color-danger)">
                  {errors.memberId}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-(--color-text)">
                Paid By
              </label>
              <select
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 text-sm bg-(--color-bg) border border-(--color-border) rounded-(--btn-radius) focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition-all disabled:opacity-70"
              >
                <option value={user?._id || ""}>You ({user?.fullName})</option>
                {allUsers.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.fullName}
                  </option>
                ))}
              </select>
              {errors.paidBy && (
                <p className="text-xs text-(--color-danger)">{errors.paidBy}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-(--color-text)">
                Split Rule
              </label>
              <select
                disabled
                className="w-full px-4 py-2.5 text-sm bg-(--color-bg) border border-(--color-border) rounded-(--btn-radius) focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition-all opacity-70 cursor-not-allowed"
              >
                <option>Equal</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 p-5 bg-(--color-bg)/30 border-t border-(--color-border)">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-(--color-text) bg-(--color-surface) border border-(--color-border) rounded-(--btn-radius) hover:bg-(--color-bg) transition-colors shadow-sm disabled:opacity-70"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-(--color-surface) bg-(--color-primary) hover:bg-(--color-primary-hover) rounded-(--btn-radius) transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <FiLoader className="animate-spin" size={14} />
                  Adding...
                </>
              ) : (
                "Add Expense"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
