import { useState, useEffect } from "react";
import {
  FiX,
  FiSearch,
  FiLoader,
  FiUserPlus,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import { useDebounce } from "../hooks/useDebounce";
import { useMembers } from "../context/members/MembersContext";

type AddMemberModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddMemberModal({
  isOpen,
  onClose,
}: AddMemberModalProps) {
  const { searchUser, addMember, members } = useMembers();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<{ email: string }[]>([]);
  const [addedEmail, setAddedEmail] = useState<string | null>(null);
  const [addingEmail, setAddingEmail] = useState<string | null>(null);

  useEffect(() => {
    if (debouncedQuery.trim().length < 3) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    let isMounted = true;
    setIsSearching(true);
    setSearchResults([]);
    setAddedEmail(null);

    searchUser(debouncedQuery).then((results) => {
      if (isMounted) {
        setSearchResults(results);
        setIsSearching(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery]);

  useEffect(() => {
    if (!isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery("");
      setSearchResults([]);
      setIsSearching(false);
      setAddedEmail(null);
      setAddingEmail(null);
    }
  }, [isOpen]);

  const handleAddMember = (email: string) => {
    setAddingEmail(email);

    setTimeout(() => {
      const newMember = {
        id: crypto.randomUUID(),
        email: email,
      };
      addMember(newMember);
      setAddingEmail(null);
      setAddedEmail(email);
      setTimeout(() => onClose(), 1500);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative z-10 w-full max-w-md bg-(--color-surface) rounded-(--btn-radius) shadow-lg border border-(--color-border) overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-(--color-border)">
          <h3 className="text-base font-semibold text-(--color-text)">
            Add New Member
          </h3>
          <button
            onClick={onClose}
            className="text-(--color-text-muted) hover:text-(--color-text) transition-colors p-1 rounded-(--btn-radius) hover:bg-(--color-bg)"
            aria-label="Close"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          {!addedEmail && (
            <div className="relative">
              <FiSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-muted)"
                size={16}
              />
              <input
                type="email"
                placeholder="Enter email to search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-(--color-bg) border border-(--color-border) rounded-(--btn-radius) focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition-all"
              />
            </div>
          )}

          <div className="min-h-30 flex items-center justify-center">
            {addedEmail ? (
              <div className="flex flex-col items-center gap-3 text-center py-4">
                <FiCheckCircle size={40} className="text-(--color-success)" />
                <div>
                  <p className="text-sm font-semibold text-(--color-text)">
                    Member Added Successfully!
                  </p>
                  <p className="text-xs text-(--color-text-muted) mt-1">
                    {addedEmail} has been added to your group.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {isSearching && (
                  <div className="flex items-center gap-2 text-(--color-text-muted) text-sm">
                    <FiLoader className="animate-spin" size={18} />
                    Searching for user...
                  </div>
                )}

                {!isSearching &&
                  debouncedQuery.trim().length >= 3 &&
                  searchResults.length === 0 && (
                    <div className="flex flex-col items-center gap-2 text-(--color-text-muted) text-sm text-center">
                      <FiAlertCircle
                        size={24}
                        className="text-(--color-danger)"
                      />
                      <p>No user found with this email.</p>
                    </div>
                  )}

                {!isSearching && debouncedQuery.trim().length < 3 && (
                  <p className="text-sm text-(--color-text-muted) text-center">
                    {query.length === 0
                      ? "Start typing to search."
                      : "Please type at least 3 characters."}
                  </p>
                )}

                {!isSearching && searchResults.length > 0 && (
                  <div className="w-full flex flex-col gap-2 max-h-40 overflow-y-auto">
                    {searchResults.map((result) => {
                      const isAlreadyMember = members.some(
                        (m) => m.email === result.email,
                      );

                      return (
                        <div
                          key={result.email}
                          className="w-full flex items-center justify-between p-3 bg-(--color-bg) border border-(--color-border) rounded-(--btn-radius)"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-(--color-primary)/10 text-(--color-primary) font-medium text-sm uppercase">
                              {result.email[0]}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-(--color-text)">
                                {result.email}
                              </p>
                              {isAlreadyMember && (
                                <p className="text-xs text-(--color-text-muted)">
                                  Already a member
                                </p>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => handleAddMember(result.email)}
                            disabled={isAlreadyMember || addingEmail !== null}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-(--color-surface) bg-(--color-primary) hover:bg-(--color-primary-hover) rounded-(--btn-radius) transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {addingEmail === result.email ? (
                              <FiLoader className="animate-spin" size={14} />
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
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 p-5 bg-(--color-bg)/30 border-t border-(--color-border)">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-(--color-text) bg-(--color-surface) border border-(--color-border) rounded-(--btn-radius) hover:bg-(--color-bg) transition-colors shadow-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
