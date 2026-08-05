import { useState, useEffect } from "react";
import { FiX, FiAlertCircle, FiLoader } from "react-icons/fi";
import { useExpense } from "../context/expense/ExpenseContext";
import { useGroup } from "../context/groups/GroupsContext";

type AddExpenseModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddExpenseModal({
  isOpen,
  onClose,
}: AddExpenseModalProps) {
  const { addExpense } = useExpense();
  const { allUsers, groups } = useGroup();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [groupId, setGroupId] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    [],
  );
  const [splitType, setSplitType] = useState<"equal" | "percentage">("equal");

  // State to hold percentages for each user: { [userId]: "25" }
  const [percentages, setPercentages] = useState<Record<string, string>>({});

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setDescription("");
      setAmount("");
      setGroupId("");
      setSelectedParticipants([]);
      setSplitType("equal");
      setPercentages({});
      setErrors({});
      setApiError(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Find the selected group object
  const selectedGroup = groups.find((g) => g._id === groupId);

  // Filter allUsers to only show those who are members of the selected group
  const availableParticipants = selectedGroup
    ? allUsers.filter((u) =>
        selectedGroup.members.some((m) =>
          typeof m === "string" ? m === u._id : m._id === u._id,
        ),
      )
    : [];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = "Valid amount is required";
    }
    if (!groupId) newErrors.groupId = "Please select a group";
    if (selectedParticipants.length === 0)
      newErrors.participants = "Select at least one participant";

    if (splitType === "percentage") {
      const total = selectedParticipants.reduce((sum, userId) => {
        return sum + (Number(percentages[userId]) || 0);
      }, 0);

      if (total !== 100) {
        newErrors.percentages = `Total percentage must equal 100% (currently ${total}%)`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const toggleParticipant = (userId: string) => {
    setSelectedParticipants((prev) => {
      if (prev.includes(userId)) {
        // Remove user and their percentage
        const newPercentages = { ...percentages };
        delete newPercentages[userId];
        setPercentages(newPercentages);
        return prev.filter((id) => id !== userId);
      }
      return [...prev, userId];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setApiError(null);

    try {
      // Construct payload to match backend requirements
      const payload = {
        title: title.trim(),
        description: description.trim(),
        amount: Number(amount),
        groupId,
        splitType, 
        participants: selectedParticipants.map((userId) => ({
          user: userId,
          percentage:
            splitType === "percentage"
              ? Number(percentages[userId])
              : undefined,
        })),
      };

      await addExpense(payload);
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

      <div className="relative z-10 w-full max-w-md bg-(--color-surface) rounded-(--btn-radius) shadow-lg border border-(--color-border) overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-(--color-border) shrink-0">
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

        <form onSubmit={handleSubmit} className="flex flex-col overflow-y-auto">
          <div className="p-5 flex flex-col gap-4">
            {apiError && (
              <div className="flex items-center gap-2 text-sm text-(--color-danger) bg-(--color-danger)/10 p-3 rounded-(--btn-radius) border border-(--color-danger)/30">
                <FiAlertCircle size={16} className="shrink-0" />
                <p>{apiError}</p>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-(--color-text)">
                Title <span className="text-(--color-danger)">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Groceries, Rent"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 text-sm bg-(--color-bg) border border-(--color-border) rounded-(--btn-radius) focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition-all disabled:opacity-70"
              />
              {errors.title && (
                <p className="text-xs text-(--color-danger)">{errors.title}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-(--color-text)">
                Description
              </label>
              <input
                type="text"
                placeholder="Optional notes"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 text-sm bg-(--color-bg) border border-(--color-border) rounded-(--btn-radius) focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition-all disabled:opacity-70"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-(--color-text)">
                Amount <span className="text-(--color-danger)">*</span>
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
                Select Group <span className="text-(--color-danger)">*</span>
              </label>
              <select
                value={groupId}
                onChange={(e) => {
                  setGroupId(e.target.value);
                  setSelectedParticipants([]); // Reset participants when group changes
                }}
                disabled={isSubmitting || groups.length === 0}
                className="w-full px-4 py-2.5 text-sm bg-(--color-bg) border border-(--color-border) rounded-(--btn-radius) focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition-all disabled:opacity-70"
              >
                <option value="">
                  {groups.length === 0
                    ? "Create a group first..."
                    : "Choose a group..."}
                </option>
                {groups.map((g) => (
                  <option key={g._id} value={g._id}>
                    {g.name}
                  </option>
                ))}
              </select>
              {errors.groupId && (
                <p className="text-xs text-(--color-danger)">
                  {errors.groupId}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-(--color-text)">
                Split Type
              </label>
              <select
                value={splitType}
                onChange={(e) =>
                  setSplitType(e.target.value as "equal" | "percentage")
                }
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 text-sm bg-(--color-bg) border border-(--color-border) rounded-(--btn-radius) focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition-all disabled:opacity-70"
              >
                <option value="equal">Equal</option>
                <option value="percentage">Percentage</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-(--color-text)">
                Participants <span className="text-(--color-danger)">*</span>
              </label>
              <div className="max-h-48 overflow-y-auto flex flex-col gap-1 border border-(--color-border) rounded-(--btn-radius) p-2 bg-(--color-bg)">
                {!groupId ? (
                  <p className="text-xs text-(--color-text-muted) p-2 text-center">
                    Please select a group to see participants.
                  </p>
                ) : availableParticipants.length === 0 ? (
                  <p className="text-xs text-(--color-text-muted) p-2 text-center">
                    No users found in this group.
                  </p>
                ) : (
                  availableParticipants.map((u) => {
                    const isChecked = selectedParticipants.includes(u._id);
                    return (
                      <div
                        key={u._id}
                        className={`flex items-center justify-between gap-2 p-2 rounded transition-colors ${
                          isChecked
                            ? "bg-(--color-primary)/5"
                            : "hover:bg-(--color-surface)"
                        }`}
                      >
                        <label className="flex items-center gap-2 cursor-pointer flex-1">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleParticipant(u._id)}
                            className="w-4 h-4 rounded text-(--color-primary) focus:ring-(--color-primary)"
                          />
                          <span className="text-sm text-(--color-text) truncate">
                            {u.fullName}
                          </span>
                        </label>

                        {/* Show percentage input only if splitType is percentage AND user is selected */}
                        {splitType === "percentage" && isChecked && (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              placeholder="0"
                              value={percentages[u._id] || ""}
                              onChange={(e) =>
                                setPercentages((prev) => ({
                                  ...prev,
                                  [u._id]: e.target.value,
                                }))
                              }
                              className="w-16 px-2 py-1 text-sm bg-(--color-surface) border border-(--color-border) rounded focus:outline-none focus:ring-1 focus:ring-(--color-primary)"
                            />
                            <span className="text-xs text-(--color-text-muted)">
                              %
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
              {errors.participants && (
                <p className="text-xs text-(--color-danger)">
                  {errors.participants}
                </p>
              )}
              {errors.percentages && (
                <p className="text-xs text-(--color-danger)">
                  {errors.percentages}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 p-5 bg-(--color-bg)/30 border-t border-(--color-border) shrink-0">
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
