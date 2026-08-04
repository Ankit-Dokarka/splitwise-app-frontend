import { useState, useMemo } from "react";
import {
  FiX,
  FiSearch,
  FiUserPlus,
  FiUser,
  FiCheck,
  FiUsers,
} from "react-icons/fi";

type SearchedUser = {
  _id: string;
  fullName: string;
  email: string;
  avatar?: string;
};

// Dummy data so the UI search and selection still work visually
const dummyUsers: SearchedUser[] = [
  { _id: "u1", fullName: "Alice Johnson", email: "alice@example.com" },
  { _id: "u2", fullName: "Bob Smith", email: "bob@example.com" },
  { _id: "u3", fullName: "Charlie Brown", email: "charlie@example.com" },
  { _id: "u4", fullName: "Diana Prince", email: "diana@example.com" },
  { _id: "u5", fullName: "Evan Wright", email: "evan@example.com" },
  { _id: "u6", fullName: "Fiona Gallagher", email: "fiona@example.com" },
];

type AddGroupModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddGroupModal({ isOpen, onClose }: AddGroupModalProps) {
  // Group Info State
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");

  // Member Search & Selection State
  const [query, setQuery] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<SearchedUser[]>([]);

  // Filter dummy users locally based on search query
  const filteredUsers = useMemo(() => {
    if (query.trim().length === 0) return dummyUsers;

    const lowerCaseQuery = query.toLowerCase();
    return dummyUsers.filter(
      (user) =>
        user.fullName?.toLowerCase().includes(lowerCaseQuery) ||
        user.email?.toLowerCase().includes(lowerCaseQuery),
    );
  }, [query]);

  // Handle selecting/deselecting members
  const handleToggleMember = (user: SearchedUser) => {
    setSelectedMembers((prev) => {
      const isSelected = prev.some((m) => m._id === user._id);
      if (isSelected) {
        return prev.filter((m) => m._id !== user._id);
      }
      return [...prev, user];
    });
  };

  const handleClose = () => {
    // Reset fields when closing
    setGroupName("");
    setGroupDescription("");
    setQuery("");
    setSelectedMembers([]);
    onClose();
  };

  const handleCreateGroup = () => {
    // Just log the data and close the modal
    console.log("Creating group:", {
      name: groupName,
      description: groupDescription,
      memberIds: selectedMembers.map((m) => m._id),
    });
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      ></div>

      <div className="relative z-10 w-full max-w-lg bg-(--color-surface) rounded-(--btn-radius) shadow-lg border border-(--color-border) overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-(--color-border) shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-(--color-primary)/10 text-(--color-primary) rounded-(--btn-radius)">
              <FiUsers size={20} />
            </div>
            <h3 className="text-base font-semibold text-(--color-text)">
              Create New Group
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="text-(--color-text-muted) hover:text-(--color-text) transition-colors p-1 rounded-(--btn-radius) hover:bg-(--color-bg)"
            aria-label="Close"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 flex flex-col gap-4 overflow-y-auto">
          {/* Group Info Inputs */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-(--color-text) mb-1.5">
                Group Name <span className="text-(--color-danger)">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Apartment 4B, Weekend Trip..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-(--color-bg) border border-(--color-border) rounded-(--btn-radius) focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-(--color-text) mb-1.5">
                Description (Optional)
              </label>
              <textarea
                placeholder="What is this group for?"
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                rows={2}
                className="w-full px-4 py-2.5 text-sm bg-(--color-bg) border border-(--color-border) rounded-(--btn-radius) focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition-all resize-none"
              />
            </div>
          </div>

          {/* Selected Members Chips */}
          {selectedMembers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedMembers.map((m) => (
                <div
                  key={m._id}
                  className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 bg-(--color-primary)/10 text-(--color-primary) text-xs font-medium rounded-full"
                >
                  <div className="w-5 h-5 rounded-full bg-(--color-primary) text-white flex items-center justify-center text-[10px]">
                    {m.fullName?.[0]?.toUpperCase()}
                  </div>
                  {m.fullName}
                  <button
                    onClick={() => handleToggleMember(m)}
                    className="hover:text-(--color-danger)"
                  >
                    <FiX size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-(--color-border) pt-4">
            <h4 className="text-sm font-medium text-(--color-text) mb-3">
              Add Members
            </h4>

            {/* Search Input */}
            <div className="relative mb-3">
              <FiSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-muted)"
                size={16}
              />
              <input
                type="text"
                placeholder="Search name or email to filter..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-(--color-bg) border border-(--color-border) rounded-(--btn-radius) focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition-all"
              />
            </div>

            {/* User List Area */}
            <div className="min-h-32 max-h-48 overflow-y-auto flex flex-col gap-2 pr-1">
              {filteredUsers.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-2 text-(--color-text-muted) text-sm text-center py-8">
                  <p>No matching users found.</p>
                </div>
              )}

              {filteredUsers.map((result) => {
                const isSelected = selectedMembers.some(
                  (m) => m._id === result._id,
                );

                return (
                  <div
                    key={result._id}
                    className={`w-full flex items-center justify-between p-2.5 border rounded-(--btn-radius) transition-colors ${
                      isSelected
                        ? "bg-(--color-primary)/10 border-(--color-primary)/30"
                        : "bg-(--color-bg) border-(--color-border) hover:border-(--color-primary)/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 flex items-center justify-center rounded-full bg-(--color-primary)/10 text-(--color-primary) font-medium text-sm overflow-hidden">
                        {result.avatar ? (
                          <img
                            src={result.avatar}
                            alt={result.fullName}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          result.fullName?.[0]?.toUpperCase() || <FiUser />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-(--color-text)">
                          {result.fullName}
                        </p>
                        <p className="text-xs text-(--color-text-muted)">
                          {result.email}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleMember(result)}
                      className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-(--btn-radius) transition-colors ${
                        isSelected
                          ? "text-(--color-success) bg-(--color-success)/10 hover:bg-(--color-success)/20"
                          : "text-(--color-surface) bg-(--color-primary) hover:bg-(--color-primary-hover)"
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <FiCheck size={14} /> Added
                        </>
                      ) : (
                        <>
                          <FiUserPlus size={14} /> Add
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-3 p-5 bg-(--color-bg)/30 border-t border-(--color-border) shrink-0">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-(--color-text) bg-(--color-surface) border border-(--color-border) rounded-(--btn-radius) hover:bg-(--color-bg) transition-colors shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateGroup}
            disabled={!groupName.trim()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-(--color-surface) bg-(--color-primary) hover:bg-(--color-primary-hover) rounded-(--btn-radius) transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
}
