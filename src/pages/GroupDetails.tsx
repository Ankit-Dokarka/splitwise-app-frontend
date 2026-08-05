import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FiLoader,
  FiCreditCard,
  FiUsers,
  FiCalendar,
  FiCheckCircle,
  FiAlertCircle,
  FiX,
  FiSearch,
  FiUserPlus,
  FiUser,
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

  // Add Member Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<UserRef[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserRef | null>(null);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const currentGroup = groups.find((g) => g._id === groupId);

  // Extract members safely from the context data
  const groupMembers: UserRef[] = (currentGroup?.members as UserRef[]) || [];

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

    // NEW: Fetch balances for the group
    const fetchBalances = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/balances/${groupId}`, {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();
        if (response.ok) {
          console.log(`Fetched Balances for Group ${groupId}:`, data.balances);
        } else {
          console.error("Failed to fetch balances:", data.message);
        }
      } catch (err) {
        console.error("Error fetching balances:", err);
      }
    };

    fetchGroupExpenses();
    fetchBalances();
  }, [groupId]);

  const formatINR = (val: number) =>
    `₹${val.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const formatDate = (isoString: string) =>
    new Date(isoString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Modal Handlers
  const handleOpenModal = async () => {
    setIsModalOpen(true);
    setModalError(null);
    setSelectedUser(null);
    setSearchTerm("");
    setIsLoadingUsers(true);

    try {
      const response = await fetch(`${BASE_URL}/api/users`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch users");
      setAllUsers(data.users || []);
    } catch (err) {
      setModalError(
        err instanceof Error ? err.message : "Failed to load users",
      );
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddMember = async () => {
    if (!selectedUser || !groupId) return;

    setIsAddingMember(true);
    setModalError(null);

    try {
      const response = await fetch(
        `${BASE_URL}/api/groups/${groupId}/add-member`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ userId: selectedUser._id }),
        },
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to add member");

      handleCloseModal();
      // Note: You might want to trigger a refetch of groups in your context here
      // so the new member shows up in the list immediately.
    } catch (err) {
      setModalError(
        err instanceof Error ? err.message : "Failed to add member",
      );
    } finally {
      setIsAddingMember(false);
    }
  };

  // Filtered users for search
  const filteredUsers = allUsers.filter(
    (u) =>
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-4 md:p-8 bg-(--color-bg) font-sans text-(--color-text) relative">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
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

          <button
            onClick={handleOpenModal}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-(--color-primary) hover:bg-(--color-primary-hover) text-white text-sm font-semibold rounded-(--btn-radius) transition-colors shadow-sm shadow-(--color-primary)/20"
          >
            <FiUserPlus size={18} />
            Add Member
          </button>
        </div>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN: Expenses List (Takes 2 columns on large screens) */}
          <div className="lg:col-span-2">
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

            {!isLoading && !error && expenses.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center py-20 px-6 bg-(--color-surface) border border-(--color-border) rounded-(--btn-radius) shadow-sm">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-(--color-primary)/10 mb-5">
                  <FiCreditCard size={28} className="text-(--color-primary)" />
                </div>
                <h3 className="text-lg font-semibold text-(--color-text) mb-1.5">
                  No expenses yet
                </h3>
                <p className="text-sm text-(--color-text-muted) mb-6 max-w-xs">
                  Start tracking shared costs by adding your first expense to
                  this group.
                </p>
              </div>
            )}

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

          {/* RIGHT COLUMN: Group Members List */}
          <div className="lg:col-span-1">
            <div className="bg-(--color-surface) border border-(--color-border) rounded-(--btn-radius) shadow-sm p-5 sticky top-8">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-(--color-text) uppercase tracking-wider flex items-center gap-2">
                  <FiUsers size={16} className="text-(--color-primary)" />
                  Group Members
                </h4>
                <span className="text-xs font-medium text-(--color-text-muted) bg-(--color-bg) px-2 py-0.5 rounded-full">
                  {groupMembers.length}
                </span>
              </div>

              {groupMembers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FiUser
                    size={24}
                    className="text-(--color-text-muted) mb-2"
                  />
                  <p className="text-xs text-(--color-text-muted)">
                    No members found.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-1">
                  {groupMembers.map((member) => (
                    <div
                      key={member._id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-(--color-bg) transition-colors"
                    >
                      <div className="w-9 h-9 rounded-full bg-(--color-primary)/10 text-(--color-primary) flex items-center justify-center text-sm font-bold overflow-hidden">
                        {member.fullName?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-(--color-text) truncate">
                          {member.fullName}
                        </p>
                        <p className="text-xs text-(--color-text-muted) truncate">
                          {member.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={handleCloseModal}
          ></div>

          <div className="relative z-10 w-full max-w-md bg-(--color-surface) rounded-(--btn-radius) shadow-lg border border-(--color-border) overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-(--color-border) shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-(--color-primary)/10 text-(--color-primary) rounded-(--btn-radius)">
                  <FiUserPlus size={20} />
                </div>
                <h3 className="text-base font-semibold text-(--color-text)">
                  Add Member to Group
                </h3>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-(--color-text-muted) hover:text-(--color-text) p-1 rounded-(--btn-radius) hover:bg-(--color-bg)"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4 overflow-y-auto">
              {modalError && (
                <div className="flex items-center gap-2 text-sm text-(--color-danger) bg-(--color-danger)/10 p-3 rounded-(--btn-radius) border border-(--color-danger)/30">
                  <FiAlertCircle size={16} className="shrink-0" />
                  <p>{modalError}</p>
                </div>
              )}

              <div className="relative">
                <FiSearch
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-muted)"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-(--color-bg) border border-(--color-border) rounded-(--btn-radius) focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition-all"
                />
              </div>

              <div className="min-h-40 max-h-60 overflow-y-auto flex flex-col gap-2 pr-1">
                {isLoadingUsers && (
                  <div className="flex items-center justify-center gap-2 text-(--color-text-muted) text-sm py-8">
                    <FiLoader className="animate-spin" size={18} />
                    Fetching users...
                  </div>
                )}

                {!isLoadingUsers && filteredUsers.length === 0 && (
                  <div className="flex flex-col items-center justify-center gap-2 text-(--color-text-muted) text-sm text-center py-8">
                    <FiAlertCircle size={24} />
                    <p>No matching users found.</p>
                  </div>
                )}

                {!isLoadingUsers &&
                  filteredUsers.map((user) => {
                    const isSelected = selectedUser?._id === user._id;
                    return (
                      <div
                        key={user._id}
                        onClick={() => setSelectedUser(user)}
                        className={`w-full flex items-center justify-between p-3 border rounded-(--btn-radius) transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-(--color-primary)/10 border-(--color-primary)/30"
                            : "bg-(--color-bg) border-(--color-border) hover:border-(--color-primary)/30"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 flex items-center justify-center rounded-full bg-(--color-primary)/10 text-(--color-primary) font-medium text-sm overflow-hidden">
                            {user.fullName?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-(--color-text)">
                              {user.fullName}
                            </p>
                            <p className="text-xs text-(--color-text-muted)">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        {isSelected && (
                          <FiCheckCircle
                            size={18}
                            className="text-(--color-primary)"
                          />
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="flex justify-end gap-3 p-5 bg-(--color-bg)/30 border-t border-(--color-border) shrink-0">
              <button
                onClick={handleCloseModal}
                disabled={isAddingMember}
                className="px-4 py-2 text-sm font-medium text-(--color-text) bg-(--color-surface) border border-(--color-border) rounded-(--btn-radius) hover:bg-(--color-bg) transition-colors shadow-sm disabled:opacity-70"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMember}
                disabled={!selectedUser || isAddingMember}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-(--color-surface) bg-(--color-primary) hover:bg-(--color-primary-hover) rounded-(--btn-radius) transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingMember ? (
                  <>
                    <FiLoader className="animate-spin" size={14} />
                    Adding...
                  </>
                ) : (
                  "Add to Group"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
